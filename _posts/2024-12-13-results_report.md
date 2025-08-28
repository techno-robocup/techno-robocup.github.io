---
layout: post
title: "Results report"
date: 2024-12-12 21:00:00 +0900
tag: [robot, rotarymars's article]
thumbnail-img: "/assets/images/2024-12-12-thumbnail.png"
author: "rotarymars"
---
Hello. I'm rotarymars.

I've been busy with the competition and the competition, and it's been a long time since my last post.

This time, I'd like to briefly summarize the results of the East Tokyo Node, the lessons learned, and the plans for the East Tokyo competition.

# ！！Results！！
This year's East Tokyo Node competition was 7th place.

Last year, we were able to achieve a much higher score than last year by having a more stable line tracing machine and program.

# Lessons learned
Last year, we were able to achieve a much higher score than last year by having a more stable line tracing machine and program.
However, the number of false detections of green detection was not significantly reduced, and it was also a cause of time loss and deviation from the line.

# Plans for the future
Currently, we plan to replace all sensors except the touch sensor with cameras.

Specifically,

- Line tracing is done by obtaining an image from the camera and tracing the line based on the brightness, just like the color sensor in the past.

- In the rescue, we will use the camera and yolo to determine the position of the ball, pick it up, and drop it in the correct zone.

We are aiming for this.

Currently, we plan to connect two camera modules to a raspberry pi.

# Finally
I think that line tracing that is not affected by the material (can be used on a surface that is easy to reflect) can be done by using a camera.

I'll work hard to achieve good results in the East Tokyo competition.

Thanks for reading!
