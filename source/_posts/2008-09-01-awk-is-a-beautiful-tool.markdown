---
date: '2008-09-01 08:00:44'
layout: post
comments: true
slug: awk-is-a-beautiful-tool
status: publish
title: awk is a beautiful tool
wordpress_id: '183'
categories: tools
---

AWK is a very powerful programming language that we can use on the command-line for advanced text processing. I'd like to provide a guide so you can get started using it. I'll be covering the basics of AWK (named after Alfred **A**ho, Peter **W**einberger, and Brian **K**ernighan) and provide some useful examples. 

## Tutorial

To best introduce _awk_ I'd like to start with a practical example. Most of the applications for awk that I've dealt with involve formatting some output or data into something cleaner and more usable. This is certainly not the limit of awk, it is **a full fledged language** with all the power and responsibility to go with it.

Awk operates on one "record" at a time, which is each line by default. **Each "field" in a record is separated by a space** (by default) or another defined separator (using the -F option).

We're going to print the file names, line-numbers, and function names of all duplicate functions so they're super easy to find and remove. Suppose we have some output from grep with file names and line numbers using a command like this (pulled from my [grep tutorial](/tools/grep-is-a-beautiful-tool/)):

{% highlight bash %}
# Prints javascript functions like this - <file>:<line-num>:<line-content>
grep -EnH "^\s*function \w+" *.js | sort
{% endhighlight %}

That's all good and well, but this doesn't quite give us what we want in a clear manner, it prints all functions and information in a kinda cludgy fashion. We can clean this up with a bit of awk. First let's learn a basic awk command:

{% highlight bash %}
awk '/'^$'/ { print "blank line" }' myfile
{% endhighlight %}

This snippet will print "blank line" for line that matches the regex: ^$ (a blank line). The pattern (between the two slashes, inclusive) is optional and we'll see in the next example:

{% highlight bash %}
awk 'BEGIN { print "Hello, awk!" } { print $2, $1 } END { print "Goodbye, awk!"}' myfile
{% endhighlight %}

How this reads is: Before processing (BEGIN), print "Hello, awk!" and then _print_ the second field ($2) and then the first ($1) for each line of myfile, then after processing (END) print "Goodbye, awk!". The BEGIN and END clauses are optional. 

As explained above, a field is a sequence of non-whitespace characters. So if a line contained "foo bar other stuff", awk would print "bar foo". 

One more thing before continuing: awk scripts can get ugly so it is useful to know you can read a file for awk commands:

{% highlight bash %}
#My awk file: foo.awk
BEGIN { print "Hello, awk!" } 
{ 
    print $2, $1 
    # This is an awk comment
} 
END { print "Goodbye, awk!" }

#Invoke foo.awk
awk -f foo.awk myfile
{% endhighlight %}

OK, let's add some power to that old grep command. We can use the _-F_ option to specify our delimiter so let's add to our grep command like so:

{% highlight bash %}
grep -Eoni "^\s*function \w+" *.js | awk -F ':' '{print $3," ",$1,$2}' | sort
{% endhighlight %}

Now we have a sorted list of function names followed by their filename and line number by spaces. We needed to print $3 first so that we could easily sort by the function name and look for duplicates, but we're not going to do that manually... oh noooooo way. 

Let's make it a bit prettier and _uniq_-ify our list of functions by function:

{% highlight bash %}
# New part of our command
awk '{print $3,"line",$4,$2}' | uniq -f 3 -D

# Full command
grep -Eoni "^\s*function \w+" *.js | awk -F ':' '{print $3," ",$1,$2}' | sort | awk '{print $3,"line",$4,$2}' | uniq -f 3 -D
{% endhighlight %}

Here we pipe our last command back into _awk_ printing <filename> line <line-num> <function-name> and then use uniq on the 3rd field (-f 3) showing only the duplicates (-D). 

## Other awk examples

{% highlight bash %}
#Backup all JavaScript files with a .bak extension -- replace 'bash' with your shell
 ls *.js | awk '{print "cp "$0" "$0".bak"}' | bash

#Print the number of lines that contain "function"
awk '/'function'/ {i = i + 1} END {print i}' myfile.js
{% endhighlight %}

## Conclusion

AWK is admittedly a ten ton gorilla of a tool, so there is no way I could cover everything that it can do in one post. If there is enough demand I can write about some of the more advanced features like conditionals, variables, and formatting.

## Further Reading

To see how far this rabbit hole goes, you should check out a couple of my favorite references:

  * [awk, nawk, and gawk cheat sheet](http://www.catonmat.net/blog/awk-nawk-and-gawk-cheat-sheet/)
  * [AWK - Wikipedia](http://en.wikipedia.org/wiki/Awk)
  * [Hartigan's AWK reference](http://sparky.rice.edu/~hartigan/awk.html)

Hope you found this informative and want to know more. I know you all probably have some awk gems to share, let's see them!
