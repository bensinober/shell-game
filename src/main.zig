const std = @import("std");
const cv = @import("zigcv");
const websocket = @import("websocket");

const Allocator = std.mem.Allocator;
const ArrayList = std.ArrayList;
const Mat = cv.Mat;
const Size = cv.Size;

// *** GLOBALS ***
pub const io_mode = .evented;
var CLASSES: [2][]const u8 = [_][]const u8{ "red_cup", "ball" };

// GameMode is modified by timer and external Socket commands
pub const GameMode = enum(u8) {
    IDLE,
    START,
    STOP,
    SNAP,
    TRACK_BALL,
    TRACK_HIDDEN,
    TRACK_IDLE,
    PREDICT,
    VERDICT,
    _,

    // Probably no longer neccessary
    pub fn enum2str(self: GameMode) []u8 {
        return std.meta.fields(?GameMode)[self];
    }
    pub fn str2enum(str: []const u8) ?GameMode {
        return std.meta.stringToEnum(GameMode, str);
    }
};

var gameMode = GameMode.IDLE;
var lastGameMode = GameMode.IDLE;

var wsClient: websocket.Client = undefined;     // Websocket client
//var client: std.net.Stream = undefined;       // TCP client for sending tracking / predictions / messages
//var httpClient: std.http.Client = undefined;  // HTTP client for sending images
//var server: std.net.StreamServer = undefined; // listening TCP socket for receiving commands from client

const MsgHandler = struct {
    allocator: Allocator,

    // Handle Commands via websocket
    pub fn handle(self: MsgHandler, msg: websocket.Message) !void {
        std.log.debug("got msg: {any}", .{msg.data});
        if (msg.data[0] == 1) {
            const mode: GameMode = @enumFromInt(msg.data[1]);
            lastGameMode = gameMode;
            gameMode = mode;
            var mb: u8 = std.mem.asBytes(&gameMode)[0];
            std.log.debug("switched mode from: {any} to {any}", .{lastGameMode, gameMode});
            const res = try self.allocator.alloc(u8, 8);
            @memcpy(res, &[_]u8{0, mb, 2, 0, 0, 0, 0x4f, 0x4b}); // OK
            _ = try wsClient.writeBin(res);
        } else {
            const res = try self.allocator.alloc(u8, 9);
            var mb: u8 = std.mem.asBytes(&gameMode)[0];
            @memcpy(res, &[_]u8{0, mb, 2, 0, 0, 0, 0x4e, 0x4f, 0x4b}); // NOK
            _ = try wsClient.write(res);
        }
    }
    pub fn close(_: MsgHandler) void {
    }
};

// Result is a rect object containing scores and a class
const Result = struct {
    id: usize,  // the result score id
    box: cv.Rect,
    centre: cv.Point,
    prevCentre: cv.Point,
    score: f32,
    classId: usize,
    disappeared: i32 = 0,

    fn increaseDisapperance(self: *Result) void {
        self.disappeared += 1;
    }
};

