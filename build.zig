const std = @import("std");

// Although this function looks imperative, note that its job is to
// declaratively construct a build graph that will be executed by an external
// runner.
pub fn build(b: *std.Build) void {
    // Standard target options allows the person running `zig build` to choose
    // what target to build for. Here we do not override the defaults, which
    // means any target is allowed, and the default is native. Other options
    // for restricting supported target set are available.
    const target = b.standardTargetOptions(.{});

    // Standard optimization options allow the person running `zig build` to select
    // between Debug, ReleaseSafe, ReleaseFast, and ReleaseSmall. Here we do not
    // set a preferred release mode, allowing the user to decide how to optimize.
    const optimize = b.standardOptimizeOption(.{});

    // Compile static library of opencv
    const cv = b.addStaticLibrary(std.Build.StaticLibraryOptions{
        .name = "zigcv",
        .target = target,
        .optimize = optimize,
    });
    cv.addIncludePath(b.path("include"));
    cv.addIncludePath(b.path("include/contrib"));
    cv.addLibraryPath(b.path("libs"));
    cv.addLibraryPath(b.path("libs/contrib"));
    cv.addIncludePath(b.path("include/opencv4")); // linked in from /usr/local/include/opencv4
    cv.addCSourceFile(.{ .file = b.path("libs/asyncarray.cpp"), .flags = &.{} });
    cv.addCSourceFile(.{ .file = b.path("libs/calib3d.cpp"), .flags = &.{} });
    cv.addCSourceFile(.{ .file = b.path("libs/core.cpp"), .flags = &.{} });
    cv.addCSourceFile(.{ .file = b.path("libs/dnn.cpp"), .flags = &.{} });
    cv.addCSourceFile(.{ .file = b.path("libs/features2d.cpp"), .flags = &.{} });
    cv.addCSourceFile(.{ .file = b.path("libs/highgui.cpp"), .flags = &.{} });
    cv.addCSourceFile(.{ .file = b.path("libs/imgcodecs.cpp"), .flags = &.{} });
    cv.addCSourceFile(.{ .file = b.path("libs/imgproc.cpp"), .flags = &.{} });
    cv.addCSourceFile(.{ .file = b.path("libs/objdetect.cpp"), .flags = &.{} });
    cv.addCSourceFile(.{ .file = b.path("libs/photo.cpp"), .flags = &.{} });
    cv.addCSourceFile(.{ .file = b.path("libs/svd.cpp"), .flags = &.{} });
    cv.addCSourceFile(.{ .file = b.path("libs/version.cpp"), .flags = &.{} });
    cv.addCSourceFile(.{ .file = b.path("libs/video.cpp"), .flags = &.{} });
    cv.addCSourceFile(.{ .file = b.path("libs/videoio.cpp"), .flags = &.{} });
    cv.addCSourceFile(.{ .file = b.path("libs/contrib/tracking.cpp"), .flags = &.{} });

    cv.linkLibC();
    cv.linkLibCpp();
    b.installArtifact(cv);

    const exe = b.addExecutable(.{
        .name = "shell-game",
        // In this case the main source file is merely a path, however, in more
        // complicated build scripts, this could be a generated file.
        .root_source_file = b.path("src/main.zig"),
        .target = target,
        .optimize = optimize,
    });

    // Compile in zigcv module
    const zigcvMod = b.addModule("zigcv", .{ .root_source_file = b.path("libs/zigcv.zig") });
    zigcvMod.addCSourceFile(.{ .file = b.path("libs/asyncarray.cpp"), .flags = &.{} });
    zigcvMod.addCSourceFile(.{ .file = b.path("libs/calib3d.cpp"), .flags = &.{} });
    zigcvMod.addCSourceFile(.{ .file = b.path("libs/core.cpp"), .flags = &.{} });
    zigcvMod.addCSourceFile(.{ .file = b.path("libs/dnn.cpp"), .flags = &.{} });
    zigcvMod.addCSourceFile(.{ .file = b.path("libs/features2d.cpp"), .flags = &.{} });
    zigcvMod.addCSourceFile(.{ .file = b.path("libs/highgui.cpp"), .flags = &.{} });
    zigcvMod.addCSourceFile(.{ .file = b.path("libs/imgcodecs.cpp"), .flags = &.{} });
    zigcvMod.addCSourceFile(.{ .file = b.path("libs/imgproc.cpp"), .flags = &.{} });
    zigcvMod.addCSourceFile(.{ .file = b.path("libs/objdetect.cpp"), .flags = &.{} });
    zigcvMod.addCSourceFile(.{ .file = b.path("libs/photo.cpp"), .flags = &.{} });
    zigcvMod.addCSourceFile(.{ .file = b.path("libs/svd.cpp"), .flags = &.{} });
    zigcvMod.addCSourceFile(.{ .file = b.path("libs/version.cpp"), .flags = &.{} });
    zigcvMod.addCSourceFile(.{ .file = b.path("libs/video.cpp"), .flags = &.{} });
    zigcvMod.addCSourceFile(.{ .file = b.path("libs/videoio.cpp"), .flags = &.{} });
    zigcvMod.addCSourceFile(.{ .file = b.path("libs/contrib/tracking.cpp"), .flags = &.{} });

    zigcvMod.addIncludePath(b.path("include"));
    zigcvMod.addIncludePath(b.path("include/contrib"));
    zigcvMod.addIncludePath(b.path("include/opencv4")); // linked in from /usr/local/include/opencv4
    exe.root_module.addImport("zigcv", zigcvMod);

    // // Websocket module
    const wsMod = b.dependency("websocket", .{ .target = target, .optimize = optimize });
    exe.root_module.addImport("websocket", wsMod.module("websocket"));

    exe.linkLibC();
    exe.linkSystemLibrary("opencv4");
    exe.linkSystemLibrary("simpleble-c");
    exe.linkSystemLibrary("unwind");
    exe.linkSystemLibrary("m");
    exe.linkSystemLibrary("c");
    exe.linkLibrary(cv); // neccessary?
    b.installArtifact(exe);

    // This *creates* a Run step in the build graph, to be executed when another
    // step is evaluated that depends on it. The next line below will establish
    // such a dependency.
    const run_cmd = b.addRunArtifact(exe);

    // By making the run step depend on the install step, it will be run from the
    // installation directory rather than directly from within the cache directory.
    // This is not necessary, however, if the application depends on other installed
    // files, this ensures they will be present and in the expected location.
    run_cmd.step.dependOn(b.getInstallStep());

    // This allows the user to pass arguments to the application in the build
    // command itself, like this: `zig build run -- arg1 arg2 etc`
    if (b.args) |args| {
        run_cmd.addArgs(args);
    }

    // This creates a build step. It will be visible in the `zig build --help` menu,
    // and can be selected like this: `zig build run`
    // This will evaluate the `run` step rather than the default, which is "install".
    const run_step = b.step("run", "Run the app");
    run_step.dependOn(&run_cmd.step);

    // Creates a step for unit testing. This only builds the test executable
    // but does not run it.
    const unit_tests = b.addTest(.{
        .root_source_file = b.path("src/main.zig"),
        .target = target,
        .optimize = optimize,
    });

    const run_unit_tests = b.addRunArtifact(unit_tests);

    // Similar to creating the run step earlier, this exposes a `test` step to
    // the `zig build --help` menu, providing a way for the user to request
    // running the unit tests.
    const test_step = b.step("test", "Run unit tests");
    test_step.dependOn(&run_unit_tests.step);
}
