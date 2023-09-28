# shell-game

Machine learning and computer vision in a shell game contest

This project is primarily for Oslo Skaperfestival 2023, but is an open-minded machine learning project
intended to test some strategies for using neural networks and computer vision to see if we
can train a machine in the ancient shell game

![robot mock](docs/shell-robot.png)

![segmented view](docs/segmented-cups.png)

## Rules of the game

Player lines up three (or more) cups on the table in the visibility of camera on designated spots, along with a visible ball.
One of the cups is lifted and placed above the ball, hiding it inside.
All cups are randomly shuffled for a few a maximum of 10 seconds.
Finally, the cups are placed in three (or more) designated squares.
The robot then tries to decide which cup is hiding the ball.

Scores are being tracked in separate web service

## Behind the scenes

Using nothing but computer vision (web camera) and neural networks, the program tries to calculate the most likely
cup to hide the ball. This involves classification of objects, tracking, and prediction heuristics, constantly
trying to improve its results.

Centroids of tracked ball (or object presumably hiding ball) will be pushed to web or over bluetooth to animatrinics robot
to let eyes follow object.

Man vs machine scores will be updated regularly, as well as a new model for classification/neural processing.

A simple [Bun.js](https://bun.sh/) server handles prediction and tracking data sent from application and forwards to eye tracker
and other instances using a low level data API

## Technical instruction

For install instructions and requirements, refer to: [Installation](docs/INSTALLATION.md)