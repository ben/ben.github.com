---
layout: post-no-feature
title: "High-Five"
comments: true
---

A couple of weeks ago, my company began an experiment with HR and robots.

## ChatOps

[Gridium](gridium) is a distributed company.
There is no central office, and even our founders live in two different cities.
We do gather everybody together four times a year, but apart from that there isn't much face-to-face.
So we spend most of our time in [Slack](slack), and we are students in the art of [ChatOps](chatops).

Mostly what that means is that we have a Hubot (named Gort) whose most important task is to paste links to pug images into our chat room.
But we've also connected it to [Trello](trello), so we get notifications when something interesting happens:

![](/images/chatops/!trello.png)

…and to [Semaphore](semaphore), so we can trigger deployments:

![](/images/chatops/!deploy.png)

…and to a goodly number of other services, too.
This is way better than having a common set of shell scripts, because it lives where you live: in the chat room.

At some point, we realized that ChatOps is really just the automation of a social activity.
Doing deployments used to look like this in the chat room:

```
A: I'm doing a deployment, hang on to your butts.
B: Okay
C: Got it.
...(5 minutes pass)...
A: Okay, it's done. Is the website broken?
C: Nope, looks okay to me.
A: Great. Carry on, everybody.
```

The social contract here is that you tell your teammates when you're deploying.
They'll assume you won't destroy sensitive data by fat-fingering the deploy command on a production server, and you'll assume they'll all be careful not to break your deployment.
ChatOps improves this in a lot of ways.
Sure, we've gained visibility, but more importantly, now that it's easier to deploy in the chat room than any other way, *you'll never forget to tell the team when you're deploying.*

## An Experiment

So we're taking some of those social cues and automating them.
That's great for ops stuff, but what else is it good for?
What other kinds of social activities can we automate?
What about things that *aren't* engineering?

First of all, what would that even mean?
Well, we know that when you automate something, it becomes a tad less personal.
A great example of this is Facebook's birthday reminders.
Not only does it tell you that your friend is having a birthday, it gives you a handy tool to wish them a "HBD" with so little effort it's almost insulting **not** to do it.
The downside of this is that getting a "HBD" is pretty meaningless.
It takes less effort than a card, an email, a phone call, or even a text message, so it ranks lower than all of those on the scale of personal-ness.

But the upside of this is you gain power.
Facebook helps you remember more of your friends' birthdays, without even trying to.
It also lets you do a showy public "HBD," in a way that wasn't really possible before.

So we need something that doesn't become meaningless by being slightly less personal, and allows us to do something that wasn't possible (or practical) before.
Something like a high-five.

## High Five

And so the the `highfive` plugin came to pass.

![](/images/chatops/!highfive.gif)

Several things are happening here that may not be totally clear if you've never used Slack or Hubot before:

1. David executes a command. We have our robot configured to listen for things starting with a "!".
1. Gort pastes in the URL of a GIF, which Slack loads and plays for everyone.
1. Gort includes `@channel` in the text of the post, which sends a notification to everyone in the room. Their computers and phones make a noise, drawing everyone's attention to this moment.
1. **A $25 Amazon gift card is sent to Kimberly at the company's expense.**

The first three things in that list are similar to a real-life high-five.
That last one, though – that would be pretty tricky to pull off without the magic of technology.
Making this a Gort plugin means that anyone can send anyone a "thanks!" with a monetary gift attached, in a very public way.

You're probably thinking this must be limited in some way, and you'd be right, but there are surprisingly few; the visibility of this action lends it a certain *gravitas*, and nobody seems to want to mess with that.

## What Happened Next

(TODO)

This has already yielded some interesting results, and we're only in our first month with it.
We're looking forward to seeing how it plays out over a longer period of time, and whether other teams think it's useful enough to steal.

## Epilogue: How It Works

We've released the `hubot-tangocard-highfive` plugin into the wild, and it's [completely open-source](highfive).
Basically it just ties together a few APIs (a few Slack tricks, the [Tango Card API](tango) for the gift cards, and a Google spreadsheet for logging transactions) behind a pretty simplistic UI.

Much of this is made pretty easy by the thriving ecosystem around [Node](node) and [Hubot](hubot), so it's only fitting that we make this available for anyone to use.
If you end up using it at your company, [let me know](https://twitter.com/benstraub)!

[gridium]: http://www.gridium.com/
[chatops]: http://venturebeat.com/2014/12/16/everything-you-wanted-to-know-about-chatops-but-were-afraid-to-ask/
[semaphore]: https://semaphoreapp.com/
[highfive]: https://github.com/ben/hubot-tangocard-highfive
[tango]: https://www.tangocard.com/giftcardapi
[node]: http://nodejs.org/
[hubot]: https://hubot.github.com/
