---
date: '2009-01-16 06:30:32'
layout: post
comments: true
slug: pushd-and-popd
status: publish
title: Use pushd and popd for faster CLI navigation
wordpress_id: '459'
categories: bash
---

One of my favorite ways to save time on the command-line is to utilize the directory stack to jump between tasks. Today's article will show you how to do this and provide some tips for effective use.

## What is the directory stack?

Most Linux environments have a way for you to put paths on a stack (push) and then take them off in reverse order (pop). This is useful when you have more than one directory that you need to switch between frequently. Let's take a look at how to do this.

## The pushd command

Suppose you need to switch between your project: _~/src/myproject_, your web-server: _/opt/webserver7/logs_ and some code examples: _~/examples/othercode_ often. 

You add things to the directory stack with _pushd_ like so:
{% highlight bash %}
# switch from project to web server and put on the stack
pushd /opt/webserver7/logs
# Stack is now '/opt/webserver7/logs ~/src/myproject'

# show latest errors
tail -40 errors.log
{% endhighlight %}

Now your in your server logs and you want to go to the examples:

{% highlight bash %}
# switch from project to web server and put on the stack
pushd ~/examples/othercode
# Stack is now '~/examples/othercode /opt/webserver7/logs ~/src/myproject'

# bring the 3rd directory on the stack to the front (0-based) and rotating the stack
pushd +2
# Stack is now '~/src/myproject ~/examples/othercode /opt/webserver7/logs'

# copy Java example to myproject
cp MyExample.java `dirs | awk '{print $1}'`
{% endhighlight %}

## The popd command

Now we want to go back to my project to deploy it to our web server. Since we have our directory stack working we can do this quickly:

{% highlight bash %}
# go back to myproject
popd
# Stack is now '~/examples/othercode /opt/webserver7/logs'

# deploy stuff
ant dist
{% endhighlight %}

For the purposes of this example, let's pretend we don't care to go back to the examples. Let's remove it from the stack:

{% highlight bash %}
# remove examples from the directory stack
popd +0
# Stack is now '/opt/webserver7/logs'
{% endhighlight %}

One final _pop_ will get me back to my server logs once I test it out in my browser. Of course, we can keep using the stack continuously.

## Alternatives and nifty tips

You might not always want to use the directory stack. You can use these really fast shortcuts to navigate to home or back quickly:
{% highlight bash %}
# change to home directory quickly in bash
cd

# change to last directory in bash
cd -
{% endhighlight %}

Now for some final examples that may help out just a little more:
{% highlight bash %}
# print directories on the stack
dirs

# hey just type less
alias p='pushd'
alias o='popd'
{% endhighlight %}

## Conclusion

Using pushd and popd effectively can help you get around your command-line environment quickly. See the MAN pages for more information.

Take a bit of time to get the hang of it now and it'll pay off later. Share your other examples or questions!

