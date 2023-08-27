#include <opencv2/core/core.hpp>
#include <opencv2/imgcodecs/imgcodecs.hpp>
#include <opencv2/imgproc/imgproc.hpp>
#include <opencv2/highgui/highgui.hpp>

extern "C" void doSomething(void) {
    cv::Mat image = cv::imread("sample.png", cv::IMREAD_COLOR);

}