// This is the main tracking function for the game
pub const Error = error{MissingFocus};
const GameTracker = struct {
    const Self = @This();
    allocator: Allocator,
    maxLife: i32,                 // num of frames to keep disappeared objects before removing them
    objects: ArrayList(Result),   // box, centroid (x, y), scores etc.
    disappeared: ArrayList(i32),  // counter(s) for measuring disappearance
    focusId: usize,               // The ID of Result struct containing ball - our main focus
    lastFocusObj: ?Result,         // The Result struct of LAST KNOWN GOOD focus - failover even if lost/disappeared
    timer: std.time.Timer,        // TODO: Unused timer: handled from server or browser
    overlay: Mat,                 // empty mat to draw movements on
    frames: f64,
    fps: f64,

    pub fn init(allocator: Allocator) !Self {
        var objs: ArrayList(Result) = ArrayList(Result).init(allocator);
        var disapp: ArrayList(i32) = ArrayList(i32).init(allocator);
        var timer = try std.time.Timer.start();
        var overlay = try cv.Mat.initOnes( 640, 640, cv.Mat.MatType.cv8uc4); // CV_8UC4 for transparency

        return Self{
            .maxLife = 10, // we keep a tracker alive for 10 frames, if not it is considered lost
            .allocator = allocator,
            .objects = objs,
            .disappeared = disapp,
            .focusId = 0,
            .lastFocusObj = undefined,
            .timer = timer,
            .overlay = overlay,
            .frames = 0,
            .fps = 0,
        };
    }

    // NOT USED
    fn sortAsc(context: void, a: f32, b: f32) bool {
        return std.sort.asc(f32)(context, a, b);
    }

    fn register(self: *Self, res: Result) !void {
        //std.debug.print("Registering NEW Object. {any}\n", .{res});
        try self.objects.append(res);
        //try self.disappeared.append(1);
    }

    // remove stale and disappeared objects
    fn unregister(self: *Self, id: usize) !void {
        //std.debug.print("TRACKER LOST: unregistering stale or disappeared object: {d}\n", .{id});
        _ = self.objects.orderedRemove(id);
        //_ = self.disappeared.orderedRemove(id);
    }

    fn startTimer(self: *Self) void {
        std.debug.print("Starting game timer\n", .{});
        self.timer.reset();
    }

    fn getTimeSpent(self: *Self) u64 {
        //std.debug.print("getting lap time\n", .{});
        return self.timer.lap();
    }

    fn getFocusObj(self: Self) ?Result {
        for (self.objects.items) |obj| {
            if (obj.id == self.focusId) {
                return obj;
            }
        }
        // failover object if lost focus
        if (self.lastFocusObj) | obj| {
            std.debug.print("getFocusObj : LOST OBJECT, TRYING LAST KNOWN FOCUS ID {d}!\n", .{obj.id});
            return obj;
        }
        return null;
    }

    fn clearOverlay(self: *Self) void {
        return self.overlay.setTo(cv.Scalar.init(0, 0, 0, 0));
    }

    // send image to http server
    // fn sendImage(self: Self, img: *cv.Mat) !void {
    //     var headers = std.http.Headers{ .allocator = self.allocator };
    //     defer headers.deinit();
    //     try headers.append("Content-Type", "image/png");
    //     var body = cv.imEncode(cv.FileExt.png, img.*, self.allocator) catch |err| {
    //         std.debug.print("Error encoding image: {any}\n", .{err});
    //         return err;
    //     };
    //     var req = try httpClient.request(.POST, imgUri, headers, .{});
    //     defer req.deinit();
    //     req.transfer_encoding = .chunked ;
    //     try req.start();
    //     var reqBody = try body.toOwnedSlice();
    //     _ = try req.write(reqBody);
    //     try req.finish();
    //     try req.wait();
    //     if (req.response.status != .ok) {
    //         std.debug.print("Image not sent: {any}\n", .{req.response.status});
    //     }
    // }

    // first 6 bytes is cmd (1) , gamemode (1) and buffer length (4)
    fn sendImage(self: Self, img: *cv.Mat) !void {
        var bs = cv.imEncode(cv.FileExt.png, img.*, self.allocator) catch |err| {
            std.debug.print("Error encoding image: {any}\n", .{err});
            return err;
        };
        defer bs.deinit();
        const cmd: u8 = @intFromEnum(gameMode);
        const len: i32 = @intCast(bs.items.len);
        std.debug.print("Image length: {d}\n", .{len});
        _ = try bs.insert(0, cmd);
        _ = try bs.insertSlice(1, std.mem.asBytes(&gameMode));
        _ = try bs.insertSlice(2, std.mem.asBytes(&len));
        wsClient.writeBin(bs.items) catch |err| {
            std.debug.print("Error sending image: {any}\n", .{err});
            return err;
        };
    }

    // centroid is x,y i32
    fn sendCentroid(_: Self, p: cv.core.Point) !void {
        var buf = [_]u8{0} ** 14;
        const len: i32 = @intCast(8);
        var wr = std.io.fixedBufferStream(&buf);
        _ = try wr.write(&[_]u8{0x02}); // cmd 2    = send centroid
        _ = try wr.write(std.mem.asBytes(&gameMode));
        _ = try wr.write(std.mem.asBytes(&len)); // length
        _ = try wr.write(std.mem.asBytes(&p.x));
        _ = try wr.write(std.mem.asBytes(&p.y));
        //_ = try client.write(&buf);
        _ = try wsClient.writeBin(&buf);
    }

    // send stats to websocket
    fn sendStats(_: Self, r: Result) !void {
        var buf = [_]u8{0} ** 40;
        const len: i32 = @intCast(8);
        var wr = std.io.fixedBufferStream(&buf);
        _ = try wr.write(&[_]u8{0x09}); // cmd 9    = send stats
        _ = try wr.write(std.mem.asBytes(&gameMode));
        _ = try wr.write(std.mem.asBytes(&len)); // length
        _ = try wr.write(std.mem.asBytes(&r.box)); // bounding box 4 x i32
        _ = try wr.write(std.mem.asBytes(&r.centre)); // x,y 2 x i32
        _ = try wr.write(std.mem.asBytes(&r.score)); // score f32
        //_ = try client.write(&buf);
        _ = try wsClient.writeBin(&buf);
    }

    // input: rects of discovered boxes for updating tracker and watching for
    // disappearances by an incrementing counter
    // for info read python similar solution https://pyimagesearch.com/2018/07/23/simple-object-tracking-with-opencv/
    fn update(self: *Self, results: ArrayList(Result), allocator: Allocator) !void {

        // 1) no objects found? we increase disappeared for all until maxLife reached
        if (results.items.len == 0) {
            std.debug.print("TRACKER: no input vs {d} tracked.\n", .{self.objects.items.len});
            for (self.objects.items, 0..) |*obj, idx| {
                obj.increaseDisapperance();
                if (obj.disappeared > self.maxLife) {
                    std.debug.print("TRACKER LOST ALL: unregistering item {d}\n", .{idx});
                    try self.unregister(idx);
                }
            }
            return;
        }

        // 2) objects found, but not tracking any? register each as new
        if (self.objects.items.len == 0) {
            std.debug.print("TRACKER: no existing objects. Adding {d} new\n", .{results.items.len});
            for (results.items) |res| {
                try self.register(res);
            }

        // 3) We do TRACKER MAGIC, updating tracker on existing, optionally adding new if extra input
        } else {
            // rows => tracked objects
            // cols => input objects
            var rows = try allocator.alloc(f32, self.objects.items.len);
            var cols = try allocator.alloc(f32, results.items.len);
            // keep record of assigned trackers

            var usedTrackers = try allocator.alloc(bool, self.objects.items.len);
            var usedInputs = try allocator.alloc(bool, results.items.len);
            defer allocator.free(rows);
            defer allocator.free(cols);
            defer allocator.free(usedTrackers);
            defer allocator.free(usedInputs);


            //std.log.debug("TRACKED {d} INPUT: {d}\n", .{self.objects.items.len, results.items.len});
            //std.log.debug("TRACKED OBJECTS: {any}\n", .{self.objects.items});
            //std.log.debug("INPUT   OBJECTS: {any}\n", .{results.items});

            // 1) calculate all euclidean distances between tracked objects and ALL input objects
            // allocate a matrix for computing eucledian dist between each pair of centroids
            var mat = try allocator.alloc([]f32, self.objects.items.len);
            defer allocator.free(mat);

            for (self.objects.items, 0..) |obj, objIdx| {
                const objCent = obj.centre;
                // TODO: is this memory safe?
                var diffs = try allocator.alloc(f32, results.items.len);
                for (results.items, 0..) |res, resIdx| {
                    const resCent = res.centre;
                    const xDiff: f32 = @floatFromInt(resCent.x - objCent.x);
                    const yDiff: f32 = @floatFromInt(resCent.y - objCent.y);
                    const diff: f32 = std.math.sqrt((xDiff * xDiff) + (yDiff * yDiff));
                    diffs[resIdx] = diff;
                }
                mat[objIdx] = diffs;
            }
            //std.debug.print("Distance matrix: {d:.2}\n", .{mat});

            // 2) assign tracker to result object
            // option a) sort rows based on min distance, then sort cols based on sorted rows
            // option b) iterate tracker, choose min dist for each sequentially
            for (self.objects.items, 0..) |obj, objIdx| {
                // tracker has already assigned new input
                if (objIdx > usedInputs.len - 1) {
                    break;
                }
                if (usedInputs[objIdx] == true) {
                    continue;
                }
                // find the minimum distance from tracker object to matrix of input object
                var minIdx: usize = 0;
                for (mat[objIdx], 0..) |diff, i| {
                    if (diff < mat[objIdx][minIdx]) {
                        minIdx = i;
                    }
                }
                //std.debug.print("Minimum eucl: {any} {d:.2}\n", .{mat[objIdx], mat[objIdx][minIdx]});
                //std.debug.print("REPLACE TRACKER: {any}\n", .{self.objects.items[objIdx]});
                //std.debug.print("REPLACE INPUT  : {any}\n", .{results.items[minIdx]});

                // Now update items - unless they are too far
                //if (mat[objIdx][minIdx] > 150) { continue; }


                // OK! GameTrack ACTIVE: we were tracking a ball (CLASS 1), but the nearest object is no longer a ball (CLASS 0)
                // Therefore it is most likely hidden beneath or under
                if (self.objects.items[objIdx].classId == 1) {
                    // We grab the nearest other object and assume it is concealing the ball
                    if (results.items[minIdx].classId != 1) {
                        if (gameMode == GameMode.TRACK_BALL) {
                            gameMode = GameMode.TRACK_HIDDEN;
                            std.debug.print("{s} :  Ball IS NOW HIDING under cup id {d}\n", .{@tagName(gameMode), self.objects.items[objIdx].id});
                        }
                    } else {
                        // We were tracking a cup hiding a ball, but a ball has surfaced again, we now focus on it
                        if (gameMode == GameMode.TRACK_HIDDEN and results.items[minIdx].classId == 1) {
                            gameMode = GameMode.TRACK_BALL;
                            std.debug.print("{s} :  Ball WAS HIDDEN under cup id {d}\n", .{@tagName(gameMode), self.focusId});
                        }
                    }
                    results.items[minIdx].id = obj.id; // we want to keep old id
                    self.objects.items[objIdx] = results.items[minIdx];
                    self.focusId = obj.id;
                    self.lastFocusObj = self.objects.items[objIdx];
                } else {
                    // All other items
                    results.items[minIdx].id = obj.id; // we want to keep old id
                    self.objects.items[objIdx] = results.items[minIdx];
                    if (results.items[minIdx].classId == 1) {
                        self.focusId = obj.id;
                        self.lastFocusObj = self.objects.items[objIdx];
                        std.debug.print("{s} :  A new ball stole focus {d}\n", .{@tagName(gameMode), self.focusId});
                    }
                }

                // Mark input object as handled so we dont use it again
                usedTrackers[objIdx] = true;
                usedInputs[minIdx] = true;
            }

            // for (self.objects.items, 0..) |obj, trIdx| {
            //     // tracker has already assigned new input
            //     if (usedRows[trIdx] == true) {
            //         continue;
            //     }
            //     //var inputDiffs = try allocator.alloc(f32, results.items.len);
            //     //defer allocator.free(inputDiffs);
            //     var inputDiffs: ArrayList(f32) = ArrayList(f32).init(allocator);
            //     defer inputDiffs.deinit();

            //     const trackCent = obj.centre;
            //     //const trackId = obj.id;

            //     // compute the euclidean distance between input centroids and tracker centroid
            //     for (results.items, 0..) |res, resIdx| {
            //         // check if already used
            //         //if (usedCols[resIdx] == true) {
            //         //    continue;
            //         //}
            //         const resCent = res.centre;
            //         const xDiff: f32 = @floatFromInt(resCent.x - trackCent.x);
            //         const yDiff: f32 = @floatFromInt(resCent.y - trackCent.y);
            //         const diff = std.math.sqrt((xDiff * xDiff) + (yDiff * yDiff));
            //         //inputDiffs[resIdx] = diff;
            //         try inputDiffs.append(diff);
            //     }
            //     //std.sort.heap(f32, diffs, {}, sortAsc);
            //     //std.log.debug("inputDiffs: {any}\n", .{inputDiffs});
            //     //trackerDiffs[trIdx] = inputDiffs;
            //     // find index of lowest diff/distance
            //     var minIdx: usize = 0;
            //     for (inputDiffs.items, 0..) |diff, i| {
            //         if (diff < inputDiffs.items[minIdx]) {
            //             minIdx = i;
            //         }
            //     }
            //     if (inputDiffs.items.len > 0) {
            //         std.debug.print("REPLACE TRACKER: {any}\n", .{self.objects.items[trIdx]});
            //         std.debug.print("REPLACE INPUT  : {any}\n", .{results.items[minIdx]});

            //         // OK! replace tracker object with least euclidean distance one
            //         // TODO: Match class ID ?
            //         self.objects.items[trIdx] = results.items[minIdx];
            //         //self.disappeared.items[trIdx] = 0;

            //         usedCols[minIdx] = true;
            //         usedRows[trIdx] = true;
            //     }
            // }

            // tracker objects with no matching input objects? increase disappeared on those NOT USED
            if (self.objects.items.len > results.items.len) {
                var i: usize = 0;
                while (i < self.objects.items.len) : (i += 1) {
                    if (usedTrackers[i] == true) {
                        continue;
                    }
                    //std.log.debug("Increasing tracker ID disappearance: {d}\n", .{i});
                    self.objects.items[i].increaseDisapperance();
                    if (self.objects.items[i].disappeared > self.maxLife) {
                        //_ = self.objects.orderedRemove(i);
                        //_ = self.disappeared.orderedRemove(i);
                        try self.unregister(i);
                        //i -= 1; // need to decrease counter, as unregister mutates in-place
                    }
                }
            }
            // more input objects than tracked objects? add to tracker
            if (results.items.len > self.objects.items.len) {
                //std.log.debug("Surplus results found: usedCols: {any}\n", .{usedCols});
                for (results.items, 0..) |res, i| {
                    if (usedInputs[i] == true) {
                        continue;
                    }
                    //std.log.debug("Found new object to track:  res: {any}\n", .{res});
                    try self.register(res);
                }
            }
        }
    }
};

