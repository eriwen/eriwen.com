---
date: '2008-07-18 09:02:14'
layout: post
comments: true
slug: get-sed-savvy-1
status: publish
title: Get sed savvy - part 1
wordpress_id: '63'
categories: tools
---

Today I'll continue the series on command-line tools for productivity, with _sed_. Stream EDitor is the most complicated tool so far, **an entire language** in its own right. It is much too big to cover completely in one post, so I'm going to have a few posts covering the major parts of sed. 

The bread and butter of _sed_ is its search-and-replace functionality. Let's start with that and then throw in some other fun commands.

## Tutorial

As with the previous posts, if you are on Windows you'll want to install [Cygwin](http://www.cygwin.com) or one of the various other tools suggested in the previous comments. _sed_ also uses regular expressions so you'll want to keep your [regex reference](http://www.regular-expressions.info/reference.html) handy. From Wikipedia:

> [sed] reads input files line by line (sequentially), applying the operation which has been specified via the command line (or a sed script), and then outputs the line.

{% highlight bash %}
sed 's/#FF0000/#0000FF/g' main.css
{% endhighlight %}

We can read this like so: search **[s/]** for red **[#FF0000/]** and replace it with blue **[#0000FF]**, globally **[/g]** in main.css. Two notes here: 1) This does not actually modify the file, but outputs what the file would look like if it did the replace and 2) If we left off the "g" at the end it would only replace the first occurrence. So let's modify the file this time.

{% highlight bash %}
sed -i -r 's/#(FF0000|F00)b/#0F0/g' main.css
{% endhighlight %}

This is an example from the [find tutorial](/productivity/find-is-a-beautiful-tool/) that replaces all instances of red with green in our CSS file. The _-r_ option here gives us extra regex functionality. As [Sheila mentioned in the find post](/productivity/find-is-a-beautiful-tool/), _-i_ does not work on Solaris and she suggests something like _perl -e s/foo/bar/g -i_ instead.

Suppose we want to change a whole color scheme though, the best way is to use a sed script file like so:

{% highlight bash %}
# sedscript - one command per line
s/#00CC00/#9900CC/g
s/#990099/#000000/g
s/#0000FF/#00FF00/g
...

# use sedscript with -f
sed -i -f sedscript *.css 
{% endhighlight %}

sedscript is obviously a new file we have created. Note that we don't quote the commands in the file. Now we have successfully changed our color scheme in our CSS files. 

## Other Examples

{% highlight bash %}
# Trim whitespace from beginning and end of line
# You *might* have to type a tab instead of t here depending on your version of sed
sed -r 's/^[ t]*//;s/[ t]*$//g'

# Delete all occurances of foo
sed 's/foo//g'
{% endhighlight %}

## Conclusion

You should start seeing how you can make a lot of changes with simple one-liners with _sed_. Using it effectively can really increase your efficiency with some tasks. 

Here are some good references you should bookmark (including this page of course ;)

  * [http://sed.sourceforge.net/sed1line.txt](http://sed.sourceforge.net/sed1line.txt) - Eric Pement
  * [http://www.catonmat.net/blog/sed-stream-editor-cheat-sheet/](http://www.catonmat.net/blog/sed-stream-editor-cheat-sheet/) - Peteris Krumins

I'd say that 90% of the time I use _sed_ for search-and-replace, so you've got a good start here. As I mentioned earlier, there is a LOT more to sed. Later, I'll show you how to make deletions, add line numbers to files, print specific lines by line number, and much more. [Stay Tuned](http://feeds.feedburner.com/EricWendelin), and share your favorite one-liners in the comments!
