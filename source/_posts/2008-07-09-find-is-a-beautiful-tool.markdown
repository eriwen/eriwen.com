---
date: '2008-07-09 22:19:15'
layout: post
comments: true
slug: find-is-a-beautiful-tool
status: publish
title: Find is a beautiful tool
wordpress_id: '59'
categories: productivity
---

I have [blogged before](/opinion/what-i-wanted-to-know/) that **knowledge of command-line tools is essential to take the next step in programming productivity**. I think it would be useful to provide simple tutorials for these powerful tools, starting with _find_.

## Tutorial

If you're on Windows, I would recommend installing [Cygwin](http://www.cygwin.com/) to bring the power of a real shell to your OS. Let us start with a simple example and build upon it:

{% highlight bash %}
find . -name "*.css"
{% endhighlight %}

This will recurse all directories and list all CSS files (and directories ending with ".css") under the current directory (represented by "."). We only want to match files so we'll go ahead and change it to this:

{% highlight bash %}
find . -type f -name "*.css"
{% endhighlight %}

Now we will only match CSS files (case-sensitively). Nothing special? Fine, I see how it is. Let's find all CSS files that do something with your HTML ID #content next:

{% highlight bash %}
find . -name "*.css" -exec grep -l "#content" {} \;
{% endhighlight %}

Here we combine _find_ with [grep](/tools/grep-is-a-beautiful-tool/) using the _-exec_ option, allowing us to do some processing on every match.

We're starting to get productive now, so let's keep going. Suppose now we want to change every reference to the color #FF0000 (red) to #00FF00 (green). Normally you would have to have your editor search and replace them, if it even has that capability. Even then it's slow, this statement is fast:

{% highlight bash %}
find . -name "*.css" -exec sed -i -r 's/#(FF0000|F00)\b/#0F0/' {} \;
{% endhighlight %}

Gasp! Wait a minute, I just searched for both ways to specify red and replaced it with green in my CSS!! How long would that have taken otherwise? Do you see now how you can code faster by automating it and combining powerful tools? Let's look at some other cool search options _find_ has to offer:

## Other Examples

{% highlight bash %}
# find files changed in the last 1 day
find . -mtime -1 -type f

# find CSS files, omitting results containing "CVS"
find . \! -path "*CVS*" -type f -name "*.css"

# find files newer than main.css in ~/src
find ~/src -newer main.css

# combine with xargs for more power than -exec
find . -name \*.css -print0 | xargs -0 grep -nH foo
{% endhighlight %}

## Conclusion

By itself, _find_ is only as good as say... Google Desktop. The real power, as with other shell tools, is the ability to combine with other tools seamlessly. Effective use of tools like _find_ very often make the difference between an average programmer and one that is 10x more effective (actual multiples up for debate).

These are just **some** of the basic features of _find_. Take advice from [Chris Coyier](https://www.css-tricks.com/) and use your new power responsibly. Find is a beautiful tool.
