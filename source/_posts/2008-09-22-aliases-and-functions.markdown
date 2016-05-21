---
date: '2008-09-22 05:00:28'
layout: post
comments: true
slug: aliases-and-functions
status: publish
title: Using aliases and command-line functions for speed
wordpress_id: '258'
categories: productivity
---

There are two main aspects to enhancing programming productivity, and they are what I like to call physical (decrease actual human activity) and mental (knowing the smartest way to accomplish a task) types. Humans are slow, so I want to help you prevent that slowness from killing your face-melting programming dreams.

## Stop typing so much!

One great way to **enhance your physical productivity is, obviously, to type less**. You know what you want to do and it should take no time for you to tell your computer to do it. On the command-line, we can do this most easily with smart aliases, and perhaps creating functions that streamline our tasks for us so that we can accomplish this. 

I'm going to share with you a few techniques I use to cut the number of keystrokes I type significantly while boosting my efficiency, so break out [Cygwin](http://www.cygwin.com) or your favorite terminal and let's get started.

## Find out what commands you use most frequently

Here is a quick command you can use to figure out the 10 most used commands in your history (learned from [lifehacker's post](http://lifehacker.com/software/unix/review-your-most-oftused-unix-commands-202712.php)):

{% highlight bash %}
# Get most used commands from your history
history|awk '{print $2}'|awk 'BEGIN {FS="|"} {print $1}'|sort|uniq -c|sort -r
{% endhighlight %}

My top list included _cd .._, _ls_, _grep_, and _ant_ just to name a few. Your list will differ. I probably use each at least a dozen to a hundred times per day. If we do some stupid averaging of time spent with those extra characters, we could make some completely unscientific guess that we can save about 20 minutes a day if we only had to type two or three characters (including enter) for each of these commands. 

## Create aliases smartly

Now we can take this list and create some aliases to shorten those commands most frequently used. I use bash so I'll edit my ~/.bashrc file (create in your home directory, if it doesn't exist), and you can edit the file pertaining to your shell adding something like the following:

{% highlight bash %}
# Simple Commands
alias ..='cd ..'
alias ...='cd ../..'
alias a='ant'
alias c='cd'
alias f='find'
alias g='grep'
alias h='history'
alias l='ls -l'
alias o='popd'
alias p='pushd'

# Alias directories for quick access - links often work better but these are helpful
alias myproj='/path/to/myproject/' 
alias otherproj='/other/path/directory/'

# More complex commands
alias mybox='ssh myusername@mybox.blah.com'
alias vpn='sudo vpnstuff -l connectstr && sudo morevpnstuff'
{% endhighlight %}

You get the idea. There are obviously a lot more, but it'd get boring if I shared ALL of mine. I recommend aliasing many commands to just one character. Over time, it will become second nature and your command-line will burst in flames from your speed (I still owe Casey a new monitor... sorry buddy... forgive me?)

## When an alias just won't do

Now there are obviously times where you really don't want to put it all in one command, you might not want _cd && blah && stuff || mkdir -p foo/bar_ as an alias. Unfortunately, I see so so few people use command-line functions to their advantage, but they really help you automate tasks.

Suppose you want to grab a certain file off of FTP, but you'll need to do it often as the file changes. Setup a function so you don't have to do it physically:

{% highlight bash %}
# Create variables
HOST=myhostname
PASSWD=mypass
FILE=myfile.out

function getmyfile() {
  ftp -n $HOST <<END_SCRIPT
  user ${USER} ${PASSWD}
  cd ~/the/file/path
  get $FILE
  quit
  END_SCRIPT
}

# To invoke on the command-line:
getmyfile
{% endhighlight %}

You can put whatever sequence of commands you want in a function to automate your task. This can get much more complex if you like, using variables and output from other commands, [stay tuned](/feed/). **The more you automate, the better you get at it.**

## Conclusion

The point here is to **express as much as you can with the least amount of effort**. Keep building on your automation in this way and you'll find yourself with much more time for more important tasks. Now go melt some faces!

Please share your favorite alias or function in the comments!

<div class="alert alert-success">You can find many of these tips and more in my <a href="https://github.com/eriwen/dotfiles">dotfiles project</a> on GitHub. Check it out!</div>