// performDetection analyzes the results from the detector network,
// which produces an output blob with a shape 1x1xNx7
// where N is the number of detections, and each detection
// is a vector of float values
// yolov8 has an output of shape (batchSize, 84,  8400) (Num classes + box[x,y,w,h])
// float x_factor = modelInput.cols / modelShape.width;
// float y_factor = modelInput.rows / modelShape.height;
fn performDetection(img: *Mat, results: *Mat, rows: usize, _: i32, tracker: *GameTracker, allocator: Allocator) !void {
    //try cv.imWrite("object.jpg", img.*);
    //std.debug.print("rows {d}\n", .{rows});
    //std.debug.print("cols {d}\n", .{cols});
    const green = cv.Color{ .g = 255 };
    const red = cv.Color{ .r = 255 };
    var i: usize = 0;
    //std.debug.print("shape input {any}\n", .{cols});
    // factor is model input / model shape
    // float x_factor = modelInput.cols / modelShape.width;
    const iRow: f32 = @floatFromInt(img.cols());
    const iCol: f32 = @floatFromInt(img.rows());
    const xFact: f32 = iRow / 640.0;
    const yFact: f32 = iCol / 640.0;

    var bboxes = ArrayList(cv.Rect).init(allocator);
    var centrs = ArrayList(cv.Point).init(allocator);
    var scores = ArrayList(f32).init(allocator);
    var classes = ArrayList(i32).init(allocator);
    defer bboxes.deinit();
    defer centrs.deinit();
    defer scores.deinit();
    defer classes.deinit();

    // 1) first run, fetch all detections with a minimum score
    while (i < rows) : (i += 1) {
        // scores is a vector of results[0..4] (x,y,w,h) followed by scores for each class
        // for this project, only two classes = total 6 floats
        // row index is class id? no
        // fetch the four class scores
        var classScores = try results.region(cv.Rect.init(4, @intCast(i), CLASSES.len, 1));
        //var classScores = try cv.Mat.initFromMat(results, 1, 4,results.getType(), 1, 4);
        defer classScores.deinit();

        // minMaxLoc extracts max and min scores from entire result vector
        const sc = cv.Mat.minMaxLoc(classScores);
        if (sc.max_val > 0.30) {
            //std.debug.print("results: class {s}: {any}, class {s}: {any}\n", .{CLASSES[0], results.get(f32, i, 4), CLASSES[1], results.get(f32, i, 5)});
            //std.debug.print("scores {any}\n", .{sc});
            // compose rect, score and confidence for detection
            var x: f32 = results.get(f32, i, 0);
            var y: f32 = results.get(f32, i, 1);
            var w: f32 = results.get(f32, i, 2);
            var h: f32 = results.get(f32, i, 3);
            var left: i32 = @intFromFloat((x - 0.5 * w) * xFact);
            var top: i32 = @intFromFloat((y - 0.5 * h) * yFact);
            var width: i32 = @intFromFloat(w * xFact);
            var height: i32 = @intFromFloat(h * yFact);
            const rect = cv.Rect{ .x = left, .y = top, .width = width, .height = height };
            const cx: i32 = @intFromFloat(x * xFact);
            const cy: i32 = @intFromFloat(y * yFact);
            const centr: cv.Point = cv.Point.init(cx, cy);
            //std.debug.print("class id {d}\n", .{sc.max_loc.x});  // yes, scores.max_loc is Point with x vector as class ID
            //std.debug.print("confidence {d:.3}\n", .{sc.max_val});
            try centrs.append(centr);
            try bboxes.append(rect);
            try scores.append(@floatCast(sc.max_val));
            try classes.append(sc.max_loc.x);
        }
    }

    // 2) Non Maximum Suppression : remove overlapping boxes (= max confidence and least overlap)
    // return arraylist of indices of non overlapping boxes
    const indices = try cv.dnn.nmsBoxes(bboxes.items, scores.items, 0.25, 0.45, 1, allocator);
    defer indices.deinit();

    // 3) reduce results
    var reduced = ArrayList(Result).init(allocator);
    defer reduced.deinit();
    for (indices.items, 0..indices.items.len) |numIndex, _| {
        const idx: usize = @intCast(numIndex);
        //const cls: usize = @intCast(classes.items[idx]);
        //const sco = scores.items[idx];
        try reduced.append(Result{
            .id = idx,
            .box = bboxes.items[idx],
            .centre = centrs.items[idx],
            .prevCentre = centrs.items[idx],
            .score = scores.items[idx],
            .classId = @intCast(classes.items[idx]),
        });
    }
    // 4) update tracker items with cleaned results
    try tracker.update(reduced, allocator);

    // 5) print info
    //std.debug.print("reduced items: {d}\n", .{reduced.items.len});
    //std.debug.print("tracked items: {d}\n", .{tracker.objects.items.len});
    //std.debug.print("disappr items: {d}\n", .{tracker.disappeared.items.len});

    // Add bounding boxes, centroids, arrows and labels to image
    //for (reduced.items) |obj| {
    for (tracker.objects.items) |obj| {
        if (obj.classId == 1) { // class 1: a ball! we return focus
            tracker.focusId = obj.id;
            tracker.lastFocusObj = obj;
            cv.arrowedLine(img, cv.Point.init(obj.box.x + @divFloor(obj.box.width, 2), obj.box.y - 50), cv.Point.init(obj.box.x + @divFloor(obj.box.width, 2), obj.box.y - 30), green, 4);
        }
        var buf = [_]u8{undefined} ** 40;
        const lbl = try std.fmt.bufPrint(&buf, "{s} ({d:.2}) ID: {d}", .{ CLASSES[obj.classId], obj.score, obj.id });
        cv.rectangle(img, obj.box, green, 1);
        cv.putText(img, "+", obj.centre, cv.HersheyFont{ .type = .simplex }, 0.5, green, 1);
        cv.putText(img, lbl, cv.Point.init(obj.box.x - 10, obj.box.y - 10), cv.HersheyFont{ .type = .simplex }, 0.5, green, 1);

        cv.drawMarker(&tracker.overlay, obj.centre, red, .cross, 4, 2, .filled);
    }

    // add overlay traces to output img, need to convert input img to 4chan with alpha first
    cv.cvtColor(img.*, img, .bgr_to_bgra);
    //tracker.overlay.copyTo(img);
    //img.addMatWeighted(1.0, tracker.overlay, 0.4, 0.5, img);

    // Frames per second timing
    tracker.frames += 1;
    if (tracker.frames >= 60) {
        const lap: u64 = tracker.getTimeSpent();
        var flap: f64 = @floatFromInt(lap);
        const secs: f64 = flap / 1000000000;
        tracker.fps = tracker.frames / secs;
        tracker.frames = 0;
    }
    var fpsBuf = [_]u8{undefined} ** 20;
    const fpsTxt = try std.fmt.bufPrint(&fpsBuf, "FPS ({d:.2})", .{ tracker.fps });
    cv.putText(img, fpsTxt, cv.Point.init(10,30), cv.HersheyFont{ .type = .simplex }, 0.5, green, 2);
    var modeBuf = [_]u8{undefined} ** 14;
    const modeTxt = try std.fmt.bufPrint(&modeBuf, "{s}", .{ @tagName(gameMode) });
    cv.putText(img, modeTxt, cv.Point.init(10,620), cv.HersheyFont{ .type = .simplex }, 0.5, green, 2);

    const focusObj = tracker.getFocusObj();
    // TODO: is this neccessary? we should always have a focus object
    // const focusObj = tracker.getFocusObj() catch |err| {
    //     std.debug.print("Tracker error: {any}\n", .{err});
    // };

    // Now see if we have pending modes
    switch (gameMode) {
        .IDLE, .TRACK_BALL, .TRACK_HIDDEN, .TRACK_IDLE, .STOP=> {
            if (focusObj) |obj| {
                try tracker.sendCentroid(obj.centre);
            }
        },
        .SNAP => {
            std.debug.print("SENDING IMAGE\n", .{});
            img.addMatWeighted(1.0, tracker.overlay, 0.4, 0.5, img);
            try tracker.sendImage(img);
            gameMode = lastGameMode;
        },
        .PREDICT => {
            if (focusObj) |obj| {
                if (obj.id == tracker.focusId) {
                    cv.rectangle(img, obj.box, red, 5);
                    img.addMatWeighted(1.0, tracker.overlay, 0.4, 0.5, img);
                    std.debug.print("PREDICT : CUP ID {d} FOUND!\n", .{tracker.focusId});
                } else {
                    std.debug.print("PREDICT : CUP ID {d} NOT FOUND!\n", .{tracker.focusId});
                }
            }

            img.addMatWeighted(1.0, tracker.overlay, 0.4, 0.5, img);
            try tracker.sendImage(img);
            gameMode = lastGameMode;
        },
        .VERDICT => {
            if (focusObj) |obj| {
                if (obj.id == tracker.focusId) {
                    cv.rectangle(img, obj.box, red, 5);
                    img.addMatWeighted(1.0, tracker.overlay, 0.4, 0.5, img);
                    std.debug.print("VERDICT : CUP ID {d} FOUND!\n", .{tracker.focusId});
                } else {
                    std.debug.print("VERDICT : CUP ID {d} NOT FOUND!\n", .{tracker.focusId});
                }
            }
            try tracker.sendImage(img);
            if (focusObj) |obj| {
                try tracker.sendStats(obj);
            }
            tracker.clearOverlay();
            gameMode = GameMode.STOP;
        },
        else => {
            if (focusObj) |obj| {
                std.debug.print("Centroid: {any}\n", .{obj.centre});
            }
        },
    }
}

