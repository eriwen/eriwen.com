---
date: '2009-02-12 06:30:29'
layout: post
comments: true
slug: crush-images-with-groovy
status: publish
title: Crush images on the command-line with Groovy
wordpress_id: '536'
categories: groovy
---

One of the ways to speed up your site and save bandwidth is to optimize your images. You can often halve an image's size without losing (much) quality. Many photo editors may give you this option, but it's a slow manual process. What we really need is a way to automate this so that every time we deploy changes we can optimize in one step.

## Getting Started

You'll need 2 tools (and [Cygwin](http://cygwin.com) if you're on Windows) to pull this off:

  * [Download](http://groovy.codehaus.org/Download) and [setup](http://groovy.codehaus.org/Tutorial+1+-+Getting+started) Groovy
  * [Grab ImageMagick](http://www.imagemagick.org/script/download.php) and install it

You can do a LOT with ImageMagick. Here's a [command-line reference](http://www.imagemagick.org/www/command-line-options.html) for it.

## Compressing images the Groovy way

Here is a [Groovy](http://groovy.codehaus.org/) script I wrote for that purpose. It would be even cooler to use something like this in a [Gant](http://groovy.codehaus.org/Gant) build:

{% highlight groovy %}
// If directory not passed use the current directory
def dir = args?.size() ? args[0] : "."
// 70 is a fairly safe value for quality
def quality = args?.size() > 1 ? args[1] : 70

// Get an ArrayList of all PNG and JPG files
images = new File(dir).listFiles().grep(~/.*(png|jpg)$/)

for (img in images) {
    print "Crushing ${img} - size: ${img.size()}-> "
    // Compress the image
    "convert -quality ${quality} ${img} ${img}".execute().text
    println "${img.size()}"
}
{% endhighlight %}

Tweak this to your liking to suit your needs. You can substitute your favorite command-line image editor if you like. Groovy makes it easy! 

Run it by typing this on your command-line:

<code>groovy src/groovy/CompressImages images/ 60</code>

What do you think? Useful? Share!
