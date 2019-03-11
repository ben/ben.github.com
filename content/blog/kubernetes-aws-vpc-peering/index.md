---
title: "Kubernetes and AWS VPC Peering"
date: "2015-08-19T12:00:00.000Z"
---

**tl;dr:** Kubernetes + EC2 + VPC peering = trouble.
Scroll to [the bottom](#the-solution-band-aid) for my findings if you've had problems with this.

We're making a bet with our next generation of services at [Gridium](http://www.gridium.com/).
Our bet is that microservices will serve us better than monolithic services, and we're in the process of moving our existing services to this kind of architecture too.
Our chosen backing technologies are [Docker][docker], hosted in AWS, using [Kubernetes][k8s].

[docker]: https://www.docker.com/
[k8s]: http://kubernetes.io/

These technologies are still pretty young, and there are minefields awaiting those who try anything but the happiest of paths.
Here I'll document a huge problem we ran into, in hopes that I can help someone else that runs into it.

## Rainbows and Unicorns

Let me start by saying that Kubernetes is pretty cool.
There are a lot of reasons why we chose it for hosting our Docker services.
One of the best parts for us was the [rolling update](https://github.com/kubernetes/kubernetes/blob/master/docs/design/simple-rolling-update.md) functionality that comes in the box, enabled by how services and replication controllers use the metadata system.
Basically, you get something kind of like [blue-green deployments](http://martinfowler.com/bliki/BlueGreenDeployment.html) for free, and none of your services ever have to have any downtime because you deployed a change.

Another nice part is the `kube-up` script, which with just a few small configuration knobs, can spin up a Kubernetes cluster in a variety of environments in about 10 minutes.
Since the rest of our infrastructure is already in Amazon AWS, it seems natural to spin up our new cluster there.

So I did, and at first everything was rosy.
The first little surprise: the Kubernetes script created a new VPC for the cluster to run in.
A VPC is essentially an entirely separate, self-contained network, where all the machines inside can route to each other, and to the open Internet, but not to any other VPC.
That sounds like a good thing, and it generally is – Kubernetes and Docker can do whatever crazy networking voodoo they want to, and it won't mess with our already-running-and-with-customers services (which are in a pre-existing VPC).

But there's a problem.
We're using [RDS](https://aws.amazon.com/rds/) to host our data, because who runs their own database server in 2015?
The problem is that our RDS instance belongs to our main VPC, so it won't be visible from the new Kubernetes VPC.

Time for some [peering](http://docs.aws.amazon.com/AmazonVPC/latest/UserGuide/vpc-peering.html).
Peering lets you set up routing so that a certain range of IP addresses will route into another VPC.
This sounds like exactly what we want.
Our Kubernetes VPC's IP address range is 172.20.\*.\*, and the original VPC's address range is 10.0.\*.\*.
So I set up the peering connection, and altered the route tables on either side, so that if a machine in VPC1 is looking for a machine in VPC2, it will route through the peering connection.
I also made sure to change the RDS instance's [security group](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-network-security.html) to allow connections from 172.20.\*.\*.

Now I can SSH into one of my Kubernetes minions, and `psql -h <RDS host>` asks me for a password.
Perfect, so our network configuration is done, and we can start shipping containerized applications, right?

**Not so fast.**
If I try that same command from inside a container, I get a timeout.
Wait, I can connect to machine from a host, but try it from within a Docker container on that same host, it fails?

## Stumped

Here's where I got roadblocked for two weeks.

I knew that Kubernetes gives each running container its own IP address, so I added those ranges to the security group, and even configured the security group to allow connections from **any** IP address.
I checked, double-checked, and triple-checked all the routing tables.
I tried everything I could think of, which admittedly isn't much – I'm pretty green when it comes to networking.
No dice.
Nothing worked.

Then I started asking friends and family, and people I didn't even know who had expertise in Docker and Kubernetes.
[Jeff Nickoloff](https://twitter.com/allingeek) and I puzzled over this with some [coffee](https://workfrom.co/albina-press), and he was stumped too.
He suggested I get in touch with [Kelsey Hightower](https://twitter.com/kelseyhightower), since he's involved with a lot of the internals of the systems I'm working with, and he lives in Portland.

So I did, and Kelsey was a real mensch.
Even though he was in Japan at the time, and it was the middle of the night there, he spent 90 minutes on a hangout with me to figure out the problem.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr"><a href="https://twitter.com/benstraub?ref_src=twsrc%5Etfw">@benstraub</a> I&#39;m happy to jump on a quick hangout to help you troubleshoot. I&#39;ll have some free moments in about 20 mins. Does that work?</p>&mdash; Kelsey Hightower (@kelseyhightower) <a href="https://twitter.com/kelseyhightower/status/633679300147855361?ref_src=twsrc%5Etfw">August 18, 2015</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

## The Problem

The problem here is a difference in expectations as to what IP addresses are owned by whom.
Kelsey was explaining to me how Docker containers should be using masqueraded IP addresses for traffic outside the Docker daemon, when we ran this on one of the minions:

```text
$ iptables -v -L -n -t nat
[...]
Chain POSTROUTING (policy ACCEPT 78 packets, 4680 bytes)
 pkts bytes target     prot opt in     out     source         destination
87316 5451K MASQUERADE  all  --  *      eth0    0.0.0.0/0     !10.0.0.0/8
[...]
```

What that `MASQUERADE` line means is "if the destination address _isn't_ a 10.\*.\*.\* address (which Kubernetes reserves for itself), send it as though it were coming from the EC2 instance's IP address."
That's a great rule, and it allows containers to talk to the outside world, and the return traffic finds its way back to the EC2 instance, and then back to the container that initiated the connection.

**However.**
Recall from earlier that our pre-existing VPC's IP addresses are in the 10.0.\*.\* range, including the RDS instance we were trying to connect to.
This iptables rule is _turning off_ masquerading to those IP addresses, so the RDS instance was seeing packets that look like they come from a 10.something address.
Trying to respond to such a packet just doesn't work; the other VPC thinks 10.something addresses are _inside its own VPC_, but there's no machine at that address.

As a quick test, we punched a very small hole through this rule:

```
$ sudo iptables -t nat -I POSTROUTING -d 10.0.18.52/32 -o eth0 -j MASQUERADE
$ iptables -v -L -n -t nat
[...]
Chain POSTROUTING (policy ACCEPT 32 packets, 1920 bytes)
 pkts bytes target     prot opt in     out     source           destination
    2   120 MASQUERADE  all  --  *      eth0    0.0.0.0/0        10.0.18.52
87355 5454K MASQUERADE  all  --  *      eth0    0.0.0.0/0       !10.0.0.0/8
[...]
```

We inserted a rule at the top that says "if the destination is the RDS instance, make sure you masquerade as the host machine."
And it worked!
Now the Docker containers can connect to the database.
And I owe Kelsey a nice lunch.

## The ~~Solution~~ Band-Aid

It's possible this won't be a problem for you, unless you're using a peering connection to a VPC that uses those addresses, in which case it's going to be a _serious_ problem for you.

Unfortunately there isn't a full-on fix right now.
If you're going to peer to a VPC whose IP addresses start with 10, you're going to have to muck with your nodes manually, because that `10.0.0.0/8` rule is [hard coded](https://github.com/kubernetes/kubernetes/blob/7c9bbef96ed7f2a192a1318aa312919b861aee00/pkg/kubelet/container_bridge.go#L124).

So as of right now, the answer is to SSH into every one of your minions and do this:

```
$ sudo iptables -t nat -I POSTROUTING -d <RDS-IP-ADDRESS>/32 -o eth0 -j MASQUERADE
```

Good luck, and I hope you found this post if this problem affects you.

### UPDATE: A Note About DNS

Once we got this up and running, we noticed glitchy DNS response.
When one container was trying to find a separate service, it would only sometimes work.
I did a little digging, and here's what I found in the `/etc/resolv.conf` on both of my minions:

```
nameserver 10.0.0.10
nameserver 172.20.0.2
search default.svc.cluster.local svc.cluster.local cluster.local us-west-1.compute.internal
options ndots:5
```

That first line is key.
Since the foreign VPC was in the 10.0.0.\* space, I had set up AWS routing to send traffic to those IPs through the peering connection.
Kubernetes is expecting the SkyDNS service to respond at that address, but traffic was getting routed elsewhere.
When I corrected this issue, DNS started working as expected.

The bottom line here is that Kubernetes _really_ wants to have ownership of all IP addresses starting with 10.
If you try to put other machines into that range, you're going to have problems.
