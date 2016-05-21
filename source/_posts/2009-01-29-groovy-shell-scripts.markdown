---
date: '2009-01-29 09:07:14'
layout: post
comments: true
slug: groovy-shell-scripts
status: publish
title: Get groovy for better shell scripts
wordpress_id: '495'
categories: groovy
---

I often use shell scripts to automate mundane, repeatable tasks on my computer. Since I've found [Groovy](http://groovy.codehaus.org/), though, I have discovered a great way to **make writing those scripts easier and more enjoyable**. This is especially true if I have anything complex to do, and it saves me a LOT of time. Allow me to elaborate.

## Getting started with command-line Groovy

Like many of the tools I advocate here, you'll want to grab [Cygwin](http://cygwin.com) for the best experience. 

There are thorough instructions for [getting Groovy running](http://groovy.codehaus.org/Tutorial+1+-+Getting+started) within the Groovy documentation. Basically you just download a ZIP, extract it where you want, and add a couple environment variables. 

Can be installed easily on Linux or Mac:
{% highlight bash %}
brew install groovy          # Homebrew
sudo apt-get install groovy  # Debian-based
sudo yum install groovy      # RHEL and friends
{% endhighlight %}

Now you can start writing shell scripts in Groovy. Let's write a little script to test it out:

{% highlight bash %}
#!/usr/bin/env groovy
println "Yay! I can finally be expressive now!"
{% endhighlight %}

Actually, there are a ton of ways to run Groovy, but I'm just going to focus on scripts for now.

{% highlight bash %}
chmod +x hello.groovy
hello.groovy
{% endhighlight %}

## Bash vs. Groovy example

Let's say I want to have a script that can check my friends' last X tweets so I don't have to leave my command-line to check twitter. 

{% highlight bash %}
#!/bin/bash
username=xxxxxxxx
password=yyyyyyyyyy
numTweets=10

#output tweets XML
curl --basic --user $username:$password http://twitter.com/statuses/friends_timeline.xml?count=$numTweets
#Some crazy AWK goes here... your assignment ;)
{% endhighlight %}

I really don't want to read my tweets in XML. Being a Java guy, I wonder if there is a way we can harness it's power. **Groovy is basically enhanced Java** so I can 

{% highlight groovy %}
#!/usr/bin/env groovy

username = "xxxxxxxx"
password = "yyyyyyyyyyy"
numTweets = "10"

//If we have an argument use it
if (args && args[0].toFloat() > 0) numTweets = args[0]

//Use twitter API with cURL
output = "curl -u $username:$password http://twitter.com/statuses/friends_timeline.xml?count=$numTweets".execute().text

//Parsing XML is Amazingly easy in Groovy
tweets = new XmlSlurper().parseText(output)
tweets.status.each { tweet->
    println "${tweet.user.name}: ${tweet.text}"
}
{% endhighlight %}

And run it just like any shell script:

{% highlight bash %}
chmod +x checktweets.groovy
checktweets.groovy 15
{% endhighlight %}

Groovy can certainly do much more than deal with XML, it is a full-featured dynamic language with great expressiveness. It is simply satisfying to write, and you can do everything a shell script can do and more.

As an extra treat, here is a Groovy script to update your twitter status, tweet.groovy:
{% highlight groovy %}
#!/usr/bin/env groovy

username = "xxxxxxxx"
password = "yyyyyyyyyyy"

if (args) {
    status = args[0]
    println "curl -u $username:$password -d status=\"${status}\" http://twitter.com/statuses/update.xml".execute().text
}
{% endhighlight %}

I personally have a /scripts directory in my home dir which I put on my path, so to run the previous script I just have to type:
{% highlight bash %}
tweet.groovy "Twitter is now Groovy, baby!"
{% endhighlight %}

## Conclusion

Ok, so if you're fairly savvy with your old-school shell scripting, I don't expect you to switch to Groovy for simple tasks. I see 2 major cases for using it:

  * You need to do complex operations on data
  * You know Java better than your shell scripting

If you like Groovy and want to learn more, you might consider checking out the [Groovy docs](http://groovy.codehaus.org/Documentation).
