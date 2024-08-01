---
title: "VTTs Are Wrong (notes for the future)"
date: 2024-07-31
draft: true
---

## Movement Systems Are Wrong

The same wall system used for vision is also used to constrain movement.
Now that can be a good thing, if you've got a player who's constantly moving around into places that don't make sense, "woooo I'm swimming in the river of lava!"
But if you trust your players, and we all know what we're doing, it can just get in the way.
Maybe that character actually _did_ get thrown into the river of lava, but they can't move themselves over the edge of the bridge.

{{< figure src="./walls-and-movement.jpg" title="Who's asking for this?" >}}

It seems like this whole setup is simultaneously trusting players too much and too little.
You shouldn't be able to open the locked door, but you should be able to WASD to a place three screens away from your party and get ambushed.
You shouldn't be able to see around the corner

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

