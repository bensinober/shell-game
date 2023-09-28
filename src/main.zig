const std = @import("std");
const cv = @import("zigcv");

const Allocator = std.mem.Allocator;
const ArrayList = std.ArrayList;
const Mat = cv.Mat;
const Size = cv.Size;
var CLASSES: [2][]const u8 = [_][]const u8{"red_cup","ball"};

const Result = struct {
    id: usize,
    box: cv.Rect,
    centre: cv.Point,
    score: f32,
    classId: usize,
};

// allocate a byte buffer for sending structured info to tcp socket
// TODO: unused for now
const MsgWriter = struct {
  len: usize = 0,
  buf: [100]u8 = undefined,

  const Self = @This();

  fn writei32(self: *Self, value: i32) void {
    self.len += std.fmt.formatIntBuf(self.buf[self.len..], value, 10, .lower, .{});
  }
};

const Tracker = struct {
    allocator: Allocator,
    maxLife: i32,                // frames to keep disappeared object before removing
    objects: ArrayList(Result),  // box, centroid (x, y), scores etc.
    disappeared: ArrayList(i32), // counter for measuring disappearance
    tcpConn: std.net.Stream, // server TCP socket for sending tracking / predictions

    const Self = @This();
    pub fn init(allocator: Allocator) !Self {
        var objs: ArrayList(Result) = ArrayList(Result).init(allocator);
        var disapp: ArrayList(i32) = ArrayList(i32).init(allocator);
        const addr = std.net.Address.initIp4([4]u8{ 127, 0, 0, 1 }, 8666);
        const tcpConn = try std.net.tcpConnectToAddress(addr);

        return Self{
            .maxLife = 10,
            .allocator = allocator,
            .objects = objs,
            .disappeared = disapp,
            .tcpConn = tcpConn,
        };
    }

    fn deinit(self: Self) void {
        self.tcpConn.close();
    }

    fn sortAsc(context: void, a: f32, b: f32) bool {
        return std.sort.asc(f32)(context, a, b);
    }

    fn register(self: *Self, res: Result) !void {
        try self.objects.append(res);
        try self.disappeared.append(1);
    }

    // remove stale and disappeared objects
    fn unregister(self: *Self, id: usize) !void {
        std.log.debug("Cleaning up stale or disappeared object id: {d}\n", .{id});
        _ = self.objects.orderedRemove(id);
        _ = self.disappeared.orderedRemove(id);
    }

    // centroid is x,y i32
    fn sendCentroid(self: Self, p: cv.core.Point) !void {
        var buf = [_]u8{0} ** 10;
        var wr = std.io.fixedBufferStream(&buf);
        _ = try wr.write(&[_]u8{0x02}); // cmd 2    = send centroid
        _ = try wr.write(&[_]u8{8});    // length 8 = 2 x i32
        _ = try wr.write(std.mem.asBytes(&p.x));
        _ = try wr.write(std.mem.asBytes(&p.y));
        _ = try self.tcpConn.write(&buf);
    }

    // input: rects of discovered boxes for updating tracker and watching for
    // disappearances by an incrementing counter
    // for info read python similar solution https://pyimagesearch.com/2018/07/23/simple-object-tracking-with-opencv/
    fn update(self: *Self, results: ArrayList(Result), allocator: Allocator) !void {
        //var idx: usize = 0;
        // no objects found? we increase disappeared for all until maxLife reached
        if (results.items.len == 0) {
            //std.debug.print("TRACKER: no input vs tracked . {d} {d}\n", .{self.disappeared.items.len, self.objects.items.len});
            var i: usize = 0;
            while (i < self.disappeared.items.len) : (i += 1) {
                self.disappeared.items[i] += 1;
                if (self.disappeared.items[i] > self.maxLife) {
                    std.debug.print("TRACKER LOST ALL: unregistering item {d}\n", .{i});
                    _ = self.objects.orderedRemove(i);
                    _ = self.disappeared.orderedRemove(i);
                    //try self.unregister(i);
                    //i -= 1; // need to decrease counter, as unregister mutates in-place
                }
            }
            return;
        }
        // objects found, but not tracking any? register each as new
        if (self.objects.items.len == 0) {
            //std.debug.print("TRACKER: no existing objects. ", .{});
            for (results.items) | res | {
                try self.register(res);
            }
        } else {
            // allocate 3D array with diffs for each tracker
            var usedRows = try allocator.alloc(bool, self.objects.items.len);
            var usedCols = try allocator.alloc(bool, results.items.len);
            // keep record of assigned trackers
            defer allocator.free(usedRows);
            defer allocator.free(usedCols);

            //1) calculate all euclidean distances between tracked objects and new objects
            //var trackerDiffs = try allocator.alloc([]f32, self.objects.items.len);
            //defer allocator.free(trackerDiffs);
            //std.log.debug("TRACKED OBJECTS: {any}\n", .{self.objects.items});
            //std.log.debug("INPUT   OBJECTS: {any}\n", .{results.items});
            for (self.objects.items, 0..) |tr, trIdx| {
                // if (usedRows[itIdx] == true) {
                //     continue;
                // }
                //var inputDiffs = try allocator.alloc(f32, results.items.len);
                //defer allocator.free(inputDiffs);
                var inputDiffs: ArrayList(f32) = ArrayList(f32).init(allocator);
                defer inputDiffs.deinit();

                const trackCent = tr.centre;
                //const trackId = tr.id;

                // compute the euclidean distance between input centroids and tracker centroid
                for (results.items, 0..) |res, resIdx| {
                    // check if already used
                    if (usedCols[resIdx] == true) {
                        continue;
                    }
                    const resCent = res.centre;
                    const xDiff: f32 = @floatFromInt(resCent.x - trackCent.x);
                    const yDiff: f32 = @floatFromInt(resCent.y - trackCent.y);
                    const diff = std.math.sqrt((xDiff * xDiff) + (yDiff * yDiff));
                    //inputDiffs[resIdx] = diff;
                    try inputDiffs.append(diff);
                }
                //std.sort.heap(f32, diffs, {}, sortAsc);
                //std.log.debug("inputDiffs: {any}\n", .{inputDiffs});
                //trackerDiffs[trIdx] = inputDiffs;
                // find index of lowest diff/distance
                var minIdx: usize = 0;
                for (inputDiffs.items, 0..) |diff,i| {
                    if (diff < inputDiffs.items[minIdx]) {
                        minIdx = i;
                    }
                }
                if (inputDiffs.items.len > 0) {
                    //std.log.debug("TRACKER: {any}\n", .{self.objects.items[trIdx].box});
                    //std.log.debug("INPUT  : {any}\n", .{results.items[minIdx].box});
                    self.objects.items[trIdx] = results.items[minIdx];
                    self.disappeared.items[trIdx] = 0;
                    usedCols[minIdx] = true;
                    usedRows[trIdx] = true;
                }
            }

            // tracker objects with no matching results? increase disappeared
            if (self.objects.items.len >= results.items.len) {
                //std.log.debug("surplus objects found, usedRows: {any}\n", .{usedRows});
                var i: usize = 0;
                while (i < self.objects.items.len ) : (i += 1) {
                    if (usedRows[i] == true) {
                        continue;
                    }
                    self.disappeared.items[i] += 1;
                    //std.log.debug("Increasing tracker ID disappearance: {d}\n", .{i});
                    if (self.disappeared.items[i] > self.maxLife) {
                        //std.debug.print("TRACKER LOST: unregistering item {d}\n", .{i});
                        _ = self.objects.orderedRemove(i);
                        _ = self.disappeared.orderedRemove(i);
                        // try self.unregister(i);
                        // i -= 1; // need to decrease counter, as unregister mutates in-place
                    }
                }
            }
            // more results than tracked objects? add to tracker
            if (results.items.len >= self.objects.items.len) {
                //std.log.debug("Surplus results found: usedCols: {any}\n", .{usedCols});
                for (results.items, 0..) |res, i| {
                    if (usedCols[i] == true) {
                        continue;
                    }
                    //std.log.debug("Found new object to track:  res: {any}\n", .{res});
                    try self.register(res);
                }
            }
        }
    }
};

