---
title: "VTTs Are Wrong: Part 1 (Vision)"
date: 2024-08-01
draft: true
tableOfContents: true
---

I think the current crop of VTTs are using the wrong nouns.

I've had this feeling for a while.
Every time I prep for a session, and I'm thinking about how my players will experience this cool set-piece I'm building, it feels like I'm building a video game – the scene reveal, the initial voiceover, handing control over to the players, the interactions they'll have with things in the fiction, the moment when it's time to roll initiative.
When things line up well, all of that stuff can be fun and exciting, and I love it.

But that's not all the time.
In a lot of ways it feels like my tools are working against me, and I felt the need to articulate them, so here we are.
I'm going to rant on this for probably too long, without proposing any real solutions.

I spend most of my time in Foundry, so I'm going to pick on them a lot.
I'm fairly familiar with Owlbear Rodeo and Talespire, a tiny bit with Roll20, and very little with dndbeyond.
I've tried Alchemy and Role, and I've seen fun videos about DMHub.
I feel like I have enough experience to form an opinion, but don't expect a scholarly study.

Also I know this is going to come off as negative, but this comes from a place of love.
Roll20 and Foundry have made it possible for me to keep a group running for four continuous years, we've had a lot of great moments with them.
I just think they're not perfect.

## Vision Systems Are Wrong

Here's a beef I have with VTTs: **they treat "character perception" and "player knowledge" as if they were the same.**
A VTT with vision turned on will not let you see the orc you KNOW is right around the corner, nor will it let you see the vague outline of the rooms you know of without revealing the full detail of the map background.

I'm going to outline every way I know of to do this in Foundry, and we'll come back to that general problem afterwards.
I'll use [this fantastic map](https://www.czepeku.com/necropolis-dungeon/level-3-abandoned-tomb) from one of my favorite creators as example, because I have it in a full Foundry package with lights and walls already included in the way Foundry wants you to have them.
Here's what it looks like for the GM, without lights or walls interfering, and showing the positions of all the baddies:

{{< figure src="./necropolis-gm-view.jpg" title="One fighter, six skeletons, no problem" >}}

Here's what it is I'm hoping Foundry will do for me:

1. Show and hide the relevant parts of the map to the **player** based on **player** knowledge of the situation
2. Allow the players to interact with things they _know to be there_ but that their character cannot see
3. Track regions of darkness, dimness, and full light, like D&D 5e requires
4. Be easy to configure, and not require some eldritch combination of settings from two modules and three dialogs

That all seems reasonable, but (spoiler) it's actually impossible to get all of them.
This isn't just a Foundry problem, but I'll focus on that to highlight how the abstractions we've grown are a bad fit for the problem.

## The Recommended Method

This is the method that's suggested by the names of these things: draw a "wall" where there would be a wall, and drop a "light" where there would be a light source.
Here's what that scene looks like for a player with default vision (no darkvision, no torch lit):

{{< figure src="./necropolis-player-nodv.jpg" title="Two out of six ain't bad" >}}

At a glance that seems dark, but maybe workable.
But it's actually broken in several significant ways, that impede the smooth flow of game time.

Foundry can do some cool stuff if you target a token when rolling an attack, like resolve if it's a hit, or apply the damage.
In D&D 5e, this fighter should be able to attack the skeleton in the center of the room at disadvantage.
But since we're conflating player and character vision, you **can't even target that token,** because you the player can't see it.
There's also a skeleton _standing right next to them_, one that normal human senses would tell you about, but the VTT completely blocks you from seeing or targeting or interacting with it in any way.
If other party members have dark vision, they're going to navigate down corridors that this player can't even see, and won't be able to follow wihout the GM dragging their token around.

Is this fun?
Maybe I'm too picky, but the shortcomings here grate.
I want my tools to make fun possible, not get between me and fun.

This is the default state, but maybe we can do better.

## The Global Illumination Method

One annoyance up front: Foundry's scene-configuration dialog has separate checkboxes for "vision" and "fog", but they're not really independent.
If you turn off vision, you can fiddle with the fog settings all you want but they won't do anything.
You can't have fog without vision.

So let's try the next simplest thing, and check the "global illumination" box, which removes 80% of the function of the lights in the scene.
The torches will still flicker prettily, but their areas won't be any brighter than the rest of the floor, because there's no option to make global illumination "dim" or "10%", it's just bright light.
Everywhere.

So here we go, let's check that box and see what it looks like.
Remember, this is effectively disabling lighting, but keeping the walls.

{{< figure src="./necropolis-player-gi.jpg" title="Better, still pretty ugly" >}}

