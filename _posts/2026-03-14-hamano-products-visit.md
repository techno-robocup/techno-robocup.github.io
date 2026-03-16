---
layout: post
title: "Visit to Hamano Products (浜野製作所)"
date: 2026-03-14 10:00:00 +0900
tag: [robot, rotarymars's article, visit]
thumbnail-img: "/assets/images/20260314/PXL_20260216_102525311.jpg"
author: "rotarymars"
---

Hi!

On February 16th, we visited Hamano Products (浜野製作所).

This was one of the most meaningful learning opportunities for our team this season.
We learned many things that we had never considered before, especially how to think about a robot not only as a collection of parts, but as a balanced system where each decision affects the whole machine.

# What we learned at Hamano Products

The most valuable topic was weight distribution.
We discussed where the robot's weight should be concentrated and why it should not be biased too much to one side.

Before this visit, we tended to focus mainly on "Can this part fit?" or "Can this mechanism move?"
At Hamano Products, we learned to ask better questions:

- Where is the center of gravity during acceleration and deceleration?
- Does the current layout increase the risk of tipping when the robot turns?
- Are heavy components placed to support stable line tracing and obstacle handling?

These discussions gave us a new perspective on stability, movement, and control during runs.
Even if two robots have similar software, mechanical balance can produce very different performance.

# Why this matters for our robot

Our robot contains many components in a compact frame: motors, battery, controller board, camera, and custom mechanisms.
Because of this, small placement differences can have a big impact.

For example, if too much mass is concentrated toward one corner, the robot may drift more during turns.
If the center of gravity is too high, vibrations can increase and sensor readings can become less stable.

After the visit, we reviewed our current design and identified several improvements:

- Reposition heavy parts to reduce left-right imbalance.
- Keep weight lower in the chassis where possible.
- Recheck frame rigidity to reduce flex during fast motion.
- Test each mechanical change with repeatable driving logs.

This visit reminded us that good performance is not only about "better code" but also about robust mechanical fundamentals.

# Photos from the visit

The following photos show our robot and related setups that we discussed during the visit.
Seeing the real machine from multiple angles helped us notice details we had missed before.

![Robot photo 1 at Hamano Products](/assets/images/20260314/PXL_20260216_102525311.jpg)

![Robot photo 2 at Hamano Products](/assets/images/20260314/PXL_20260216_102550125.jpg)

![Robot photo 3 at Hamano Products](/assets/images/20260314/PXL_20260216_102557783.jpg)

![Robot photo 4 at Hamano Products](/assets/images/20260314/PXL_20260216_102604497.jpg)

# Next steps

We are now turning what we learned into concrete experiments.
In our next development cycle, we will compare performance before and after each hardware adjustment and document the results.

We are very grateful for this opportunity at Hamano Products (浜野製作所).
The visit gave us technical insights, but also motivation to keep improving as a team.

Thanks for reading!
