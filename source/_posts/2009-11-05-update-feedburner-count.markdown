---
date: '2009-11-05 04:00:11'
layout: post
comments: true
slug: update-feedburner-count
status: publish
title: Using Python to update your FeedBurner stats
wordpress_id: '986'
categories: python
---

<img src="/images/html.jpg" alt="" class="img-left" />Ever since I've moved to my own server for my websites, I've wanted to reduce the number of HTTP requests per user as much as possible. Here is how I (and you) can use Python to **shave 1 more request off that number.**

I can do this (and remove a DNS lookup) by updating my [Feedburner](http://feedburner.google.com) count using an automated **script on my server instead of having each client request it.**

## Using the FeedBurner Awareness API

Most of the time you only care about getting your total subscribers at the moment. The [FeedBurner Awareness API](http://code.google.com/apis/feedburner/awareness_api.html) is far more capable than just doing that, but we're going to keep it simple today.

For the simple case you just need your feed ID or URI. Try:
{% highlight bash %}
curl -s 'https://feedburner.google.com/api/awareness/1.0/GetFeedData?uri=YOUR_FEED_NAME'
{% endhighlight %}

You receive an XML response like:
{% highlight xml %}
<?xml version="1.0" encoding="UTF-8"?>
<rsp stat="ok">
  <!--This information is part of the FeedBurner Awareness API.
      If you want to hide this information, you may do so via your FeedBurner Account.-->
  <feed id="foo0nbta7tscktjrgddc95gg3s" uri="EricWendelin">
    <entry date="2009-11-03" circulation="1481" hits="3901" reach="21" />
  </feed>
</rsp>
{% endhighlight %}

Now we just need to parse out the "circulation" which is your subscriber count.

## Quick and dirty bash script

This is what I used to use until FeedBurner started returning 0s or blanks in the XML returned:

{% highlight bash %}
#!/bin/bash
FEED_COUNT=`curl -s https://feedburner.google.com/api/awareness/1.0/GetFeedData?uri=EricWendelin | egrep -o circulation=\&quot;[0-9]+\&quot; | egrep -o [0-9]+`

sed -r -i "s/(\"numsubscribers\">)[^<]+</\1$FEED_COUNT</g" /my/path/to/sidebar.php

echo $FEED_COUNT
{% endhighlight %}

You can [use cron](/productivity/crontab-for-automation/) to replace some HTML, log the count, etc. every so often.

## The Python

The Python version is much lengthier but has error checking and does not have to do file-replacement. The following is also [available on GitHub](http://gist.github.com/226407) for your extending pleasure ;).

<script src="//gist.github.com/226407.js"> </script>

Something like this would be especially cool if you could set thresholds or use [optparse](http://docs.python.org/library/optparse.html) for advanced options. Useful? Hope so!