Our player can now see things his character would be aware of even if they couldn't see them, which is nice, but other things the character *could* perceive are still hidden from the player.
We can't tell which parts of the scene are brightly lit, dimly lit, or in complete darkness, for example.
And if the GM says "okay the skeleton over by the cart" the player will have no idea what they're talking about, because the **player** has been prevented from seeing the cart.
Oh, and they can see a lot further than the GM might want them to, all the way to the edge of the map.

There's a variation on this, where you leave global illumination off, but add a vision range to every token, as though they were emitting light.
This fixes the "they can see too far" issue, but has all the other problems with this approach.
The main problem is line-of-sight, the distance is kind of minor in comparison.

## The Simple Fog Method

So there's a module called [Simple Fog](https://foundryvtt.com/packages/simplefog), which lets the GM manage the fog of war manually.
Maybe this can fix our issue?
So let's toggle on manual fog, and erase some fog:

{{< figure src="./necropolis-manualfog-gm.jpg" title="GM view: a hole in the fog" >}}
{{< figure src="./necropolis-manualfog-player.jpg" title="Player view: welp" >}}

It gives the GM more control over disclosure, but this is just a smaller version of the global-illumination method, with the same problems.
It's got some advantages though, we'll come back to those in a bit.

## The Tremorsense Method

In newer version of Foundry, you can turn on other "detection modes", which can give the player the locations of tokens in various ways.
Here's what it looks like when we turn on tremorsense:

{{< figure src="./necropolis-tremorsense.jpg" title="Not a bad try, but still not perfect" >}}

So this shows all the tokens and makes them targetable, but that does mean _all_ of them, including the ones in rooms they haven't visited yet.
There's another mode called "see all" which does the same but constrained to sight lines, which again means the player won't be able to do anything with the skeleton by the cart.

## The Triple Combo

Here's where I come back to the Manual Fog module: it draws a layer on top of all the other ones, so it can override the vision that tremorsense gives you.
At this point we're narrowing in on maybe a solution.
It's complicated, and still not perfect:

- Use walls and lights, **(but this still prevents you from showing players what you want them to see)**
- Give every token "sense all" to a certain distance **(but this will interfere with invisibility)**
- Use manual fog to make sure they don't see anything in the rooms they haven't visited yet **(but this is clunky and slow in the moment)**

{{< figure src="./necropolis-combo.jpg" title="About as good as it gets with vision turned on" >}}

All of that effort to just be able to target things in the dark.
And it's still ugly and imperfect, and you need at least one module to make it happen.

So what if we dropped vision entirely?

## The Owlbear Rodeo Method

Here's how Owlbear Rodeo does it.
There's a fog-of-war system that's exactly as complicated as it needs to be, and no more.
Here's the player view of that scene in Owlbear, after the GM has revealed everything they think is needed.

{{< figure src="./necropolis-owlbear.jpg" title="Owlbear Rodeo: pretty good actually" >}}

It's pretty great.
We still don't get the regions-of-dimness-and-darkness feature, and Owlbear doesn't have character sheets, but it's nice.

You can get close to this in Foundry, if you :one: disable vision, :two: delete all the walls, and :three: use the Manual Fog extension.
Except it's worse, because in Owlbear you can define regions in advance, and making a whole room visible is as easy as hitting `F`, clicking a box, hitting `H`, and finally hitting `W` to get back to the mode you were in before.
It's fast and smooth, where in Foundry, where you have to click on the sidebar once or twice, drag a slider (why?) carefully scribble over an area and hope you don't reveal too much, then click on the sidebar again.
It takes ten times as long, and brings the whole table out of flow, but you get to use the pretty lights and character sheets.

## Vision Is Broken

Y'all, I'm tired.
Here's the choice I have to make every single time I set up a new scene:

1. Spend a bunch of effort lighting and walling the scenes, and accept that parts of the game that players _should_ be able to interact with will be unavailable to them, OR
2. Shut off a major function of the VTT, probably toss out a section of your games' rules, and maybe draw shapes to indicate regions of light and darkness.

Most of the time I choose 2, and there's no way to set the defaults this way, so every time I import a new scene I have to delete all the walls and uncheck the vision boxes in the configuration, and I **still** think it's worth it because the experience will be better.
What does it tell you that _not_ having a vision system is more fun than having it?

I honestly don't know what to do about this.
Every single approach I described here (in probably too much detail) has problems that make it compare unfavorably to just being at a physical table with whiteboard tiles and bottle caps.
I'd love for the VTT experience to be _better_ than that, but right now it's just not.

That's enough for now though.
I have more to rant about, don't you worry about that.
Stay tuned for more parts in this series.