// We need square for onnx inferencing to work
pub fn formatToSquare(src: Mat) !Mat {
    const col = src.cols();
    const row = src.rows();
    const _max = @max(col, row);
    var res = try cv.Mat.initZeros(_max, _max, cv.Mat.MatType.cv8uc3);
    src.copyTo(&res);
    return res;
}



pub fn main() anyerror!void {
    var arena = std.heap.ArenaAllocator.init(std.heap.page_allocator);
    defer arena.deinit();
    const allocator = arena.allocator();
    //var allocator = std.heap.page_allocator;
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
    // pytorch
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

    net.setPreferableBackend(.default);
    net.setPreferableTarget(.cpu);
    std.debug.print("getLayerNames {any}\n", .{net});

    // centroid tracker to remember objects
    var tracker = try Tracker.init(allocator);
    defer tracker.deinit();

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

        window.imShow(squaredImg);
        if (window.waitKey(1) >= 0) {
            break;
        }
        //break;
    }
}

// performDetection analyzes the results from the detector network,
// which produces an output blob with a shape 1x1xNx7
// where N is the number of detections, and each detection
// is a vector of float values
// yolov8 has an output of shape (batchSize, 84,  8400) (Num classes + box[x,y,w,h])
//float x_factor = modelInput.cols / modelShape.width;
//float y_factor = modelInput.rows / modelShape.height;
fn performDetection(img: *Mat, results: *Mat, rows: usize, cols: i32, tracker: *Tracker, allocator: Allocator) !void {
    //try cv.imWrite("object.jpg", img.*);
    //std.debug.print("rows {d}\n", .{rows});
    //std.debug.print("cols {d}\n", .{cols});
    const green = cv.Color{ .g = 255 };
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
        // scores is a vector of results[0..4] (x,y,w,h) followed by class scores [4..7] (total 8 floats)
        var classScores = try results.region(cv.Rect.init(4, @intCast(i), cols-4, 1));
        //var classScores = try cv.Mat.initFromMat(results, 1, 4,results.getType(), 1, 4);
        //var classScores = try cv.Mat.init();
        defer classScores.deinit();

        // minMaxLoc extracts max and min scores from entire result vector
        const sc = cv.Mat.minMaxLoc(classScores);
        if (sc.max_val > 0.30) {
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

    // 2) Non Maximal Suppression : remove overlapping boxes (= max confidence and least overlap)
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
            .score = scores.items[idx],
            .classId = @intCast(classes.items[idx]),
        });
        //const box = bboxes.items[idx];
        //const ctr = centrs.items[idx];

        //std.debug.print("box {any}\n", .{bboxes.items[idx]});
        //std.debug.print("confidence {any}\n", .{scores.items[idx]});
        //std.debug.print("class id {d}\n", .{classes.items[idx]});
        //std.debug.print("class label {s}\n", .{CLASSES[classes.items[idx]]});
        //cv.rectangle(img, bboxes.items[idx], green, 1);
        //cv.putText(img, "+", ctr, cv.HersheyFont{ .type = .simplex }, 0.5, green, 1);
        //try cv.imWrite("object-detection.jpg", img.*);
    }
    // 4) update tracker items
    try tracker.update(reduced, allocator);
    //std.debug.print("trackers objects {d}\n", .{tracker.objects.items.len});
    //std.debug.print("trackers length {d}\n", .{reduced.items.len});

    // 5) print info
    //std.debug.print("reduced items: {d}\n", .{reduced.items.len});
    //std.debug.print("tracked items: {d}\n", .{tracker.objects.items.len});
    //std.debug.print("disappr items: {d}\n", .{tracker.disappeared.items.len});
    for (tracker.objects.items, 0..tracker.objects.items.len) |obj, idx| {
        //std.debug.print("tracker objects : {any}\n", .{obj});
        var buf = [_]u8{undefined} ** 40;
        const lbl = try std.fmt.bufPrint(&buf, "{s} ({d:.2}) ID: {d}", .{CLASSES[obj.classId], obj.score, idx});
        cv.rectangle(img, obj.box, green, 1);
        cv.putText(img, "+", obj.centre, cv.HersheyFont{ .type = .simplex }, 0.5, green, 1);
        cv.putText(img, lbl, cv.Point.init(obj.box.x - 10, obj.box.y - 10), cv.HersheyFont{ .type = .simplex }, 0.5, green, 1);
        if (obj.classId == 1) { // class 1: a ball
            cv.arrowedLine(
                img, cv.Point.init(obj.box.x + @divFloor(obj.box.width, 2), obj.box.y - 50),
                cv.Point.init(obj.box.x + @divFloor(obj.box.width, 2), obj.box.y - 30), green, 4);
            // we now have a ball to follow.
            // If we loose track of it, we will track the ID of the nearest object, presuming it is hiding the cup
            std.debug.print("BALL: {any}\n", .{obj.centre});
            try tracker.sendCentroid(obj.centre);
        }
    }
}
