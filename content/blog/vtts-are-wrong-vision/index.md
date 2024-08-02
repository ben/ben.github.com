---
title: "VTTs Are Wrong: Part 1 (Vision)"
date: 2024-08-02T17:54:01.344Z
images: ["inthedark-player.jpg"]
summary: "Vision systems in VTTs are wrong, here's why I think so."
---

I think the current crop of VTTs are using the wrong nouns.

You know what I like about prepping for my game night?
Designing cool set-piece battles.
The flow of ideas for advancing character arcs.
Finding inspiration in a beautiful map.
Writing the intro voiceover text.
Looking forward to inviting my friends into this world I've been building.

You know what I don't like?
Knowing the exact features of my VTT that are going to hinder my group's fun, and not having a good workaround for them.
It's not even that VTTs are designed badly, or that they don't get the job done – my regular group wouldn't even exist without Roll20 and Foundry, and I'm so grateful that we're still enjoying our game after almost five years using these tools.
They're well-designed **for what they are.**
But there are aspects of these tools that feel like they're always getting in the way, and we're constantly either avoiding them or fixing them.

Let's talk about the one that bugs me the most.

## Vision Systems Are Wrong

The biggest beef I have with VTTs is that **they treat "character perception" and "player knowledge" as if they should be the same.**
A VTT with vision turned on won't let you see the orc you know is right around the corner.
It can't show you a sketch of the rooms you know of but haven't seen yet without revealing everything about them.
And a VTT with vision turned *off* can't help you with the vision-based rules of your game.

Let me show you what I mean.
Let's say my GM has loaded up [this fantastic map](https://www.czepeku.com/necropolis-dungeon/level-3-abandoned-tomb).
She has paid good money for it, because it comes with lights and walls included – a professional made this, so it's configured in the best possible way.
I'll take my human fighter (you probably know where this is going at this point) and walk into the dungeon, and here's what I see:

{{< figure src="./inthedark-player.jpg" title="What's even going on here?" >}}

Ugh.

Before I come back to everything that's wrong here, let's take a look at what the GM has set up for our poor human fighter:

{{< figure src="./inthedark-gm.jpg" title="A troll AND a dragon AND a giant?!?!" >}}

Go back to the player view, and imagine that the GM is describing this scene to you using their human mouth.

> […]
> the stench of the troll just in front of you, its fingernails dripping with slime and scraping your shield
> […]
> the deep burning embers glowing in the throat of the dragon in the center of the room, the deep rumble of its breathing resonating in your chest
> […]
> the giant – head wreathed in bright flame – singing the song that will end the world from around the corner
> […]

Here are just a few things that you-the-player might want to do in this moment, but are actively prevented from doing because of this decision:

- Have your darkvision-having friends pull you around with a rope (they can't move your token)
- Move your PC at half speed to simulate bumbling towards where your friends are (you can't see where they are, and you'll walk to a place _inside the troll_)
- Target the troll for an attack at disadvantage (can't target the token)
- Perceive the dragon because it's blocking the light from the torch across the room (light doesn't work that way in this game, and it's in the darkness)
- See what's happening with your friends, unless one of them happens to step into the light

Your ability to play the game has been artificially limited, and you need help to do the simplest of things.
**You** can't know any of that, because your **character** can't see it.

Foundry in particular can do _just a little_ better if we resign ourselves to combinations of scattered settings.
Give every token a "see all" sense, but that reveals monsters in rooms they haven't visited yet, so install the [Simple Fog](https://foundryvtt.com/packages/simplefog) module and manually erase the fog as they explore.
You're still missing so much information, and the GM is still going to be walking your token around for you.

{{< figure src="./inthedark-seeall.jpg" title="About as good as it gets" >}}

_(
	Yes, I know you can set Foundry up so that all the players get a unified view of what everyone can see.
	That only helps you if the GM has it set up that way, and every player remembers to deselect their token to look around, and it still breaks down to this when the human fighter picks their token to move it around.
)_

You're prevented in a lot of ways from playing the game.
And why?
Because baked into the concept of the VTT is the idea that the **player** should be allowed to see only what the **character** can see.
Foundry's not the only VTT to do this.
Roll20, Talespire, DMHub – every VTT that has a lighting and vision system does it this way.
I think it's ugly and unusable.

## What It Should Do

Here's a list of the kinds of things I want from my VTT's vision system.
I don't think any of these are unreasonable.

1. Provide visuals and controls to the player so that they can play the game and interact with the fictional world.
2. Provide information about character vision, according to the model the game provides.
3. Do not require modules or complex configuration to accomplish this.

With the current crop of VTTs, when the scene is dark (and if you're playing a game with the word "dungeon" in the name, at some point it will be), #1 just gets thrown out the window.
If you don't care about #3, and you're using a VTT that allows it, you can combine complicated extensions and settings to get some (but not all) of #1, but it's not default or obvious, and it's going to slow down exploration while the GM manages player vision.
And even after all of that, you still need the GM to walk your token around a darkened scene.

So what happens if you just lose the lighting system?

## What If… No Lighting?

Owlbear Rodeo doesn't have lights or shadows, so we're going to lose item #2, but it does give us the other two with its fog-of-war system:

{{< figure src="./necropolis-owlbear.jpg" title="Owlbear Rodeo: pretty good actually" >}}

Now Owlbear doesn't have character sheets or lighting effects like fancier VTTs, but this is elegant and simple and well-made and useful.

You can get kinda-sorta close to this in Foundry:

1. Disable vision
2. Delete all the walls
3. Use the [Simple Fog](https://foundryvtt.com/packages/simplefog) extension

…but it's not as good.
In Owlbear you can define fog regions in advance, and to make a whole room visible you hit `F`, click a fog region, hit `H`, and finally hit `W` to get back to the mode you were in before.
It's fast and smooth.

In Foundry, you have to click on the sidebar once or twice, drag a slider (why?) all the way to one side, *carefully* scribble over an area and hope you don't reveal too much (awkward), then click on the sidebar again to get back to the other mode.
It takes ten times as long, and brings you and probably the whole table out of flow.

And (depending on if you get annoyed by things like this the way I do) it might still be worth it.
What does it say that the game might be more fun _without_ a major VTT subsystem than with it?

## Vision Is Broken

Y'all, I'm tired.
Here's the choice I have to make every single time I set up a new scene:

1. Spend a bunch of effort lighting and walling the scenes, and accept that parts of the game that players _should_ be able to interact with will be unavailable to them, OR
2. Shut off a major function of the VTT, and either toss out a section of the game's rules or awkwardly draw shapes to indicate regions of light and darkness.

Most of the time I choose #2, and there's no way to set the defaults this way, so every time I import a Czepeku scene I have to delete all the walls and uncheck the vision boxes in the configuration.

I honestly don't know what to do about this.
I tried six different ways of doing this in Foundry (and wrote them down in a draft of this post and then deleted them so you don't have to slog through all that, *you're welcome*), and every single one has problems that make it compare unfavorably to a physical table with whiteboard tiles and bottle caps.
I'd love for the VTT experience to be _better_ than that, but right now it's just not.

Alright, that's enough for now.
I have more to rant about, don't you worry about that.
Stay tuned for more parts in this series.
