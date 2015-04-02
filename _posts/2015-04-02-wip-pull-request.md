---
layout: post-no-feature
title: "The WIP Pull Request"
comments: true
---

So you're working on a project on GitHub, and your team is using pull requests.
This means you're getting a notification (probably an email) every time someone leaves a comment on one of these PRs.
This is great, and it works really well.

But.

What if your team is opening a _lot_ of PRs?
Well, then you're getting a _lot_ of email, perhaps a dozen new threads in your inbox each day.
If you're using GMail, this is somewhat tractable because of the mute feature – if you see a PR that doesn't concern you, you can type `m` and it goes away.

But.

What if your team is using the [early-pull strategy][early]?
You're opening PRs when you *start* work, not when you're finished.
This has a variety of advantages, but now you get a lot of email **and** you don't want to mute it, because then you're cut out of the entire conversation.
So you have to open every email, looking for someone to say "okay, you can review this now."

Well, I've got a trick for you.
I don't know if they invented it, but I first ran across this while working with the [GitHub for Windows][ghfw] team, and it worked _very_ well for them.
I call it the **WIP Pattern**, and here's how it works.

### Open a PR ###

You do a tiny bit of work, and open a PR so (a) everyone knows what you're doing all day, and (b) people who care about this a lot can tell you what you're doing wrong.
This follows the usual early-PR pattern, except for one detail: you add "[WIP]" to the title.
Here, I'll make this more concrete for you: you've just opened a PR called **"[WIP] Froob the nobbits"**.
Everyone on your team gets an email, because a new PR was created, but they don't all care to the same degree.

Ray, who cares very much about the way nobbits are froobed, *definitely* wants to be involved in this project, and will watch with bated breath for your every commit.

Kimberly, on the other hand, knows she doesn't care about nobbits, and mutes the email thread without even opening it.

Nick, on the third hand, is somewhere in the middle.
He cares about nobbits, but wants to review the code when it's more baked – he trusts you and Ray to make the right early decisions.
He also mutes the thread.
I'll explain why in a minute.

### Early Feedback ###

Ray's watching the commits come in, and he reviews every change you make.
You address his feedback and keep picking off the [checklist][checklist] items.
Somewhere along the line, you realize your code will affect frambles, which Kimberly cares about very much, so you [mention][mention] her.

At this point I'd like to personally thank whoever designed GitHub's email-notification system, because it does a very smart thing when someone is mentioned: it adds that person to the CC field.
This bypasses GMail's muting logic, so the thread again shows up in Kimberly's inbox, and she tells you how to properly deal with the frambles.

Now the PR is in a state where you'd be happy to merge it.
The nobbits will be froobed, and the frambles are safe.
You're ready for a full code review, so you do something a little tricky: you change the PR title to remove the "[WIP]" tag (so the title is just **"Froob the nobbits"**), and leave a comment that says `This is ready for review`.

### Late Feedback ###

Changing the title means the subject line of the resulting emails has changed, and leaving a comment triggers a notification.
GMail doesn't see this message as connected with the older ones, because it has a different subject.
So now everyone (whether they had muted the thread or not) gets that comment in their inbox, which gives them another chance to enter the conversation.

Nick now knows that this is the part he cares about.
He reviews the code, makes a couple of style notes, and gives his `:+1:`.
Ray's been involved the whole time, so you know he approves.
And Kimberly had a say in the part that she cared about.
Everyone's happy, so you click the green button and [ship the change to production][cd].

## This One Weird Trick ##

By default, GitHub pull requests have a single event when people can decide they want to be part of the conversation around a change: the opening of the PR, which in the early-PR pattern signals *I'm starting something.*
This is their one chance to decide whether they care enough to put up with all the comment traffic, or if they want to mute it and focus on other things.

This technique adds another opt-in hook – the *I'm mostly done* signal – which gives you a bit more flexibility with your attention.
Now you can be *kind of* interested in a PR, instead of deciding between *very interested* and *not at all interested.*

It's not very likely that you'll need this.
None of the projects I'm currently working on do.
But if you get to the team size and activity level where you're drowning in notification emails, struggling to keep up with them, this is an elegant way to manage attention.

[ghfw]: https://windows.github.com/
[early]: https://github.com/blog/1124-how-we-use-pull-requests-to-build-github
[checklist]: https://help.github.com/articles/writing-on-github/#task-lists
[mention]: https://guides.github.com/features/issues/#notifications
[cd]: http://blogs.atlassian.com/2014/04/practical-continuous-deployment/
