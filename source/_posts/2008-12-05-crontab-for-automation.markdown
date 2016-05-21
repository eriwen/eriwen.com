---
date: '2008-12-05 08:00:19'
layout: post
comments: true
slug: crontab-for-automation
status: publish
title: Start using crontab for automation
wordpress_id: '342'
categories: productivity
---

I seem to preach a lot about automation for productivity, and with good reason. You should not have to perform mundane tasks repeatedly. Crontab is a fantastic tool for simply running exactly what you want at times you specify.

Fire up your terminal or [Cygwin](http://cygwin.com) now. 

## crontab tutorial

Suppose I want to copy my personal wiki to my website every other hour between 8:30 and 18:30 on weekdays only. This only takes a couple minutes to setup with a bit of cron-fu.

I'm going to go ahead and use FTP to put my wiki where I want, so I wrote a quick bash script (_backup_wiki.sh_) for this purpose:
{% highlight bash %}
#!/bin/bash
# File: backup_wiki.sh
HOST='mysite.com'
USER='myuser'
PASS='mypassword'

ftp -n ${HOST} <<END_SCRIPT
quote USER ${USER}
quote PASS ${PASS}
put path/to/my/wikifile.html wikifile.html
bye
END_SCRIPT
exit 0
{% endhighlight %}

Sweet, so now we can just use _backup_wiki.sh_

Let's edit (or create) our new crontab file:

<code>crontab -e</code>

This brings up _vi_ (by default) with a file that may have a comment or may be empty. I don't feel like using _vi_ right now, so I'll change it to _jEdit_ by adding the following to my .bashrc file:

<code>export EDITOR="[/path/to/jedit.bat (windows) or 'jedit' (*nix)]"</code>

Ah, that's better. Now that we can open it up in our fav. text editor, let's learn how to create an entry in our crontab file.

## crontab file structure

Lets break down a sample command that we'll be putting into our crontab file
{% highlight bash %}
#min hour dom month dow command
30 8-18/2 * * 1-5 ./path/to/backup_wiki.sh 
{% endhighlight %}

This command will run our _backup_wiki.sh_ script at 8:30, 10:30, ... 18:30 every Monday(1) through Friday(5). The crontab file basically has one command per line in the following format with the following separated by a space:

  * Minutes [0-59]
  * Hour [0-23]
  * Day of Month [1-31]
  * Month [1-12] - January is 1, obviously
  * Day of Week [0-6] - Sunday is 0
  * Command to run (can have spaces)

An asterisk (*) means all possible values, so in our example above we mean all days of all months. You can specify a range by using a dash (-). Also, using a slash and then a number (like /2) after a command means only run on increments divisible by 2, so 8-19/2 means 8, 10, 12, 14, 16, 18. 

Now suppose we just want to 
{% highlight bash %}
# view our crontab entries without editing them
crontab -l

# remove your crontab file and start fresh
crontab -r

# on *some* systems (not Cygwin), view the last edit time of crontab
crontab -v
{% endhighlight %}

## example crontab entries

You'd be surprised what you can automate. Here are some simple examples to give you ideas:
{% highlight bash %}
# Run backup at 3am every night
0 3 * * * ./nightly_backup.sh >> /logs/dir/backups.log

# Mail me feedburner subscribers every weekday
0 6 * * 1-5 mail -s "Daily Subscriber Report" myemail@gmail.com < `get_subscribers.sh`

# Download meeting agenda wiki page every Tues/Thurs in Dec. 1st-24th
30 8 1-24 12 2,4 ./path/to/curl_get_agenda.sh
{% endhighlight %}

Mark Sanborn has another [post about cron](http://www.marksanborn.net/linux/learning-cron-by-example/) that has other useful bits I haven't covered here.

I hope you found this introduction to cron useful. Please share your ideas for automating with it in the comments!
