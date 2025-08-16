---
layout: post
title: "Robot introduction"
date: 2024-09-07 12:00:00 +0900
tag: [robot,EV3, nishikazu's article]
thumbnail-img: "/assets/images/robot.jpg"
author: "nishikazu"
---

# Overview

This time, we have been invited to exhibit our robot at the school's cultural festival.
So, I'd like to introduce the functions of our robot again.

# Self introduction
We are all members of **Physics Club**.
We are in the **Robot Group** and make robots every day.
We are making a robot that can line trace to participate in the large robot competition called the RoboCup.

Please read about [robocup rescue](https://drive.google.com/file/d/1REmoiyymxDDJaxguL8DYB3JC_gSHJxsU/view) here.

RoboCup is a large robot competition organized by the RJC RoboCup Japan Committee.

We are participating in the Rescue Line, where we line trace to pick up balls (victims) and compete for points.

# Explanation of the robot's mechanism

## Explanation of the robot's movement

**The basic of line tracing is the difference in the strength of the reflected light of the left and right color sensors.**

Currently, we are using the [EV3 color sensor](https://ev3-help-online.api.education.lego.com/Retail/ja-jp/page.html?Path=editor%2FUsingSensors_Color.html) that is built in to the EV3.
We are using an Arduino to make a custom color sensor because the EV3 color sensor is no longer available. (I think it's not necessary to scrap it.)

With this sensor, we can get the strength of the reflected light of the sensor as a value from 0 (dark) to 100 (bright).

For example,

|                   | ① : Straight line              | ② : Left turn            | ③ : Off track 　　　　|
|:-----------------:|:--------------------------:|:------------------------:|:---------------------:|
| Left color sensor | White (close to 100)　              | Black (close to 0)              | Gray (about 50)           |
| Right color sensor | White (close to 100)               | White (close to 100)             | White (close to 100)          |
|      Angle to move      | 100-100 = 0 degree               | 0-100 = -100 degree (left 100 degree)| 50-100 = -50 (left 50 degree)  |
|       Note        | 0 degree means straight ahead. | Black means turn to the direction of black. | If the color is subtle, the turn will be slightly less. |

This way, we can control the robot approximately by determining the angle to move according to the difference in brightness of the left and right sensors.
However, there is a limit in terms of accuracy. So, we came up with the idea of PID control.

**PID control** is a control method that is widely used in industry and other fields.
```
1. P is Proportion, which is the control method we introduced above. Our robot also moves basically with this.

2. I is Integral, which is a control method that keeps the robot as close as possible to the target angle. We save the data of the color sensor for several times in the past and use it to calculate the integral, and then add the value to the P control value.

3. D is Differential, which is a control method for changing the amount of change, such as when changing to a right angle. We add a value proportional to the amount of change to make the robot turn more when the change is large.
```

We call this PID control by combining these three.

[Wikipedia - PID control](https://ja.wikipedia.org/wiki/PID%E5%88%B6%E5%BE%A1)

## Explanation of the robot's green detection mechanism

The EV3 color sensor can get data of three values of R, G, and B. This is a method of representing color by how much the three primary colors of light, Red, Blue, and Green, are mixed.

We can use the values as they are, but we use hue and saturation from HSV to detect green more accurately and without malfunction.

Have you ever seen this color circle?

![色相環](https://blogger.googleusercontent.com/img/a/AVvXsEho8uFoa3JTvWVkylUZjYvbH8pInyVOV0wp6NDH_glpVeoNJDO5h6UpHXiqacNqDSnk236FYjd5vrHnNRV4CjLPOr7mpvhsI2HXV91647Ww2n9Wdn13aSm_vvdxj84bF8Es9501oyxU0mXtiL1I14nUuOn37B2rx8F0u5lmig4YHCOmaNo_mjA-wJ51=s200)

(Source : https://hirotama.blogspot.com/ フリー素材【色相環】Hue circle, 2021)

The method of specifying color by the angle of where it is on the color circle and the saturation, which is the vividness of the color,

The red on the color circle is 0 degrees, the green is 120 degrees, and the blue is 240 degrees. This allows us to determine if it is green just by specifying the angle.

Also, to avoid mistaking the black line for a dark green, we add a judgment of the brightness of the color, so that it is not judged as green unless it is somewhat bright.

For reference, I'll leave the formula for deriving HSV from the values of R, G, and B. (This time, we used hue and brightness for the judgment.)
```
Let MAX be the largest value among R, G, and B, and MIN be the smallest value.

    If R is MAX, then hue H = 60 × ((G - B) ÷ (MAX - MIN))

    If G is MAX, then hue H = 60 × ((B - R) ÷ (MAX - MIN)) +120

    If B is MAX, then hue H = 60 × ((R - G) ÷ (MAX - MIN)) +240

　　If R, G, and B are all the same value, then hue H = 0

If the hue H is a negative number, add 360 to the hue H.

------
Saturation S = (MAX - MIN) ÷ MAX

------
Brightness V = MAX
```

# The future of the robot
・ As I mentioned earlier, we will complete the circuit of the custom color sensor and install it on the robot.

・ In the RoboCup, there are rules such as not being able to turn when there is a green line behind the black line, and not being able to turn when both sides are green, so we will make a program that corresponds to those rules.

We will work hard for the RoboCup in November!

Thank you for reading.

