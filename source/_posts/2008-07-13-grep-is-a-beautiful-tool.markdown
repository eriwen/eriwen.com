---
date: '2008-07-13 19:57:08'
layout: post
comments: true
slug: grep-is-a-beautiful-tool
status: publish
title: grep is a beautiful tool
wordpress_id: '60'
categories: tools
---

_Global Regular Expression Print_ is a staple of every command-line user's toolbox. As with [find](/productivity/find-is-a-beautiful-tool/), it derives a lot of power from being combined with other tools and can increase your productivity significantly.

Following is a simple tutorial that will help you realize the power of this simple and most useful command. If you are on Windows and haven't already, download and install [Cygwin](http://www.cygwin.com). If you are also new to regular expressions (regex), here is a great [regular expressions reference](http://www.regular-expressions.info/reference.html) to get you started. 

## Tutorial

Suppose we want to search for duplicate functions in all of our JavaScript files. Let's start basic and work up to it. **This technique can be used to search for a TON of duplicate items** like:

  * Duplicate HTML IDs
  * Check how many times a CSS class is used
  * Duplicate java classes
  * many, many more...

{% highlight bash %}
# Search JS files in this directory for "function"
grep "function" *.js
{% endhighlight %}

The above command will print the lines containing "function" in all JavaScript files in the current directory (NOT subdirectories). Printing out line contents would be much more helpful if we knew what files they come from and their line numbers:

{% highlight bash %}
# Print files, line #s, and lines starting with function
grep -EHn "^s*(function w+|w+ = function)" *.js
{% endhighlight %}

Depending on how you format your JavaScript files, something like this will omit comments, anonymous functions, and also words like "functionality" giving you better results.

{% highlight bash %}
# Print a list of: function {function-name} and sort it
grep -Eho "^s*function w+" *.js | sort
{% endhighlight %}

_-o_ prints only the part that matches the regular expression. _-E_ options gives me extended regex and _-h_ suppresses printing of the file name. I am then piping to _sort_ which just sorts the output so it a list of function <function-name>. **If you don't have a lot of files/functions to go through, you can just scan the list and then note the duplicate function names you see.** Let's go a step further for those that DO have a big list:

{% highlight bash %}
# Print only duplicate function names
grep -hEo "^s*function w+" *.js | sort | uniq -d
{% endhighlight %}

There we go! That will list only the duplcated functions. I know that we can expand this with _awk_ or other stuff and get the file names and line numbers of the duplicates, but I don't want to explaining the details of _awk_ ;).

## Other Examples

{% highlight bash %}
# Count the number of functions in all JS files
grep -c "function" *.js

# Print lines that DO NOT have "function"
grep -v "function" *.js

# List processes that match "pidgin" (non-Windows)
ps -ef | grep pidgin
{% endhighlight %}

## Conclusion

_grep_ is one of the most used command-line tools, often piped to for filtering output. **Understanding it is essential to increasing productivity on the command-line.** There is so much more to _grep_ than what I've shown here, and it would be cool to see your best uses in the comments!
