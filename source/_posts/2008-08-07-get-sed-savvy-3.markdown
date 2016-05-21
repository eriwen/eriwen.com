---
date: '2008-08-07 04:30:57'
layout: post
comments: true
slug: get-sed-savvy-3
status: publish
title: Get sed savvy - part 3
wordpress_id: '68'
categories: tools
---

We will learn about the _sed_ delete (d), read (r) and write (w) commands today to round out your sed toolbox. The major parts I am covering should help you through 99% of the cases where sed is your best option. 

Soon we'll be looking at awk and other tools to continue the quest for command-line fluency. If you haven't already, install [Cygwin](http://cygwin.com) and check out [part 1](/tools/get-sed-savvy-1/) and [part 2](/tools/get-sed-savvy-2/).

## Tutorial

One of the best ways to crank out code quickly is by using templates. Using the Stream EDitor, you can streamline the use of templates.

Suppose we have a template HTML file that we want to reuse often. Maybe it looks like this:

{% highlight html %}
<html>
    <head>
        <title>template.html</title>
     </head>
    <body>
        <div id="nav">Navigation here</div>
        <div id="content">
%%CONTENT%%
        </div>
    </body>
</html>
{% endhighlight %}

Now we want to replace _"%%CONTENT%%"_ with the contents of an HTML Fragment file. The syntax is simple: '/<pattern>/r':

{% highlight bash %}
sed '/^%%CONTENT%%/r fragment.htmlf' template.html
{% endhighlight %}

The above script will append the contents of _fragment.htmlf_ **immediately after** _"%%CONTENT%%"_. So we can use the delete command to fix that:

{% highlight bash %}
sed -e '/^%%CONTENT%%/r fragment.htmlf' -e '/^%%CONTENT%%/d' template.html > whole.html
{% endhighlight %}

This might seem slightly useless, but the power here is in the simplicity. Many times I'm generating bits of Wiki code or HTML, and this has been invaluable. 

OK, now for one more command: _write (w)_. Suppose we have a CSV file that we want to split into several files depending on the value in the last cell. We could do this with [grep](/tools/grep-is-a-beautiful-tool/), or awk (coming soon), but with sed we can do it with more efficiently:

{% highlight bash %}
#sedscript file
/,[0-9]+$/w numbers.csv
/,[A-Za-z]+/w letters.csv
/,[^A-Za-z0-9]+/w symbols.csv

sed -r -f sedscript original.csv
{% endhighlight %}

Now numbers.csv will contain all rows that the last cell containing numbers, and so on for letters.csv and symbols.csv. A neat application for this might be sorting your giant contacts list into different files based on some criteria. This is a simple example, but you can probably think of a more useful scenario where you'd want to filter and split a file. 

### Other Examples

{% highlight bash %}
#Print everything outside the <html> tag (check DOCTYPES)
sed '/<html>/,/</html>/d' myfile.html

#Convert rn (DOS) to UNIX n
sed 's/$//' myfile        #Windows
sed 's/.$//' myfile       #Linux/UNIX
{% endhighlight %}

## Conclusion

You have now learned several _sed_ commands and patterns you can use to make editing files and some searching tasks much more efficient, and **even better, scriptable** so they can be automated in a process. One cool application would be to get comments from a set of files and post them to a wiki. It would sure make collaboration slick, right?

Obviously, you can bookmark this stuff but you'll really get good at it only if you just try it out. Keep sharing your experiences and command lists, they're great! 
