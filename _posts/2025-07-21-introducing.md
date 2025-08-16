---
layout: post
title: "Development system"
date: 2025-07-21 10:00:00 +0900
tag: [robot, rotarymars's article, software]
thumbnail-img: "/assets/images/2025-07-21-introducing.png"
author: "rotarymars"
---

Hello. I'm rotarymars.

Recently, I've been writing a lot of articles related to the robot, so this time, I'd like to write about our team's development system.

# Team structure

Our team is structured as follows.

| Role | Number (Total) | Who |
| --- | --- | -- |
| 機体 | 1 | ALPAKA |
| 回路 | 2 | K10-K10, rotarymars |
| ソフトウェア | 2 | K10-K10, rotarymars |
| ブログ | 3 | ALPAKA, K10-K10, rotarymars |

It's like this.

This means that on average, each member is responsible for `2.5` roles (we are looking for members).

# Development system for the robot
Since there is only one person involved in the development of the robot, we are working in the most convenient system for one person.

I'd like to be able to participate more in the future, but it seems difficult to edit the robot at the same time due to various data.

# Development system for the circuit
Since we are doing it with two people, we are trying to make it possible to communicate with each other.

We use [kicad](https://www.kicad.org/) to design the circuit, so we upload the data to [github](https://github.com/).

This way, the data that the two people worked on is reflected when pulled.

Personally, I'm not satisfied with the fact that I can't see where the edit was made in [kicad](https://www.kicad.org/) visually.

# Development system for the software
The software is also done with [github](https://github.com/), so we can communicate with each other.

Since the software is written in text, it is easier to see the diff than other development.

# Development system for the blog
The blog is also managed with [github](https://github.com/).

We use [jekyll](https://jekyllrb.com/) to create the blog.

![delta](/assets/images/2025-07-21-delta.png)

# Development system for the team

We use [atlassian](https://www.atlassian.com/) for task management.

This is a task management tool for realizing [agile software development](https://ja.wikipedia.org/wiki/%E3%82%A2%E3%82%B8%E3%83%A3%E3%82%A4%E3%83%AB%E3%82%BD%E3%83%95%E3%83%88%E3%82%A6%E3%82%A7%E3%82%A2%E9%96%8B%E7%99%BA), which lists tasks to be done by the team and makes it easier to estimate how much can be done within the deadline.


# Conclusion

This time, I've written a short article, but I think the task management for the team is not well known, so I hope you'll try it if you're interested.

Thank you for reading.