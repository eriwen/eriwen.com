---
date: '2009-06-25 03:00:28'
layout: post
comments: true
slug: introducing-groovyrtm
status: publish
title: 'Introducing GroovyRTM: A Groovier way to Remember The Milk'
wordpress_id: '866'
categories: groovy
---

<div class="alert alert-success">GroovyRTM is now featured on <a href="https://www.rememberthemilk.com/services/api/">Remember The Milk's API List</a>!</div>

I have always wanted to give something back to the wonderful creators of the [Remember The Milk](http://www.rememberthemilk.com) to-do list service. It has been a great tool for me the past couple years by helping me keep organized. Thank you, RTM crew!

Over the last couple months I've been taking a bit of spare time to write something that I hope all of us can benefit from: [GroovyRTM](https://github.com/eriwen/groovyrtm)

## What is GroovyRTM?

GroovyRTM allows you to easily take advantage of the [Remember The Milk REST API](http://www.rememberthemilk.com/services/api/) using any language on the JVM. In short, you can now write apps for Remember The Milk without having to worry about all the HTTP transaction stuff, error handling, etc. As its name implies, it's written in Groovy, which made it much easier to write and test.

<img title="Remember The Milk + Groovy = GroovyRTM" src="/images/groovyrtm.png" class="img-center"/>

## How can I use it?

To get started, you'll need 3 things:

  1. Download [groovyrtm-all.jar](https://github.com/eriwen/groovyrtm/releases) from the project on [GitHub](https://github.com)
  2. Request an [API key](http://www.rememberthemilk.com/services/api/keys.rtm) (you'll probably want an RTM account to test it with, too)
  3. Create a _RtmService.properties_ file as explained in the project [Wiki](https://github.com/eriwen/groovyrtm/wiki)

<div class="alert alert-success">I've created a quick-start project that has everything you need to get started quickly! I included an application authorization example because that's the first hurdle. <a href="https://github.com/eriwen/groovyrtm/releases">Download it here</a></div>

Just how easy is it? Suppose you want to write a little Java app that adds a new task:

{% highlight java %}
import org.eriwen.rtm.*;

class MyGroovyRtmTest {
    public static void main(String[] args) {
        GroovyRtm rtm = new GroovyRtm("api-key", "shared-secret");
        rtm.testEcho();
    }
}
{% endhighlight %}

It's that easy! Now, it's a little deceiving because the first time your app runs you have to allow it access via the RTM website. The best part is... it's open source! You can check out the source with Git:

<code>git clone git://github.com/eriwen/groovyrtm.git</code>
