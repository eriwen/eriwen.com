---
layout: post
comments: true
title: "Awakening the Engineering Lead Within - Part 1: Communication"
slug: communication
published: true
date: 2016-06-30 06jek:00
category: leadership
---

Leadership comes in many forms: a voice that carries more weight in technical discussions, an organizer of triage and resolution when something goes wrong, or a person who works closely with product owners and other teams to make sure others are working on the highest impact tasks.

Many of these items are often associated with an individual with a "higher" title. In my experience, the people who are able to affect the greatest change are those who educate and empower others. _Elon Musk does not build Tesla's cars or SpaceX rockets himself._

It's helpful when a leader has a strong technical background, but there's so much more to it: Communication, Mentoring, Planning, and Fostering Culture. All of these things require skills that I fear most software engineers aren't given an opportunity to develop.

This is a series of posts on what I've learned from leading software teams and OSS projects, and what I wish I'd known before becoming a tech lead. This first post is a collection of general recommendations and specific techniques I've gathered by recklessly stealing ideas from mentors. I'll tweet about further parts of the series [on  Twitter](https://twitter.com/eriwen).

## General Recommendations
I hope I don't have to stress that communication is important. I've been a part of several engineering teams that accomplish much less or much more depending on their communication behavior.

In order to facilitate meaningful and effective communication, the most important things you can do are:

  * Empathize with those you work with
  * Model desirable behavior yourself
  * Include your teammates on technical discussions early
  * When saying "no" to an idea, **acknowledge the idea's merit, first**. Make the case for a really great "yes"
  * Explicitly allow your teammates to say "no" to you

Remember these things, even if they are your only take away from this post.

## Improving Technical Decision-Making
At times, a team will need to make big technical decisions like adopting a new technology or choosing between them. Here are a couple of techniques I have found useful for coming to an _educated consensus_.

#### Bake-off
Given a small number of choices and a decision large enough that making the wrong call can cost weeks of time or > $100k, it may be prudent to try 2 or 3 candidate approaches for a small amount of time and present findings. I would recommend around 2-5 days for trying things out and preparing a presentation.

Implementation details to consider:
 * Spend no less than 2 and no more than 5 days
 * Teams must report biggest risks/costs and their potential impact
 * Product stakeholders should be included in assessment

**Remember: the goal is learning!** Any code written should be thrown away &mdash; do not succumb to the temptation to simply use the quick work for a proof-of-concept lest you risk missing important details!

At a smaller scale (fewer options, perhaps), others may call this technique "spiking".

#### Facts and Values
When you have technical information but the team cannot come to consensus, focusing on the facts and values can be useful. It works like this:

 * List irrefutable facts, typically hard data or well known information.
 * List values that affect peoples' opinions.

Story time: A mentor of mine used this technique helped us decide between spending a lot of money on dedicated server hardware or simply expanding our cloud-hosted presence.

Some of the _Facts_ we listed:
 * monetary cost of each approach
 * lead time (buying servers takes significantly more time)
 * historical product growth

And some example _Values_:
 * want to save money
 * want a long-term strategy
 * want to avoid [unknown-unknown](https://en.wikipedia.org/wiki/There_are_known_knowns) technical risks

We learned that **our differences were only in the Values** and we were able to identify root concerns and come to a decision everyone (at least seemingly) felt good about.

## Avoiding Communication Breakdowns
Adapting to different personalities is a fundamental part of diversity. One personality trait that I've encountered often with talented engineers is introversion. There's nothing wrong with this, but it can cause communication breakdowns.

Here's a few examples of behaviors that significantly hurt my own teams:
 * Changes or adopts fundamental technologies like communication protocols without notifying the team or allowing others to provide input
 * Does not mention crucial items thought to be "obvious"
 * Avoidance of tasks requiring communication like code reviews

Communicating is sometimes the "hard" part of "hard work". Cranking out a technical solution is often easier than having to explain justify it to one's peers, but this is critical for the success of teams > 2 people.

People will do "hard work" if _they believe it will allow them to achieve goals_ and that _good things will come to them if they achieve those goals_.

#### Creating shared experiences
One of the most effective and simple things to do that has helped greatly is having fun together. Consider organizing an activity for at least 2 hours where you and the team can:

 * Do a puzzle or escape room
 * Buy at least 2 rounds of drinks (doesn't have to be alcohol, but I've found it effective)
 * Setup a gaming tournament, especially if the game is something unfamiliar

One other important thing is to **regularly celebrate even small achievements**. Friday demos is an awesome and fun way to achieve this; best if paired with everyone's favorite beverage and a sense of humor.

#### Explicitly make communication part of the task
If you're not in a position to create shared experiences, it is helpful to make communicating a literal checkbox to check. Some engineers love the feeling of completing things, and this can be motivating if approached correctly.

#### State what reading is required and what is optional
In order to ensure that people actually receive communications, I recommend making it explicit what is expected from receivers. One good example from a former team:

 * Reading email is required
 * Keeping up-to-date on chat is optional
 * Reading discussion on your code reviews is required
 * Following GitHub activity is optional

This is helpful because _team members will know what others should know_. Additionally, keep a set of docs for new hires to get up-to-speed (more on that in Part 2 - Growth).

## That's all for now
Thanks for reading. This has been my experience I wanted to share with you. If you like it hate it, I encourage you to [reach out to me on Twitter](https://twitter.com/eriwen) or leave a comment below.