// UNUSED: methods to colorize / focus a bounding box
pub fn colorizeBox(results: Mat) !Mat {
    var out = try cv.Mat.initZeros(results.rows(), results.cols(), cv.Mat.MatType.cv8uc3);
    return out;
}

// We need square for onnx inferencing to work
pub fn formatToSquare(src: Mat) !Mat {
    const col = src.cols();
    const row = src.rows();
    const _max = @max(col, row);
    var res = try cv.Mat.initZeros(_max, _max, cv.Mat.MatType.cv8uc4);
    src.copyTo(&res);
    return res;
}

pub fn main() anyerror!void {
    var arena = std.heap.ArenaAllocator.init(std.heap.page_allocator);
    defer arena.deinit();
    const allocator = arena.allocator();
    var args = try std.process.argsWithAllocator(allocator);

    const prog = args.next();
    const deviceIdChar = args.next() orelse {
        std.log.err("usage: {s} [cameraID] [model]", .{prog.?});
        std.os.exit(1);
    };
    const model = args.next() orelse {
        std.log.err("usage: {s} [cameraID [model]]", .{prog.?});
        std.os.exit(1);
    };
    args.deinit();

    const deviceId = try std.fmt.parseUnsigned(i32, deviceIdChar, 10);
    _ = try std.fmt.parseUnsigned(i32, deviceIdChar, 10);

    // open webcam
    var webcam = try cv.VideoCapture.init();
    try webcam.openDevice(deviceId);
    defer webcam.deinit();

    // open display window
    const winName = "DNN Detection";
    var window = try cv.Window.init(winName);
    defer window.deinit();

    // prepare image matrix
    var img = try cv.Mat.init();
    defer img.deinit();
    //img = try cv.imRead("object.jpg", .unchanged);
    //img = try cv.imRead("cardboard_cup1-00022.png", .unchanged);

    //var img = try cv.Mat.initSize(640,640, cv.Mat.MatType.cv8uc3);

    // open DNN object tracking model
    const scale: f64 = 1.0 / 255.0;
    const size: cv.Size = cv.Size.init(640, 640);
    var net = cv.Net.readNetFromONNX(model) catch |err| {
        std.debug.print("Error: {any}\n", .{err});
        std.os.exit(1);
    };

    // tensorflowjs mobilenet
    // const scale: f64 = 1.0 / 255.0;
    // const size: cv.Size = cv.Size.init(300, 300);
    // var net = cv.Net.readNetFromTensorflow(model) catch |err| {
    //     //var net = cv.Net.readNet(model, "") catch |err| {
    //     std.debug.print("Error: {any}\n", .{err});
    //     std.os.exit(1);
    // };
    defer net.deinit();

    if (net.isEmpty()) {
        std.debug.print("Error: could not load model\n", .{});
        std.os.exit(1);
    }

    net.setPreferableBackend(.default);  // .default, .halide, .open_vino, .open_cv. .vkcom, .cuda
    net.setPreferableTarget(.fp16);       // .cpu, .fp32, .fp16, .vpu, .vulkan, .fpga, .cuda, .cuda_fp16

    var layers = try net.getLayerNames(allocator);
    std.debug.print("getLayerNames {any}\n", .{layers.len});
    const unconnected = try net.getUnconnectedOutLayers(allocator);
    std.debug.print("getUnconnectedOutLayers {any}\n", .{unconnected.items});


    // TCP SOCKET listening server
    //const serverAddr = std.net.Address.initIp4([4]u8{ 127, 0, 0, 1 }, 8667);
    //server = std.net.StreamServer.init(.{ .reuse_address = true });
    //try (&server).listen(serverAddr);

    // TCP SOCKET client
    //const clientAddr = std.net.Address.initIp4([4]u8{ 127, 0, 0, 1 }, 8666);
    //client = try std.net.tcpConnectToAddress(clientAddr);
    //defer client.close();

    // HTTP Client
    //httpClient = std.http.Client{ .allocator = allocator };
    //defer httpClient.deinit();
    // const msgThread = try std.Thread.spawn(.{}, MsgHandler, .{&client});
    // defer msgThread.join();

    // Game mode manager in separate thread
    wsClient = try websocket.connect(allocator, "localhost", 8665, .{});
    defer wsClient.deinit();

    try wsClient.handshake("/ws?channels=shell-game", .{
         .timeout_ms = 5000,
         .headers = "host: localhost:8665\r\n",
    });
    const msgHandler = MsgHandler{.allocator = allocator};
    const thread = try wsClient.readLoopInNewThread(msgHandler);
    thread.detach();

    // centroid tracker to remember objects
    var tracker = try GameTracker.init(allocator);
    //defer tracker.deinit();
    const mean = cv.Scalar.init(0, 0, 0, 0); // mean subtraction is a technique used to aid our Convolutional Neural Networks.
    const swapRB = true;
    const crop = false;

    while (true) {
        webcam.read(&img) catch {
            std.debug.print("capture failed", .{});
            std.os.exit(1);
        };
        if (img.isEmpty()) {
            continue;
        }

        img.flip(&img, 1); // flip horizontally
        var squaredImg = try formatToSquare(img);
        defer squaredImg.deinit();
        cv.resize(squaredImg, &squaredImg, size, 0, 0, .{});

        // transform image to CV matrix / 4D blob
        var blob = try cv.Blob.initFromImage(squaredImg, scale, size, mean, swapRB, crop);
        defer blob.deinit();
        // run inference on Matrix
        // prob result: objid, classid, confidence, left, top, right, bottom.
        net.setInput(blob, "");
        var probs = try net.forward("");
        //var probs = try net.forward("output0");
        defer probs.deinit();

        //const rows = probMat.get(i32, 0, 0);
        //const dimensions = probMat.get(i32, 0, 1);
        //std.debug.print("probmat size {any}\n", .{probs.size()});

        // Yolo v8 reshape
        // xywh vector + numclasses * 8400 rows
        const rows: usize = @intCast(probs.size()[2]);
        const dims: i32 = probs.size()[1];

        var probMat = try probs.reshape(1, @intCast(dims));
        defer probMat.deinit();
        //std.debug.print("probMat dimensions {any} rows {any} dims {any}\n", .{probs.size(), rows, dims});
        cv.Mat.transpose(probMat, &probMat);
        // yolov8 has an output of shape (batchSize, 84,  8400) (Num classes + box[x,y,w,h])
        try performDetection(&squaredImg, &probMat, rows, dims, &tracker, allocator);
        // time frames per sec

        window.imShow(squaredImg);
        if (window.waitKey(1) == 27) {
            break;
        }
    }
}
