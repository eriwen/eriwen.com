---
date: '2008-07-23 06:36:31'
layout: post
comments: true
slug: get-sed-savvy-2
status: publish
title: Get sed savvy - part 2
wordpress_id: '64'
categories: tools
---

Now that you know a bit about the Stream EDitor from the [last sed tutorial](/tools/get-sed-savvy-1/), we are going to expand our knowledge of substitution and line printing with an interesting scenario.

Suppose we want to let someone else know what kinds of functions are in a given Javascript file. Think of it as a simple sort of Javadoc for CSS or Javascript. The way we are going to do this is look at all of the files modified in the last day and then extract the comments out of them and put them somewhere (on a wiki perhaps?). **Doing this kind of automation will increase team communication and productivity immensely if done correctly.**

## Tutorial

Download and install [Cygwin](http://www.cygwin.com/) if you're on Windows to follow along.

{% highlight bash %}
# Single-line comments - grep's better but we can use sed
sed -n '///p' blah.js > /tmp/comments.out

# Multi-line comments
sed -n '//*/,/*//p' blah.js >> /tmp/comments.out
{% endhighlight %}

Now, the _sed_ commands above are tricky so here is how you can understand them: The _-n_ option tells sed not to print anything unless you tell it specifically what to print. The comma [,] in between the two patterns tells sed to match everything between the two patterns, in this case everything between multi-line comments /* and */ and then the **_p_-command prints whole lines that match the pattern space**.

We can combine these two commands to streamline a killer process.

{% highlight bash %}
# sed script file
////p
//*/,/*//p

# Use the sed script to print all comments
sed -n -f sedscr blah.js > /tmp/comments.out
{% endhighlight %}

Now we have a nice little summary of our Javascript files we can post to a wiki or diff with another version to see what was added.  Note that the _sed_ print command prints the whole line, so if you have comments at the end of a line you will get the beginning of that line also. Not a perfect solution, but something quick and easy!

## Other Examples

{% highlight bash %}
# Print lines longer than 80 characters
sed -n '/^.{81}/p' myfile

# Delete blank lines
sed '/^$/d' myfile

# Substitution optimized for speed
sed '/Yahoo/ s//Not Microhoo/g' myfile
{% endhighlight %}

## Conclusion

You should now be getting pretty proficient with _sed_. Use it along with [find](/productivity/find-is-a-beautiful-tool/) and [grep](/tools/grep-is-a-beautiful-tool/) and you will find yourself feeling much more comfortable on the command-line.

**I encourage you to experiment a bit and use this even in circumstances where you know it's not necessary**, just to get the hang of it. In the long run you'll end up increasing your productivity by using these most powerful tools.

