---
layout: post-no-feature
title: "High Five"
comments: true
---

A couple of weeks ago, my company began an experiment with HR and robots.

## ChatOps

Let me take a step back.
There's some background that will help you understand the point I'm about to make.

[Gridium](gridium) is a distributed company.
There is no central office, and even our founders live in two different cities.
We do gather everybody together four times a year, but apart from that there isn't much face-to-face.
So we spend most of our time in [Slack](slack), and we are students in the art of [ChatOps](chatops).

Mostly what that means is that we have a [Hubot](https://hubot.github.com/) (named Gort) whose most important task is to paste links to pug images into our chat room.
But we've also connected it to [Trello](trello), so we get notifications when something interesting happens:

![](/images/chatops/!trello.png)

…and to [Semaphore](semaphore), so we can trigger deployments:

![](/images/chatops/!deploy.png)

…and to a goodly number of other services, too.
We've turned our chat room from a water-cooler and announcement channel into the place everybody goes to do their work.
And not just engineers, either; the sales team use Slack to track the provisioning of new customers, too.

The purest essence of ChatOps is the automation of repetitive social activity.
You can probably tell by how abstract that sentence is that I've thought about this a lot, so let's look at an example: here's what the chat room looked like during a deployment before Gort:

```
A: I'm doing a deployment, hang on to your butts.
B: Okay
C: Got it.
...(5 minutes pass)...
A: Okay, it's done. Is the website broken?
C: Nope, looks okay to me.
A: Great. Carry on, everybody.
```

There's an implied contract here.
As the one doing the deployment, you've agreed to tell your teammates what you're doing and when it's done, and not to do something that gets in the way or destroys sensitive data.
The rest of the team has implicitly agreed not to interfere with a deployment they know is happening, and that they'll help out if something goes wrong.
This arrangement has been pretty effective for most of the history of Internet services.

But ChatOps shows us that this can be improved in a lot of ways.
Firstly, we've made it easier to deploy from the chat room than manually, but more importantly, *you'll never forget to tell the team when you're deploying.*
Or when you're done.
Or if something goes wrong.
And if something does go wrong, you don't have to stop fixing it to let the rest of your team know.

## An Experiment

Automating a thing sends several signals.
Firstly, the fact that you've automated it says that you were doing it often enough that it was worth some effort to streamline and error-proof the process.
Almost as importantly, you're saying that *this is a thing we don't want to spend time or thought on.*
That last one is important to keep in mind when you're not automating a technical process, but a human one.

Facebook's birthday reminders are a perfect example of this.
Getting a handmade card in the *actual mail* is really touching and human – a real human being cared enough about you to think about what you like, make a token of their esteem, and spend real money to send it to you.
In contrast, an "HBD" posted to your Facebook profile is nearly meaningless; you pretty much only pay attention to how many of them you get.

So automating social things is tricky, but we didn't think it was impossible.
Should ChatOps be limited to engineering work, like deploying and running tests?
Is there something on the softer side of the business that this could be effective with?
What's something we want to do more, but don't want to spend a ton of thought and time doing, and that wouldn't be reduced to meaninglessness through the act of automating it?

What about **a high-five?**

## High Five

So we wrote a Hubot plugin that automates the high-five:

![](/images/chatops/!highfive.gif)

If you've never used things like Slack or Hubot before, here's what's happening:

1. We've configured Gort to interpret things that start with "`!`" as a command, so David can trigger a high-five pretty easily.
1. Gort pastes in the URL of a GIF, which Slack loads and plays for everyone. This draws your attention visually.
1. Gort includes `@channel` in the text of the post, which sends a notification to everyone in the room. Their computers and phones make a noise, drawing everyone's attention audibly right now, and with a trailing notification if they missed it.
1. **A $25 Amazon gift card is sent to Kimberly at the company's expense.**

The first three things in that list are similar to a real-life high-five.
That last one, though – that would be pretty tricky to pull off without the magic of technology.
Anyone can send anyone a "thanks!" with a monetary gift attached, in a very public way, and with zero friction.

You're probably thinking this must be limited in some way, and you'd be right, but there are surprisingly few; the visibility of this action lends it a certain *gravitas*, and nobody seems to want to mess with that.

## What Happened Next

(TODO)

This has already yielded some interesting results, and we're only in our first month with it.
We're looking forward to seeing how it plays out over a longer period of time, and whether other teams think it's useful enough to steal.

## Appendix: How It Works

We've released the `hubot-tangocard-highfive` plugin into the wild, and it's [completely open-source](highfive).
Basically it just ties together a few APIs behind a pretty simplistic UI: [Slack](https://api.slack.com/), [Tango Card](tango) for the gift cards, and a [Google spreadsheet](https://github.com/jpillora/node-edit-google-spreadsheet) for logging transactions.

Much of this is made pretty easy by the thriving ecosystem around [Node](node) and [Hubot](hubot), so it's only fitting that we make this available for anyone to use.
If you end up using it at your company (or need help getting started), [I'd love to hear about it](https://twitter.com/benstraub)!

[gridium]: http://www.gridium.com/
[chatops]: http://venturebeat.com/2014/12/16/everything-you-wanted-to-know-about-chatops-but-were-afraid-to-ask/
[semaphore]: https://semaphoreapp.com/
[highfive]: https://github.com/ben/hubot-tangocard-highfive
[tango]: https://www.tangocard.com/giftcardapi
[node]: http://nodejs.org/
[hubot]: https://hubot.github.com/
