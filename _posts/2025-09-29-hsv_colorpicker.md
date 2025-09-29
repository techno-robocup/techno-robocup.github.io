---
layout: post
title: "Let's acquire the HSV of an image!"
date: 2025-09-29 16:00:00 +0900
tag: [rotarymars's article, program, software]
thumbnail-img: "/assets/images/HSV-circle.png"
author: "rotarymars"
---
# It is so difficult to handle HSV in cv2!
When we are writing programs for our robot, we have to handle a lot of HSV values.

However, in cv2, hue values are from 0 ~ 180, and saturation/value are 0~255, which is very complicating since most websites doesn't give us the numbers in those ranges.

That is why we have decided to create a simple application that makes us available to pick a specific pixel of an image and give us the HSV values.

Not only that, but we made a feature that gives the stats of the clicked pixels, that makes us easy to configure the threshold to make a mask on the images.

# Let's take a look at the finished application
It goes like this. Check the video below.

[動画](/assets/images/Screencast%20from%202025-09-15%2013-44-15.webm)

# Main features and benefits
## Real-time view of HSV values
