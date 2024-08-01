---
title: "VTTs Are Wrong"
date: 2024-07-31
draft: true
---

I think the current crop of VTTs are using the wrong nouns.

I've had this feeling for a while.
Every time I prep for a session, and I'm thinking about how my players will experience this cool set-piece I'm building, it feels like I'm building a video game.
The scene reveal, the initial voiceover, giving control over to the players, the interactions they'll have with things in the fiction, the moment when it's time to roll initiative.
When things line up well, all of that stuff can be fun and exciting, and I love it… but that's not all the time.
In a lot of ways it feels like my tools are working against me, and I felt the need to articulate them, so here we are.

To set your expectations, I spend most of my time in Foundry, I'm fairly familiar with Owlbear Rodeo and Talespire, a tiny bit with Roll20, and very little with dndbeyond.
I've tried Alchemy and Role, and I've seen fun videos about DMHub.
I feel like I have enough experience to form an opinion, but don't expect a scholarly study.

## Vision Systems Are Wrong

VTTs treat "character perception" and "player knowledge" as if they were the same.
A VTT with vision turned on will not let you see the orc you KNOW is right around the corner, nor will it let you see the vague outline of the rooms you know of without revealing the full detail of the map background.

_(Note: I know this isn't 100% true. But it takes one or two Foundry modules and significant GM effort to get close to the experience you actually want here, which you'll find is a running theme. "Install a module and spend an extra 10 minutes prepping every session" isn't a good strategy if you have 10 problems like this.)_

An example: our group was playing Dragonbane, and we were infiltrating a mine.
Here's what the view looked like in Foundry.
Note that we did all the right things; we're all set as "observers" on everyone's actor, so we can all see what everyone sees, the lighting and walls are set up "properly," and the PCs who had torches lit had their tokens emitting light.
This is all according to emergent best practices.

{{< figure src="./dragonbane-1.jpg" title="What's even happening here?" >}}

Contrast that with what all of us knew to be true, which is that there were 8 more dead baddies and at least 5 more live ones in that cave system.
We all knew this because one of us had been in that central chamber, and we had dropped quite a few of them.

{{< figure src="./dragonbane-2.jpg" title="The truth of the matter" >}}

It's awful.
The system makes the wrong decisions about which tokens the players should be able to see (and the default setup would be even worse).
It makes it really hard to see even the explored parts of the fog of war.
And it's just plain ugly - [great dungeon cartography](https://dysonlogos.blog/maps/) includes hatching that shows the texture and material of the walls, and this vision system covers all of that with impenetrable blackness.

At a real table, it works more like the GM view, and you're able to make decisions based on your **own** judgement of what your character would see.
But you can't get that without opting out of the vision system entirely (which I usually do).
The GM would draw in or uncover the rooms as you came into them, which you can *only* get in a VTT by turning the vision system on.
Why do we have this highly-engineered system, with tons of math and effort behind it, which makes the game [require](https://foundryvtt.com/article/requirements/) a non-trivial GPU, and which actively makes the experience worse?
There are good ways to use this system, but the obvious way isn't it.

## Movement Systems Are Wrong

The same wall system used for vision is also used to constrain movement.
Now that can be a good thing, if you've got a player who's constantly moving around into places that don't make sense, "woooo I'm swimming in the river of lava!"
But if you trust your players, and we all know what we're doing, it can just get in the way.

{{< figure src="./walls-and-movement.jpg" title="Who's asking for this?" >}}

Maybe this is just me and my situation, but I tend to trust my fellow players to not fun-ruin the night for everyone else.

Every day on Reddit there's a post about someone's eye-candied landing page, or their active-tiles setup that lets them automate traps.
I can't help but imagine how that plays out at the table.

- **GM:** You enter the sanctum of the temple, dust gently drifting down from the ceiling, torches guttering, and—
- **Player:** Doot dee doo (moves token to the altar)
- **GM:** …and the… the quiet sound of distant chanting—
- **Player:** (steps on trap tile, an animation plays, a sound effect happens, they take 3d6 damage and die) Hey wait!
- **GM:** …uh well I guess you stepped on a trap—
- **Player:** You didn't say there might be traps!
- **GM:** You didn't let me finish! As I was saying, the sounds of distant chanting *and the steady drip-drop of water-powered machinery*, you've seen this kind of mechanism before.

I know this is a strawman, but how is this supposed to work?
Do people really let their players move their tokens like in a video game?
There's only one GM with only one storytelling voice, why do we build systems like a first-person shooter, where every player can go closer to a thing and get more information independently?

How do players stay coordinated moving down a narrow corridor?
Five players can't possibly move in tandem, which means every time something meaningful gets discovered, there's a "okay move your tokens to where you would be" moment, which makes me wonder why we're all doing this in the first place.

When you're playing in person, you'd say "okay we advance to the next door, here's our marching order."
And you can do that in a VTT, but there's always an awkward ten seconds where the GM is stacking the PC tokens up near the door, but you had to turn a corner so you can't drag them all at once, and also one of the players is trying to help, and *UGGGHHHH*.

## Ownership Systems Are Wrong
The Pathfinder 2e system for Foundry has working backpacks.
You can take an apple in your inventory, and stick it into your backpack.
This is a feature that the D&D 5e Foundry system does *not* have, which is a clue to what my gripe is here.

The reason is Foundry's ownership system.
Actors can own items.
Actors cannot own other actors, and items cannot own other items.
Actors can appear on the map, but items cannot.

Pathfinder accomplishes this trick of "an item that owns other items" by adding a flag to all the items it contains – the backpack doesn't "own" the apple, the apple just has a sticky note on it that says "I'm in the backpack."
They had to invent this system on their own, which is why other systems (including the most popular one) don't have them.

This ownership system is broken in other ways too.
How do you let other players look at this sword you just picked up?
If you drag it onto their

## Scene Systems Are Wrong
Foundry's takes your whole CPU to draw 2D graphics that aren't that complicated
Verticality is really hard
Talespire is interesting, but it's so time intensive to build an interesting scene

