---
layout: post
title: "About deep learning"
date: 2024-09-18 11:00:00 +0900
tag: [robot, machine learning, rotarymars's article]
thumbnail-img: "/assets/images/2024-09-18-thumbnail.jpeg"
author: "rotarymars"
---

Hello. I'm rotarymars.  
Last week, we had a cultural festival at our school, and many people came to see our robot exhibition at the Physics Research Club. Thank you for coming in the hot weather.  

Just during the robot exhibition, I introduced the handwritten digit recognition that I wrote in [the previous article](/2024/08/28/tensorflow-machinelearning.html) to some people.  

*I made the test cases myself, and the accuracy is 98%, so it should be fine.*  

I thought so, and I let many people try it at the cultural festival.  

However, surprisingly, it didn't recognize the digits correctly at all.  
I was curious about the reason, so I thought about it.  

# After the cultural festival
After the cultural festival, I let my friends try it.  
In the case of the first friend, he recognized the digits easily.  
However, when I let the second friend try it, he didn't recognize the digits correctly.  

I thought about the reason, and I realized that I was too shallow.  

The characteristics of the digits are different for each person.  

So, the friend who was interested in this asked me to create learning images of each digit, about 30 images in total, and test images of each digit, one image in total.  

I had about 120 images of my handwritten digits, so I let my friend's images be 40 times more than my images to learn, and I made a model.  

Then, my digits didn't change much, and my friend's digits were recognized with higher accuracy than before.  

# Why does increasing the number of images improve accuracy?
This is a continuation of the previous article, but I'd like to talk about the overview of the machine learning this time.  
Before that, there is a possibility that there is a mistake, so please contact me via email if you find any mistakes.  

# Inside the computer
![Inside the computer](/assets/images/2024-09-18.png)

As you can see, in the computer, the circles are stacked in multiple layers, and machine learning starts.  
This time, for the sake of the picture, I set the parameters (information) to 8 and the class to 2.  

For example, let's consider the following scenario.  
You are given 8 numbers (price, durability, warranty period, etc.) about a certain product.  
The quality of the product is judged by these 8 numbers only.  

You are given 8 numbers and the quality of the product.  
Based on that information, please create a program that can judge the quality of the product only by machine.

Normally, you would program a program that would branch based on the numbers given in advance, and then judge the quality of the product.

However, with machine learning, you don't have to do that, and it will learn by itself.

Let's see how it works.

8 numbers are given to the circle on the far left.  

Then, the number is passed to the circle connected by the line.

Finally, the last two circles determine the probability of good or bad based on which number is larger.

This is how it works.

In machine learning, the "some number" is passed to the next circle, and the probability of reaching the last circle correctly is determined by randomly operating it.

# Back to handwritten digits
The handwritten digit data has 784 circles of 28px each on the left, and the last layer on the far right has 10 circles.

If my digits have a feature, the machine learning will progress based on that number, and it will not work well with other people's digits.

In that sense, not only is it necessary to collect more data to learn, but it is also necessary to collect data with various widths.

# How to use it in the robot
In the rescue we are participating in, there is a zone called the rescue zone, where we pick up balls.

I would like to recognize the position of the ball by recognizing the ball with the camera through machine learning.
