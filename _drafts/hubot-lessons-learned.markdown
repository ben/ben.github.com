---
layout: post
title: "Lessons Learned From Writing Hubot Plugins"
image:
  feature: robot.jpg
comments: true
---

Now that I've written a few Hubot plugins, I feel like it's time for me to pontificate on the best way to do things.
I have literally *weeks* of experience doing this, which pretty much qualifies me to teach others at a university level.

Seriously, though, Hubot plugins aren't exactly hard things to write, but there are some things you have to learn the hard way unless someone tells you.
I've discovered a few techniques that seem to fit in the category of "best practices," and I wanted to write them down somewhere.

### Prototype in `scripts`

The hands-down easiest way to try out a new idea is to drop a Coffeescript file in your Hubot's `/scripts` directory.
Start with this:

~~~ coffee
module.exports = (robot) ->
    robot.respond /foo bar (.*)/, (msg) ->
~~~

Or, if you prefer Javascript, use this:

~~~ js
module.exports = (robot) => {
    robot.respond(/foo bar (.*)/, (msg) => {
    });
}
~~~

Yup, Hubot runs under newer Nodes, so you can use fat arrows.

And then add all the stuff you want to do.
Run `./bin/hubot -l !`, and you have a pretend chat room right in your shell, where you can try out your new command by typing `!foo bar baz`.

### Use the Logger

Your first attempts at debugging will probably involve sprinkling `console.log` liberally around the problem spots of your code.
Eventually you'll want to graduate to using the logger, though; it's more flexible.
Make sure you set `HUBOT_LOG_LEVEL=debug` when you run, then do this when you want some console output:

~~~ coffee
robot.logger.debug "My #{message}"
~~~

You can use other levels too, like `error` and `info`, and anything else that [the log package supports](https://www.npmjs.com/package/log#log-levels).

### Use the Debugger

Since Hubot runs on Node, you can use the rich set of V8 debugging tools.
In one terminal window, run [Node Inspector](https://github.com/node-inspector/node-inspector):

~~~shell
npm install -g node-inspector
node-inspector --no-preload --web-port 8123
~~~

Now add a `debugger` statement in your code, and in a second terminal, run Hubot like this:

~~~shell
coffee --nodejs --debug node_modules/.bin/hubot
~~~

Now if you visit http://127.0.0.1:8123/debug?port=5858 in a Chrome tab, you'll get the full Chrome Developer Tools debugger to use with your script.
**WAY** better than `console.log`ing yourself into the padded room.


### Write Tests

It's a little outdated now, but Atsushi Nagase write a [great post](http://ngs.io/2014/06/13/tdd-hubot-scripts/) about writing tests for Hubot plugins, and the pattern still holds.
Here's what you do:

* Pull in [Chai](http://chaijs.com/) and [Nock](https://github.com/pgte/nock) to help write your tests
* Set up your `package.json` so that `npm test` runs your tests:

~~~ json
"scripts": {
    "test": "mocha --compilers coffee:coffee-script/register test/*"
}
~~~

* Use the [Hubot mock adapter](https://github.com/blalor/hubot-mock-adapter) to make your plugin think it's being called into by hubot.
  This is actually fairly complicated; Hubot wasn't really designed for this.
  Read the docs, they'll help you.

If all else fails, [cargo-cult a plugin with tests](https://github.com/ben/hubot-tangocard-highfive/blob/master/test/command_spec.coffee).

### Write More Plugins

Seriously, this is the only way to get better at anything in programming.
Just make lots of them.
Automate something.
Now automate something else.
Teach Hubot how to order a beer, or locate your coworkers.
Write something that will make your team happier.
