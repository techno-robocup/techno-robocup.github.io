---
layout: post
title: "Line tracing program"
date: 2025-05-11 10:00:00 +0900
tag: [robot, rotarymars's article, line-trace, program]
thumbnail-img: "/assets/images/robot-02.jpg"
author: "rotarymars"
---
Hello. I'm rotarymars.

First of all, I'd like to announce the update frequency of the blog again.

| ALPAKA | The remainder when the month is divided by 3 is 0 or 1 |
| K10-K10 | The remainder when the month is divided by 3 is 0 or 2 |
| rotarymars | The remainder when the month is divided by 3 is 1 or 2 |

We will update the article once a month in these months, so please look forward to us.

# About the content of this article
This time, I'd like to write about the line tracing program that we are currently considering.

The program is about [this point](https://github.com/techno-robocup/robocup2025_raspberrypi_program/tree/2aa6a78f848aa399d7de8e9522e22457549cda2c).

# First, what will we use to do line tracing?
We want to continue to use the camera for line tracing this year.

Specifically, we want to connect a camera like [this](https://www.marutsu.co.jp/pc/i/2582866/?srsltid=AfmBOopbmXQJaQxBT3iPoE_9YWJHDGGlkC7d1VmHUMrUX68OTDen-XPl) to the Raspberrypi and get the image to do line tracing.

I just want to let you know that we haven't been able to test the actual run because the robot hasn't been completed yet.

# Actual program
The program is quite long, so I'll paste it step by step.
Also, it's very ugly, so it may be difficult to read (I want to make a class someday, but I haven't done anything yet).

By the way, this time, we'll look at modules/settings.py, which is particularly related to line tracing.

```python
from libcamera import controls
from picamera2 import MappedArray
import cv2
import time
import numpy as np
import threading
# 途中略
def Linetrace_Camera_Pre_callback(request):
  if DEBUG_MODE:
    print("Linetrace precallback called", str(time.time()))

  global lastblackline, slope

  try:
    with MappedArray(request, "lores") as m:
      image = m.array

      camera_x = Linetrace_Camera_lores_width
      camera_y = Linetrace_Camera_lores_height

      if DEBUG_MODE:
        cv2.imwrite(f"bin/{str(time.time())}_original.jpg", image)

      gray_image = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)

      _, binary_image = cv2.threshold(gray_image, Black_White_Threshold, 255,
                                      cv2.THRESH_BINARY_INV)

      if DEBUG_MODE:
        cv2.imwrite(f"bin/{str(time.time())}_binary.jpg", binary_image)

      kernel = np.ones((3, 3), np.uint8)
      binary_image = cv2.erode(binary_image, kernel, iterations=2)
      binary_image = cv2.dilate(binary_image, kernel, iterations=3)

      detect_green_marks(image, binary_image)

      contours, _ = cv2.findContours(binary_image, cv2.RETR_TREE,
                                     cv2.CHAIN_APPROX_NONE)

      if not contours:
        return

      best_contour = find_best_contour(contours, camera_x, camera_y,
                                       lastblackline)

      if best_contour is None:
        return

      cx, cy = calculate_contour_center(best_contour)

      with LASTBLACKLINE_LOCK:
        lastblackline = cx

      with SLOPE_LOCK:
        slope = calculate_slope(best_contour, cx, cy)

      if DEBUG_MODE:
        debug_image = visualize_tracking(image, best_contour, cx, cy)
        cv2.imwrite(f"bin/{str(time.time())}_tracking.jpg", debug_image)

  except Exception as e:
    if DEBUG_MODE:
      print(f"Error in line tracing: {e}")
```
Let's look at it step by step.
## Line 1 ~ 6
As you can see, we're including the necessary libraries (in Python, they're called modules) and importing them.
## Line 8 ~
It's finally time for the explanation.

First, let's explain what precallback is.

In Raspberrypi, you can preview the camera image by using the `rpicam-hello` command (the command name may be different).

The command is a program that sends an image acquisition request and then displays the image.

The thing used at that time is the `picamera2` library (module).

Specifically, you can specify a `precallback function` when generating the camera object.

It is `None` by default, and there is no hook when the image is acquired.

However, by registering a function here, the object is passed to the first argument of the function (in this case, `request`).

By doing this, the image data stored in `request` can be obtained as a `numpy` array, `lores` quality.

This way, we can avoid capturing the image every time it is needed, and we can get the image faster (the processing inside the function is heavy, so I don't know how to say it, but if we don't do anything, we can get it at about 20msec/frame).

However, if there is an operation that consumes a lot of CPU resources in that function, if the camera is not stopped when it is not in use, it will consume a lot of power.

Therefore, the camera should be started and stopped separately when it is in use and not in use.

### Line 9 ~ 10
As you can see, when DEBUG_MODE is enabled, the UNIX TIME when the function is called is printed.
### Line 12
Global variables are declared.

Let's talk about the variables used here.

| Variable name | Usage |
| --- | --- |
| lastblackline | The center coordinate of the previous black line |
| slope | The slope of the black line |

By making these global variables, we can access them from the main process.

### Line 14 ~ 22
Let's ignore all exceptions for now.

The image is stored in the variable `image` as a numpy array.

`camera_x` and `camera_y` store the vertical and horizontal number of pixels of the camera.

And when DEBUG_MODE is enabled, the original image is saved.

### Line 24 ~ 30
The image is converted to grayscale. This is because we want to binarize the image later.

In line 26, the image binarized with `Black_White_Threshold` as the threshold is stored in `binary_image`. The ones that are close to black become white, and the ones that are close to white become black.

Here's a side note, but the reason for converting to grayscale is that we can't binarize a color image directly into black and white. If we apply it directly to the function, each color (r, g, b) will be binarized as each threshold, and a highly saturated (?) image will be created (I recommend actually seeing it for explanation).

And when `DEBUG_MODE` is enabled, the binarized image is saved.

### Line 32 ~ 35
Here, we remove the noise contained in the binarized image.

Let's explain how each function is doing.

#### kernel = np.ones((3, 3), np.uint8)
This creates a 3x3 `numpy` two-dimensional array. All elements are `1`.

#### binary_image = cv2.erode(binary_image, kernel, iterations=2)
Using the `kernel` we just created, we remove the noise from `binary_image`. Specifically, if one of the pixels in the range of `kernel` is black (0), the center pixel is converted to black (0).

This way, the white blocks become smaller and the noise is removed.

By the way, the black and white determination is made by whether the number of each element of `kernel` is below or above.

Since `iterations=2`, this is executed twice.
#### binary_image = cv2.dilate(binary_image, kernel, iterations=3)
This is the opposite of `erode`. That is, the black blocks become larger.

Specifically, if one of the pixels in the range of `kernel` is white (1), the center pixel is converted to white (1).

Since `iterations=3`, this is executed three times.

### Line 36
Here, we recognize the green marks, and perform the relative position determination. I'll explain the function later.

### Line 37 ~ 45
`contours` is recognized using the cv2 function.

Then, using the `find_best_contour` function we created ourselves, we get the most appropriate contour and store it in `best_contour`.

### Line 47 ~ 50
Here, we get the center coordinates of `best_contour`.

If `best_contour` is not found, the process is ended as is.

### Line 53 ~ 56
Here, we update `lastblackline` and `slope`.

`lastblackline` represents the x-coordinate of `blackline`, and is used to find `best_contour`.

`slope` is the slope of the black line.

Specifically, the slope from the center of the bottom of the image to the center of `best_contour` is calculated.

By the way, `with ..._LOCK:` is locking the `..._LOCK` object.

Locking is a mechanism to prevent other processes from using a variable when a certain process is using it.

This way, the writing to this variable becomes atomic (exclusive) (it is guaranteed that it will not become strange if it is edited at the same time. It is also necessary to set it when reading).

※I'm not very familiar with it, but I think it's probably an OS-level operation, so it's better not to use it too much to be able to process faster.

### Line 57 ~
When `DEBUG_MODE` is enabled, the image is saved.

And then, we're handling exceptions. It's simple, isn't it?

# Finally
I hope you understand how the program is working. I want to fix the part where the image passed as an argument to the function that detects the green mark is directly overwritten as soon as possible.

This time, I haven't been able to explain all the functions (because I didn't have much time), but I hope you understand what I'm doing.

I want the team members to read this blog and understand the contents of the program.

Thank you.

↑↑I also want to follow K10-K10, so I'll add it at the end.↑↑
