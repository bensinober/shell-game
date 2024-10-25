const std = @import("std");
const cv = @import("zigcv");
const websocket = @import("websocket");
const ble = @import("simpleble.zig"); // animatronic eyes controlled over bluetooth

const Allocator = std.mem.Allocator;
const ArrayList = std.ArrayList;
const Mat = cv.Mat;
const Size = cv.Size;

// *** GLOBALS ***
pub const io_mode = .evented;

// shell game
var CLASSES = [_][]const u8{ "red_cup", "green_disc" };

const green = cv.Color{ .g = 255 };
const red = cv.Color{ .r = 255 };

// Bluetooth eyes
var btConnected: bool = false;

// micro:bit v1
//const btPeriphStr: []const u8 = "FB:C9:6D:CB:9D:63";
//const btServiceUuidStr: []const u8 = "e2e00001-15cf-4074-9331-6fac42a4920b";

// micro:bit v2
const btPeriphStr: []const u8 = "EF:DD:FD:DA:E1:AE";
const btServiceUuidStr: []const u8 = "e2e10001-15cf-4074-9331-6fac42a4920b";
const btCharId: usize = 1; // choose second characteristic, as it is writable
var btPeripheral: ble.simpleble_peripheral_t = undefined;
var btService: ble.simpleble_service_t = undefined; //.{ .value = microbitUartServicePtr };

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
        const cmd = msg.data[0];
        if (cmd == 1) {
            const mode: GameMode = @enumFromInt(msg.data[1]);
            lastGameMode = gameMode;
            gameMode = mode;
            const mb: u8 = std.mem.asBytes(&gameMode)[0];
            std.log.debug("switched mode from: {any} to {any}", .{ lastGameMode, gameMode });
            const res = try self.allocator.alloc(u8, 8);
            @memcpy(res, &[_]u8{ 0, mb, 2, 0, 0, 0, 0x4f, 0x4b }); // OK
            _ = try wsClient.writeBin(res);
        } else if (cmd == 2) {
            connectBluetooth();
        } else if (cmd == 3) {
            disconnectBluetooth();
        } else {
            const res = try self.allocator.alloc(u8, 9);
            const mb: u8 = std.mem.asBytes(&gameMode)[0];
            @memcpy(res, &[_]u8{0, mb, 2, 0, 0, 0, 0x4e, 0x4f, 0x4b}); // NOK
            _ = try wsClient.write(res);
        }
    }
    pub fn close(_: MsgHandler) void {}
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
const Tracker = struct {
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
        const objs: ArrayList(Result) = ArrayList(Result).init(allocator);
        const disapp: ArrayList(i32) = ArrayList(i32).init(allocator);
        const timer = try std.time.Timer.start();
        const overlay = try cv.Mat.initOnes( 640, 640, cv.Mat.MatType.cv8uc4); // CV_8UC4 for transparency

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
            // dont send last known object forever
            if (obj.disappeared < self.maxLife) {
                //std.debug.print("getFocusObj : LOST OBJECT, TRYING LAST KNOWN FOCUS ID {d}!\n", .{obj.id});
                return obj;
            }
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

    // sending directly to animatronic eyes
    // we need to map input vector x,y (640, 480) to u8 bytes (255, 255)
    // send as 5 u8 bytes { 0, 2, x, y, CRLF }, not expecting any response
    fn sendCentroidToEyes(_: Self, p: cv.core.Point) !void {
        if (btConnected == false) {
            return;
        }
        const t = std.time.milliTimestamp();
        if (@mod(t, 2) != 0) {
            return; // only send 1/5 of signals not to choke BTLE peripheral
        }
        // x, y is only two u8 bytes + 0, 2
        const x1: f32 = @floatFromInt(p.x);
        const y1: f32 = @floatFromInt(p.y);
        const x2: f32 = std.math.round(x1 / 640.0 * 255.0); // map 0-640 to 0-255
        const y2: f32 = std.math.round(@abs(640.0 - y1) / 640.0 * 255.0); // map to 0-255 and invert
        std.debug.print("Sending x, y: ({d}, {d}) mapped: ({d:.0}, {d:.0}) to eyes\n", .{ p.x, p.y, x2, y2 });
        const xByte: u8 = @truncate(@as(u32, @bitCast(@as(i32, @intFromFloat(x2)))));
        const yByte: u8 = @truncate(@as(u32, @bitCast(@as(i32, @intFromFloat(y2)))));
        var cmd: [5]u8 = .{ 0, 2, xByte, yByte, 13 };
        //std.debug.print("Sending x, y: ({d}, {d}) to eyes: {any} \n", .{x2, y2, cmd});
        const cmd_c: [*c]const u8 = @ptrCast(&cmd);
        const err_code = ble.simpleble_peripheral_write_request(btPeripheral, btService.uuid, btService.characteristics[btCharId].uuid, cmd_c, 5);
        if (err_code != @as(c_uint, @bitCast(ble.SIMPLEBLE_SUCCESS))) {
            std.debug.print("Failed to send data to eyes.\n", .{});
        }
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
            //std.debug.print("TRACKER: no input vs {d} tracked.\n", .{self.objects.items.len});
            for (self.objects.items, 0..) |*obj, idx| {
                obj.increaseDisapperance();
                if (obj.disappeared > self.maxLife) {
                    // std.debug.print("TRACKER LOST ALL: unregistering item {d}\n", .{idx});
                    try self.unregister(idx);
                }
            }
            return;
        }

        // 2) objects found, but not tracking any? register each as new
        if (self.objects.items.len == 0) {
            // std.debug.print("TRACKER: no existing objects. Adding {d} new\n", .{results.items.len});
            for (results.items) |res| {
                try self.register(res);
            }

        // 3) We do TRACKER MAGIC, updating tracker on existing, optionally adding new if extra input
        } else {
            // rows => tracked objects
            // cols => input objects
            const rows = try allocator.alloc(f32, self.objects.items.len);
            const cols = try allocator.alloc(f32, results.items.len);
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
                var diffs = try allocator.alloc(f32, results.items.len);
                for (results.items, 0..) |res, resIdx| {
                    diffs[resIdx] = euclidDist(res.centre, objCent);
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
fn performDetection(img: *Mat, scoreMat: Mat, rows: usize, _: Size, tracker: *Tracker, allocator: Allocator) !void {
    //try cv.imWrite("object.jpg", img.*);
    //std.debug.print("scoreMat size: {any}\n", .{scoreMat.size()});

    // factor is model input / model shape
    // float x_factor = modelInput.cols / modelShape.width;

    const imgWidth: f32 = @floatFromInt(img.cols());
    const imgHeight: f32 = @floatFromInt(img.rows());

    var bboxes = ArrayList(cv.Rect).init(allocator);
    var centrs = ArrayList(cv.Point).init(allocator);
    var scores = ArrayList(f32).init(allocator);
    var classes = ArrayList(i32).init(allocator);
    defer bboxes.deinit();
    defer centrs.deinit();
    defer scores.deinit();
    defer classes.deinit();

    var i: usize = 0;
    // var firstRow = try scoreMat.region(cv.Rect.init(0, @intCast(i), 6, 1));
    // defer firstRow.deinit();
    // const fc = cv.Mat.minMaxLoc(firstRow);
    // std.debug.print("first row {any} - {any}\n", .{firstRow, fc});

    // YOLO-v8
    // Mat is {8400, 84} (bounding_box, scores*80)
    // bounding_box : [x_center, y_center, width, height]
    const xFact: f32 =  imgWidth / 640.0;
    const yFact: f32 =  imgHeight / 640.0;
    while (i < rows) : (i += 1) {
        // scores is a vector of results[0..4] (centr_x,centr_y,w,h) followed by clsid + 80 scores (for each class)
        var classScores = try scoreMat.region(cv.Rect.init(4, @intCast(i), CLASSES.len, 1));
        defer classScores.deinit();
        // minMaxLoc extracts max and min scores from entire result vector
        const sc = cv.Mat.minMaxLoc(classScores);
        //std.debug.print("minmax val: {d:.2} {d:.2}: locmaxX {d} locmaxY {d}\n", .{sc.min_val, sc.max_val, sc.max_loc.x, sc.max_loc.y});
        if (sc.max_val > 0.30) {
            // std.debug.print("minMaxLoc: {any}\n", .{sc});
            // left, top, right, bottom
            const fcx: f32 = scoreMat.get(f32, i, 0);
            const fcy: f32 = scoreMat.get(f32, i, 1);
            const fw: f32 = scoreMat.get(f32, i, 2);
            const fh: f32 = scoreMat.get(f32, i, 3);
            //std.debug.print("imgW {d} imgH {d} fcx {d}, fcy {d}, fw {d}, fh {d}\n", .{imgWidth, imgHeight, fcx, fcy, fw, fh});
            const left: i32 = @intFromFloat((fcx - 0.5 * fw) * xFact);
            const top: i32 = @intFromFloat((fcy - 0.5 * fh) * yFact);
            const width: i32 = @intFromFloat(fw * xFact);
            const height: i32 = @intFromFloat(fh * yFact);
            const rect = cv.Rect{ .x = left, .y = top, .width = width, .height = height };
            //const rect = cv.Rect{ .x = @intFromFloat(fxMin), .y = @intFromFloat(fyMin), .width = @intFromFloat(width), .height = @intFromFloat(height) };
            const cx: i32 = @intFromFloat(fcx * xFact);
            const cy: i32 = @intFromFloat(fcy * yFact);
            const centr: cv.Point = cv.Point.init(cx, cy);
            //std.debug.print("rect: {any}\n", .{rect});
            //std.debug.print("centr: {any}\n", .{centr});
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
            //tracker.lastFocusObj = obj;
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
    //cv.cvtColor(img.*, img, .bgr_to_bgra);
    //tracker.overlay.copyTo(img);
    //img.addMatWeighted(1.0, tracker.overlay, 0.4, 0.5, img);

    // Frames per second timing
    tracker.frames += 1;
    if (tracker.frames >= 60) {
        const lap: u64 = tracker.getTimeSpent();
        const flap: f64 = @floatFromInt(lap);
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
                if (tracker.lastFocusObj) |lastObj| {
                    // dont send centroid if not changed
                    if (!std.meta.eql(obj.centre, lastObj.centre)) {
                        try tracker.sendCentroid(obj.centre);
                        try tracker.sendCentroidToEyes(obj.centre);
                    }
                } else {
                    try tracker.sendCentroid(obj.centre);
                    try tracker.sendCentroidToEyes(obj.centre);
                }
            }
        },
        .SNAP => {
            std.debug.print("SENDING IMAGE\n", .{});
            //img.addMatWeighted(1.0, tracker.overlay, 0.4, 0.5, img);
            try tracker.sendImage(img);
            gameMode = lastGameMode;
        },
        .PREDICT => {
            if (focusObj) |obj| {
                if (obj.id == tracker.focusId) {
                    cv.rectangle(img, obj.box, red, 5);
                    std.debug.print("PREDICT : CUP ID {d} FOUND!\n", .{tracker.focusId});
                } else {
                    std.debug.print("PREDICT : CUP ID {d} NOT FOUND!\n", .{tracker.focusId});
                }
            }

            //img.addMatWeighted(1.0, tracker.overlay, 0.4, 0.5, img);
            try tracker.sendImage(img);
            gameMode = lastGameMode;
        },
        .VERDICT => {
            if (focusObj) |obj| {
                if (obj.id == tracker.focusId) {
                    cv.rectangle(img, obj.box, red, 5);
                    std.debug.print("VERDICT : CUP ID {d} FOUND!\n", .{tracker.focusId});
                } else {
                    std.debug.print("VERDICT : CUP ID {d} NOT FOUND!\n", .{tracker.focusId});
                }
            }
            //img.addMatWeighted(1.0, tracker.overlay, 0.4, 0.5, img);
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
    if (focusObj) |obj| {
        tracker.lastFocusObj = obj;
    }
}

pub fn connectBluetooth() void {
    std.debug.print("Connecting to bluetooth.\n", .{});
    if (btConnected == true) {
        return; // already connected
    }
    const adapter_count: usize = ble.simpleble_adapter_get_count();
    if (adapter_count == @as(usize, @bitCast(@as(c_long, @as(c_int, 0))))) {
        std.debug.print("No adapter was found.\n", .{});
        return;
    }
    const adapter: ble.simpleble_adapter_t = ble.simpleble_adapter_get_handle(@as(usize, @bitCast(@as(c_long, @as(c_int, 0)))));
    if (adapter == @as(?*anyopaque, @ptrFromInt(@as(c_int, 0)))) {
        std.debug.print("No adapter was found.\n", .{});
        return;
    }

    _ = ble.simpleble_adapter_set_callback_on_scan_start(adapter, &ble.adapter_on_scan_start, @as(?*anyopaque, @ptrFromInt(@as(c_int, 0))));
    _ = ble.simpleble_adapter_set_callback_on_scan_stop(adapter, &ble.adapter_on_scan_stop, @as(?*anyopaque, @ptrFromInt(@as(c_int, 0))));
    _ = ble.simpleble_adapter_set_callback_on_scan_found(adapter, &ble.adapter_on_scan_found, @as(?*anyopaque, @ptrFromInt(@as(c_int, 0))));
    _ = ble.simpleble_adapter_scan_for(adapter, @as(c_int, 3000));

    var selection: usize = undefined;
    var found: bool = false;
        var i: usize = 0;
        while (i < ble.peripheral_list_len) : (i +%= 1) {
            const peripheral: ble.simpleble_peripheral_t = ble.peripheral_list[i];
            //var peripheral_identifier: [*c]u8 = ble.simpleble_peripheral_identifier(peripheral);
            const peripheral_address: [*c]u8 = ble.simpleble_peripheral_address(peripheral);
            const periphStr = std.mem.span(@as([*:0]u8, @ptrCast(@alignCast(peripheral_address))));
            std.debug.print("comp peripheral: {s} vs {s}\n", .{ periphStr, btPeriphStr });
            if (std.mem.eql(u8, periphStr, btPeriphStr)) {
                std.debug.print("found peripheral: {s} id: {any}\n", .{ btPeriphStr, selection });
                selection = i;
                found = true;
                break;
            }
        }
    if (!found) {
        std.debug.print("Could not find peripheral with mac: {s}\n", .{btPeriphStr});
        return;
    }

    std.debug.print("Selected: {d}\n", .{selection});
    if ((selection < @as(c_int, 0)) or (selection >= @as(c_int, @bitCast(@as(c_uint, @truncate(ble.peripheral_list_len)))))) {
        std.debug.print("Invalid bluetooth selection\n", .{});
        return;
    }
    btPeripheral = ble.peripheral_list[@as(c_uint, @intCast(selection))];
    const peripheral_identifier: [*c]u8 = ble.simpleble_peripheral_identifier(btPeripheral);
    const peripheral_address: [*c]u8 = ble.simpleble_peripheral_address(btPeripheral);
    std.debug.print("Connecting to {s} [{s}]\n", .{ peripheral_identifier, peripheral_address });
    ble.simpleble_free(@as(?*anyopaque, @ptrCast(peripheral_identifier)));
    ble.simpleble_free(@as(?*anyopaque, @ptrCast(peripheral_address)));
    var err_code = ble.simpleble_peripheral_connect(btPeripheral);
    if (err_code != @as(c_uint, @bitCast(ble.SIMPLEBLE_SUCCESS))) {
        std.debug.print("Failed to connect to bluetooth peripheral\n", .{});
        ble.clean_on_exit(adapter);
        return;
    }

    // Service
    const services_count: usize = ble.simpleble_peripheral_services_count(btPeripheral);
        var s: usize = 0;
        while (s < services_count) : (s +%= 1) {
            var service: ble.simpleble_service_t = undefined;
            err_code = ble.simpleble_peripheral_services_get(btPeripheral, s, &service);
            if (err_code != @as(c_uint, @bitCast(ble.SIMPLEBLE_SUCCESS))) {
                std.debug.print("Invalid bluetooth service selection\n", .{});
                ble.clean_on_exit(adapter);
                return;
            }

            // Select HMSoft Serial service
            var serviceStr: []const u8 = @ptrCast(@alignCast(&service.uuid.value));
            std.debug.print("comp service uuid: {s} vs {s}\n", .{ serviceStr, btServiceUuidStr });
            if (std.mem.eql(u8, serviceStr[0..36], btServiceUuidStr[0..36])) {
                std.debug.print("found right UART service: {s}\n", .{btServiceUuidStr});
                btService = service;
                btConnected = true;
                break;
            }
        }
    return;
}

pub fn disconnectBluetooth() void {
    const errUnpair = ble.simpleble_peripheral_unpair(btPeripheral);
    if (errUnpair != @as(c_uint, @bitCast(ble.SIMPLEBLE_SUCCESS))) {
        std.debug.print("Failed to disconnect to bluetooth peripheral\n", .{});
    }
    const errDisconect = ble.simpleble_peripheral_disconnect(btPeripheral);
    if (errDisconect != @as(c_uint, @bitCast(ble.SIMPLEBLE_SUCCESS))) {
        std.debug.print("Failed to disconnect to bluetooth peripheral\n", .{});
    }
    std.debug.print("Disconnected bluetooth peripheral: {any}\n", .{btPeripheral});
    btPeripheral = undefined;
    btConnected = false;
    return;
}

// calculate Euclidean distance between two points
fn euclidDist(prev: cv.Point, new: cv.Point) f32 {
    const xDiff: f32 = @floatFromInt(prev.x - new.x);
    const yDiff: f32 = @floatFromInt(prev.y - new.y);
    const diff: f32 = std.math.sqrt((xDiff * xDiff) + (yDiff * yDiff));
    return diff;
}

// UNUSED: methods to colorize / focus a bounding box
pub fn colorizeBox(results: Mat) !Mat {
    const out = try cv.Mat.initZeros(results.rows(), results.cols(), cv.Mat.MatType.cv8uc3);
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
        std.process.exit(1);
    };
    const model = args.next() orelse {
        std.log.err("usage: {s} [cameraID [model]]", .{prog.?});
        std.process.exit(1);
    };
    args.deinit();

    // make sure BTLE is released on exit
    defer disconnectBluetooth();

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
    var img = try cv.Mat.initSize(640,640, cv.Mat.MatType.cv8uc3);
    defer img.deinit();

    // centroid tracker to remember objects
    var tracker = try Tracker.init(allocator);
    //defer tracker.deinit();

    //cv.cvtColor(img, &img, .bgra_to_bgr);
    //tracker.overlay.copyTo(&img);

    // open DNN object tracking model
    // YOLOv8 pytorch onnx INFERENCE
    const swapRB = true;
    const scale: f64 = 1.0 / 255.0;
    const size: cv.Size = cv.Size.init(640, 640);
    const mean = cv.Scalar.init(0, 0, 0, 0); // mean subtraction is a technique used to aid our Convolutional Neural Networks.
    const crop = false;
    var net = cv.Net.readNetFromONNX(model) catch |err| {
        std.debug.print("Error: {any}\n", .{err});
        std.process.exit(1);
    };

    // YOLOv5n
    // https://github.com/doleron/yolov5-opencv-cpp-python/blob/main/cpp/yolo.cpp
    // const swapRB = true;
    // const scale: f64 = 1.0 / 255.5;
    // const size: cv.Size = cv.Size.init(640, 640);
    // const mean = cv.Scalar.init(0, 0, 0, 0); // mean subtraction is a technique used to aid our Convolutional Neural Networks.
    // const crop = false;
    // var net = cv.Net.readNetFromONNX(model) catch |err| {
    //     std.debug.print("Error: {any}\n", .{err});
    //     std.process.exit(1);
    // };

    // tensorflowjs mobilenet
    // const scale: f64 = 1.0 / 255.0;
    // const size: cv.Size = cv.Size.init(300, 300);
    // var net = cv.Net.readNetFromTensorflow(model) catch |err| {
    //     //var net = cv.Net.readNet(model, "") catch |err| {
    //     std.debug.print("Error: {any}\n", .{err});
    //     std.process.exit(1);
    // };

    // efficientnet-lite4.onnx
    // const scale: f64 = 1.0 / 255.0;
    // const mean = cv.Scalar.init(0, 0, 0, 0); // mean subtraction is a technique used to aid our Convolutional Neural Networks.
    // var transposeVector = [_]i32{0, 2, 3, 1}; // transpose a single-channel Mat against a vector
    // const swapRB = true;
    // const crop = false;
    // const size: cv.Size = cv.Size.init(320, 320);
    // var net = cv.Net.readNetFromONNX(model) catch |err| {
    //     std.debug.print("Error: {any}\n", .{err});
    //     std.process.exit(1);
    // };

    defer net.deinit();

    if (net.isEmpty()) {
        std.debug.print("Error: could not load model\n", .{});
        std.process.exit(1);
    }

    net.setPreferableBackend(.default);  // .default, .halide, .open_vino, .open_cv. .vkcom, .cuda
    net.setPreferableTarget(.fp16);       // .cpu, .fp32, .fp16, .vpu, .vulkan, .fpga, .cuda, .cuda_fp16

    // const layers = try net.getLayerNames(allocator);
    // std.debug.print("getLayerNames {s}\n", .{layers});
    // const unconnected = try net.getUnconnectedOutLayers(allocator);
    // std.debug.print("getUnconnectedOutLayers {any}\n", .{unconnected.items});
    // const unconnected = try net.getUnconnectedOutLayersNames(allocator);
    // std.debug.print("getUnconnectedOutLayersNames {s}\n", .{unconnected});

    // for (unconnected.items) |li| {
    //     const l = try net.getLayer(li);
    //     std.debug.print("unconnected layer output {d}: {s}\n", .{li, l.getName()});
    // }


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

    var certBundle: std.crypto.Certificate.Bundle = .{};
    defer certBundle.deinit(allocator);
    var certFile = try std.fs.cwd().openFile("cert.pem", .{});
    defer certFile.close();

    _ = try std.crypto.Certificate.Bundle.addCertsFromFile(&certBundle, allocator, certFile);
    wsClient = try websocket.connect(allocator, "localhost", 8665, .{ .tls = true, .ca_bundle = certBundle });
    defer wsClient.deinit();


    try wsClient.handshake("/ws?channels=shell-game", .{
         .timeout_ms = 5000,
         .headers = "host: localhost:8665\r\n",
    });
    // Game mode manager in separate thread
    const msgHandler = MsgHandler{.allocator = allocator};
    const thread = try wsClient.readLoopInNewThread(msgHandler);
    thread.detach();

    while (true) {
        webcam.read(&img) catch {
            std.debug.print("capture failed", .{});
            std.process.exit(1);
        };
        if (img.isEmpty()) {
            continue;
        }

        img.flip(&img, 1); // flip horizontally

        // var squaredImg = try formatToSquare(img);
        // defer squaredImg.deinit();
        // cv.resize(squaredImg, &squaredImg, size, 0, 0, .{});

        // transform image to CV matrix / 4D blob
        var blob = try cv.Blob.initFromImage(img, scale, size, mean, swapRB, crop);
        defer blob.deinit();
        //std.debug.print("input blob size {any}\n", .{blob.mat.size()});

        // YOLOv8 INFERENCE
        // yolov8 has an output of shape (batchSize, 84,  8400) (Num classes + box[x,y,w,h])
        // prob result: objid, classid, confidence, left, top, right, bottom.
        // input: {1, 3, 640, 640} (b,ch,w,h)
        // output {1, 84,  8400} scores and boxes
        net.setInput(blob, "");
        var probs = try net.forward("output0");
        defer probs.deinit();
        //std.debug.print("orig probMat size {any},\n", .{probs.size()});
        const rows: usize = @intCast(probs.size()[2]);
        const dims: usize = @intCast(probs.size()[1]);
        var probMat = try probs.reshape(1, dims);
        //std.debug.print("reshaped probMat size {any},\n", .{probMat.size()});
        defer probMat.deinit();
        cv.Mat.transpose(probMat, &probMat);
        //var transposeVector = [_]i32{0, 2, 1};
        //cv.Mat.transposeND(probs, &transposeVector, &probs);
        //std.debug.print("transposed probmat size {any}\n", .{probMat.size()});
        try performDetection(&img, probMat, rows, size, &tracker, allocator);

        window.imShow(img);
        if (window.waitKey(1) == 27) {
            break;
        }
    }
}
