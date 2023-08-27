const std = @import("std");
const cv = @import("zigcv");

const Allocator = std.mem.Allocator;
const ArrayList = std.ArrayList;
const Mat = cv.Mat;
const Size = cv.Size;
var CLASSES: [4][]const u8 = [_][]const u8{"deichcup","yellow_cup","cardboard_cup","ball"};

const Result = struct {
    id: usize,
    box: cv.Rect,
    centre: cv.Point,
    score: f32,
    classId: usize,
};

const Tracker = struct {
    counter: usize,
    allocator: Allocator,
    maxLife: i32,                // frames to keep disappeared object before removing
    objects: ArrayList(Result),  // box, centroid (x, y), scores etc.
    disappeared: ArrayList(i32), // counter for measuring disappearance

    const Self = @This();
    pub fn init(allocator: Allocator) !Self {
        var objs: ArrayList(Result) = ArrayList(Result).init(allocator);
        var dis: ArrayList(i32) = ArrayList(i32).init(allocator);
        var counter: usize = 0;
        return Self{
            .counter = counter,
            .maxLife = 60,
            .allocator = allocator,
            .objects = objs,
            .disappeared = dis,
        };
    }

    fn sortAsc(context: void, a: f32, b: f32) bool {
        return std.sort.asc(f32)(context, a, b);
    }

    fn register(self: *Self, res: *Result) !void {
        self.counter += 1;
        res.id = self.counter;
        try self.objects.append(res.*);
        try self.disappeared.append(0);
    }
    // input: rects of discovered boxes for updating tracker and watching for
    // disappearances by an incrementing counter
    fn update(self: *Self, results: ArrayList(Result), allocator: Allocator) !void {
        var i: usize = 0;
        // no objects found
        // we increase disappeared for all until maxLife reached
        if (results.items.len == 0) {
            while (i < self.disappeared.items.len) : (i += 1) {
                self.disappeared.items[i] += 1;
                if (self.disappeared.items[i] > self.maxLife) {
                    try self.unregister(i);
                }
            }
            return;
        }
        // objects found
        // but not tracking any? register each as new
        if (self.objects.items.len == 0) {
            i = 0;
            while (i < results.items.len) : (i += 1) {
                try self.register(&results.items[i]);
            }
        } else {
            // old = existing trackers = rows
            // new = input centroids   = cols
            // grab the set of object IDs and corresponding centroids
            // compute the euclidean distance between each combination of
            // tracked (old) and new result objects, smallest distance wins
            // if remaining existing (old) objects, we need increase disappearance
            // if remaining input (new) objects, we need to register
            //var diffs: ArrayList(f32) = ArrayList(f32).init(allocator); // diffs for each tracker

            // allocate 3D array with diffs for each tracker
            //var usedRows = try allocator.alloc(bool, self.objects.items.len);
            var usedCols = try allocator.alloc(bool, results.items.len);
            // keep record of assigned trackers
            //defer allocator.free(usedRows);
            defer allocator.free(usedCols);

            //1) calculate all euclidean distances between tracked objects and new objects
            //var diffs: ArrayList([self.objects.items.len]Diff) = ArrayList([self.objects.items.len]Diff).init(allocator);
            const diffs = try allocator.alloc(f32, self.objects.items.len);
            defer allocator.free(diffs);
            for (self.objects.items, 0..) |it, itIdx| {
                // if (usedRows[itIdx] == true) {
                //     continue;
                // }
                const trackCent = it.centre;
                const trackId = it.id;

                for (results.items, 0..) |res, resIdx| {
                    // check if already used
                    if (usedCols[resIdx] == true) {
                        continue;
                    }
                    const resCent = res.centre;
                    const xDiff: f32 = @floatFromInt(resCent.x - trackCent.x);
                    const yDiff: f32 = @floatFromInt(resCent.y - trackCent.y);
                    const diff = std.math.sqrt((xDiff * xDiff) + (yDiff * yDiff));
                    diffs[itIdx] = diff;
                    usedCols[resIdx] = true;
                    std.log.debug("diff: ID: {d} diff: {any} item ID: {d} res ID: {d}\n", .{trackId, diff, itIdx, resIdx});
                }

                // get index of minimum dist between tracked object and a result object and set new centroid
                std.sort.heap(f32, diffs, {}, sortAsc);
                // need to keep order of IDs here, use lowest distance result.items index
                self.objects.items[itIdx] = results.items[0];
                std.log.debug("diffs: {any}\n", .{diffs});
            }
            // HERE
            // in order to determine if we need to update, register,
            // or deregister an object we need to keep track of which
            // of the rows and column indexes we have already examined
            //usedRows = set()
            //usedCols = set()
            // loop over the combination of the (row, column) index
            // tuples
        //     for (row, col) in zip(rows, cols):
        //         # if we have already examined either the row or
        //         # column value before, ignore it
        //         # val
        //         if row in usedRows or col in usedCols:
        //             continue
        //         # otherwise, grab the object ID for the current row,
        //         # set its new centroid, and reset the disappeared
        //         # counter
        //         objectID = objectIDs[row]
        //         self.objects[objectID] = inputCentroids[col]
        //         self.disappeared[objectID] = 0
        //         # indicate that we have examined each of the row and
        //         # column indexes, respectively
        //         usedRows.add(row)
        //         usedCols.add(col)
        //     # compute both the row and column index we have NOT yet
        //     # examined
        //     unusedRows = set(range(0, D.shape[0])).difference(usedRows)
        //     unusedCols = set(range(0, D.shape[1])).difference(usedCols)
        //     # in the event that the number of object centroids is
        //     # equal or greater than the number of input centroids
        //     # we need to check and see if some of these objects have
        //     # potentially disappeared
        //     if D.shape[0] >= D.shape[1]:
        //         # loop over the unused row indexes
        //         for row in unusedRows:
        //             # grab the object ID for the corresponding row
        //             # index and increment the disappeared counter
        //             objectID = objectIDs[row]
        //             self.disappeared[objectID] += 1
        //             # check to see if the number of consecutive
        //             # frames the object has been marked "disappeared"
        //             # for warrants deregistering the object
        //             if self.disappeared[objectID] > self.maxDisappeared:
        //                 self.deregister(objectID)
        //     # otherwise, if the number of input centroids is greater
        //     # than the number of existing object centroids we need to
        //     # register each new input centroid as a trackable object
        //     else:
        //         for col in unusedCols:
        //             self.register(inputCentroids[col])
        // # return the set of trackable objects
        // return self.objects
        }
    }

    fn unregister(self: *Self, id: usize) !void {
        std.log.debug("unregister: {d}\n", .{id});
        _ = self.objects.swapRemove(id);
        _ = self.disappeared.swapRemove(id);
        self.counter -= 1;
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
    var net = cv.Net.readNetFromONNX(model) catch |err| {
        //var net = cv.Net.readNet(model, "") catch |err| {
        std.debug.print("Error: {any}\n", .{err});
        std.os.exit(1);
    };
    defer net.deinit();

    if (net.isEmpty()) {
        std.debug.print("Error: could not load model\n", .{});
        std.os.exit(1);
    }

    net.setPreferableBackend(.default);
    net.setPreferableTarget(.cpu);
    std.debug.print("getLayerNames {any}\n", .{net});

    // centroid tracker to keep objects in motion
    var tracker = try Tracker.init(allocator);

    const scale: f64 = 1.0 / 255.0;
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

        //cv.resize(squaredImg, &squaredImg, cv.Size.init(640, 640), 0, 0, .{});

        // transform image to CV matrix / 4D blob
        var blob = try cv.Blob.initFromImage(squaredImg, scale, Size.init(640, 640), mean, swapRB, crop);
        defer blob.deinit();

        // run inference on Matrix
        // prob result: objid, classid, confidence, left, top, right, bottom.
        net.setInput(blob, "");
        var probs = try net.forward("");
        defer probs.deinit();

        //const rows = probMat.get(i32, 0, 0);
        //const dimensions = probMat.get(i32, 0, 1);
        //std.debug.print("mat rows {d}\n", .{rows});

        // Yolo v8 reshape
        // xywh vector + numclasses * 8400 rows
        const rows: usize = @intCast(probs.size()[2]);
        const dims: i32 = probs.size()[1];

        var probMat = try probs.reshape(1, @intCast(dims));
        defer probMat.deinit();
        std.debug.print("probMat dimensions {any} rows {any} dims {any}\n", .{probs.size(), rows, dims});
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

// for i in range(rows):
//     classes_scores = outputs[0][i][4:]
//     (minScore, maxScore, minClassLoc, (x, maxClassIndex)) = cv2.minMaxLoc(classes_scores)
//     if maxScore >= 0.25:
//         box = [
//             outputs[0][i][0] - (0.5 * outputs[0][i][2]),
//             outputs[0][i][1] - (0.5 * outputs[0][i][3]),
//             outputs[0][i][2],
//             outputs[0][i][3]]
//         boxes.append(box)
//         scores.append(maxScore)
//         class_ids.append(maxClassIndex)

// result_boxes = cv2.dnn.NMSBoxes(boxes, scores, 0.25, 0.45, 0.5)

// detections = []
// for i in range(len(result_boxes)):
//     index = result_boxes[i]
//     box = boxes[index]
//     detection = {
//         'class_id': class_ids[index],
//         'class_name': yolo_classes[class_ids[index]],
//         'confidence': scores[index],
//         'box': box,
//         'scale': scale}
//     detections.append(detection)
//     print(detection)
//     draw_bounding_box(original_image, class_ids[index], scores[index], round(box[0] * scale), round(box[1] * scale),
//                       round((box[0] + box[2]) * scale), round((box[1] + box[3]) * scale))

// cv2.imwrite("object-detection.jpg", original_image)

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
    //std.debug.print("indices {any}\n", .{indices});

    // 3) reduce results
    var reduced = ArrayList(Result).init(allocator);
    defer reduced.deinit();
    i = 0;
    while (i < indices.items.len) : (i += 1) {
        const idx: usize = @intCast(indices.items[i]);
        //const cls: usize = @intCast(classes.items[idx]);
        //const sco = scores.items[idx];
        try reduced.append(Result{
            .id = undefined,
            .box = bboxes.items[idx],
            .centre = centrs.items[idx],
            .score = scores.items[idx],
            .classId = @intCast(classes.items[idx]),
        });
        //const box = bboxes.items[idx];
        //const ctr = centrs.items[idx];

        // std.debug.print("box {any}\n", .{box});
        // std.debug.print("confidence {any}\n", .{sco});
        // std.debug.print("class id {d}\n", .{cls});
        // std.debug.print("class label {s}\n", .{lbl});
        cv.rectangle(img, bboxes.items[idx], green, 1);
        //cv.putText(img, "+", ctr, cv.HersheyFont{ .type = .simplex }, 0.5, green, 1);
        //try cv.imWrite("object-detection.jpg", img.*);
    }
    // 4) update tracker items
    try tracker.update(reduced, allocator);
    std.debug.print("trackers objects {d}\n", .{tracker.objects.items.len});
    std.debug.print("trackers length {d}\n", .{reduced.items.len});

    // 5) print info
    i = 0;
    while (i < tracker.objects.items.len) : ( i += 1) {
        const obj = tracker.objects.items[i];
        const lbl = try std.fmt.allocPrint(allocator, "{s} ({d:.2}) ID: {d}", .{CLASSES[obj.classId], obj.score, obj.id});
        //cv.rectangle(img, obj.box, green, 1);
        cv.putText(img, "+", obj.centre, cv.HersheyFont{ .type = .simplex }, 0.5, green, 1);
        cv.putText(img, lbl, cv.Point.init(obj.box.x - 10, obj.box.y - 10), cv.HersheyFont{ .type = .simplex }, 0.5, green, 1);
    }
}


// // C calc for YOLO8
// scores = data[4..]
// if (yolov8) {
//     float *classes_scores = data+4;

//     cv::Mat scores(1, classes.size(), CV_32FC1, classes_scores);
//     cv::Point class_id;
//     double maxClassScore;

//     minMaxLoc(scores, 0, &maxClassScore, 0, &class_id);

//     if (maxClassScore > modelScoreThreshold)
//     {
//         confidences.push_back(maxClassScore);
//         class_ids.push_back(class_id.x);

//         float x = data[0];
//         float y = data[1];
//         float w = data[2];
//         float h = data[3];

//         int left = int((x - 0.5 * w) * x_factor);
//         int top = int((y - 0.5 * h) * y_factor);

//         int width = int(w * x_factor);
//         int height = int(h * y_factor);

//         boxes.push_back(cv::Rect(left, top, width, height));
//     }
// }