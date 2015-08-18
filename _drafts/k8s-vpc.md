---
layout: post
title: "Adventures with Kubernetes on AWS"
image:
  feature: "308357541_222d1b2e2a_b.jpg"
comments: true
---

*Header image [©Pascal Charest](https://flic.kr/p/tfpXk).*

**tl;dr:** Kubernetes + EC2 + VPC peering = trouble.
Scroll to the bottom for my findings if you've had problems with this.

We at [Gridium](http://www.gridium.com/) are making a bet.
We're in the process of migrating some of our monolithic services into microservices, and hosting them in [Docker][docker], using [Kubernetes][k8s].
These technologies are young, and there are minefields awaiting those who try anything but the happiest of paths.
Here I'll document a huge problem we ran into, in hopes that I can help someone else that might run into it.

## Rainbows and Unicorns

Since the rest of our infrastructure is already in Amazon AWS, it seems natural to spin up our new cluster there.

[docker]: https://www.docker.com/
[k8s]: http://kubernetes.io/

So I did, and I hit a few snags.
The first one was a small surprise: the Kubernetes cluster runs inside its own VPC.
This is essentially an entirely separate network from the rest of our machines, which are all contained in their own VPC.
But that's okay, and maybe it's even a good thing.
Kubernetes and Docker can do whatever crazy networking voodoo they want to, and it won't mess with our already-running-and-with-customers services.

But there's a problem.
We're using RDS to host our data, because who runs their own database server in 2015?
Alright, but our RDS instance belongs to the original VPC, so it won't be visible from the new Kubernetes VPC.

Time for some [peering](http://docs.aws.amazon.com/AmazonVPC/latest/UserGuide/vpc-peering.html).
Here's where this post gets pretty technical.
It's going to get a lot worse before it gets better.
In fact, it pretty much doesn't get any better.

Our Kubernetes VPC's IP address range is 172.20.\*.\*.
The production VPC's IP address range is 10.0.\*.\*.
These don't conflict, so we can peer them just fine.
So we set up the peering connection, and altered the route tables on either side; if you're looking for an IP in the range of the other VPC, try the peering connection.
Also make sure you've altered the [security group](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-network-security.html) to allow connections from 172.20.\*.\*.

Great, done.
Now I can SSH into one of my Kubernetes minions, and `psql -h <RDS host>` asks me for a password.
Ship it!

Not so fast.
If you try that same command from inside a container, you'll get a timeout.
Wait, you can connect to machine from a host, but try it from within a Docker container on that same host, it fails?

## Stumped

Here's where I got stumped for two weeks.
I tried everything.
I knew that Kubernetes gives each running container its own IP address, so I added those to the security group, and bust the security group wide open.
No dice.

I checked, double-checked, and triple-checked all the routing tables.
I tried everything I could think of, which admittedly isn't much – I'm pretty green when it comes to networking.
I asked friends and people I knew with expertise in Docker and Kubernetes.

Including [Jeff Nickoloff](https://twitter.com/allingeek).
We puzzled over this with some [coffee](https://workfrom.co/albina-press), and he was stumped too.
He suggested I get in contact with [Kelsey Hightower](https://twitter.com/kelseyhightower), since he's involved with a lot of the internals of the systems I'm working with, and he lives in Portland.
So I did, and Kelsey was a real mensch, and spent 90 minutes on a hangout with me in the middle of the Tokyo night to figure out the problem.

## The Problem

The problem here is a difference in expectations as to what IP addresses are owned by whom.
Kelsey was explaining to me how Docker containers should be using masqueraded IP addresses for traffic outside the Docker daemon, when we ran this on one of the minions:

```bash
$ iptables -v -L -n -t nat
# […]
Chain POSTROUTING (policy ACCEPT 78 packets, 4680 bytes)
 pkts bytes target     prot opt in     out     source         destination
87316 5451K MASQUERADE  all  --  *      eth0    0.0.0.0/0     !10.0.0.0/8
```

What this means is that there's an entry in the routing tables that says "if the destination address isn't a 10.\*.\*.\* address, send it as though it were coming from the EC2 instance's IP address, instead of the container's internal-only IP address."
Recall from earlier that our pre-existing VPC's IP addresses are in the 10.0.\*.\* range, and that includes the RDS instance we were trying to connect to.

So the kernel wasn't properly masquerading traffic from containers to actual external machines in the 10.0.\*.\* address space.
It's likely this won't be a problem for you, unless you're using a peering connection to a VPC that uses those addresses, in which case it's going to be a *serious* problem for you.

As a quick test, we punched a very small hole through this rule:

```bash
$ sudo iptables -t nat -I POSTROUTING -d REDACTED/32 -o eth0 -j MASQUERADE
$ iptables -v -L -n -t nat
# […]
Chain POSTROUTING (policy ACCEPT 32 packets, 1920 bytes)
 pkts bytes target     prot opt in     out     source           destination
    2   120 MASQUERADE  all  --  *      eth0    0.0.0.0/0        REDACTED
87355 5454K MASQUERADE  all  --  *      eth0    0.0.0.0/0       !10.0.0.0/8
```

At the top of the table, we added a rule that says "for this specific IP address, make sure you masquerade as the host machine."
And it worked!
Now the Docker containers can connect to the RDS instance.

## The <strike>Solution</strike> Band-Aid

Unfortunately there isn't a full-on fix right now.
If you're going to peer to a VPC whose IP addresses start with 10, you're going to have to much with your nodes manually, because that `10.0.0.0/8` rule is [hard coded](https://github.com/kubernetes/kubernetes/blob/7c9bbef96ed7f2a192a1318aa312919b861aee00/pkg/kubelet/container_bridge.go#L124).

So as of right now, the answer is to SSH into every one of your minions and do this:

```bash
$ sudo iptables -t nat -I POSTROUTING -d <RDS-IP-ADDRESS>/32 -o eth0 -j MASQUERADE
```

Good luck, and I hope you found this if you're having this problem.
