---
date: '2009-09-22 04:00:23'
layout: post
comments: true
slug: site-monitor
status: publish
title: Site monitoring with Python and cron
wordpress_id: '914'
categories: python
---

I recently switched to hosting all of my own websites. While it is liberating to have much more control over my web host, it begs for more maintenance time and better tools to help you monitor your server.

While browsing my [GitHub account](https://github.com/eriwen) I came across [Mark Sanborn](http://www.marksanborn.net)'s [site monitoring script](//gist.github.com/177420) and thought: "Hey this is a good idea, let's see what I can make of it". I have been meaning to post more Python here so I updated his code a bit and thought I'd share it with you. I hope you have ideas for improvements.

<div class="alert alert-success">It looks like Mark has made this a full <a href="https://github.com/sanbornm/Site-Monitor">project on GitHub</a> and added timing the requests and command-line options! This is a perfect example of how OSS projects are started. Check out his <a href="http://www.nixtutor.com/linux/your-chance-to-contribute-to-an-open-source-project/">introductory post</a></div>

## Checking site availability with Python

I didn't feel that this script was big enough to go full OO with it, but if you want to add to it, fork the [gist on GitHub](//gist.github.com/187610) and provide a link in the comments. **You know what'd really be cool is if someone used timeit to get the response time and set thresholds for when the site is too slow.**

<script type="text/javascript" src="//gist.github.com/187610.js"> </script>

Basically, this script just checks if the internet is available, then checks each site. If the previous result is available and is different, it sends an email with the headers received so you might get a good idea what's going on. Even cooler, you can use the [email specific to your cell phone carrier](http://www.emailtextmessages.com/) to get text messages when your sites' availability changes.

**NOTE: You must have some sort of mailer daemon installed**. See [How to setup Gmail with sSMTP](http://www.nixtutor.com/linux/send-mail-with-gmail-and-ssmtp/). You can try it out by editing the appropriate parts of the script and then doing:

{% highlight bash %}
chmod +x checksites.py
./checksites.py eriwen.com yoursite.com
{% endhighlight %}

## Scheduling it up with cron

I've already showed you the [ins and outs of basic cron scheduling](/productivity/crontab-for-automation/). We can have this run every 5 minutes by typing `crontab -e` and then adding:

<code>*/5 * * * * ./path/to/checksites.py yourwebsite.com othersite.org</code>

What do you think? Tell me how you'd make it more "pythonic" or otherwise improve it in the comments.
