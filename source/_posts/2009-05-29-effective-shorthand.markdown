---
date: '2009-05-29 01:00:32'
layout: post
comments: true
slug: effective-shorthand
status: publish
title: Effective bash shorthand
wordpress_id: '811'
categories: bash
---

Let me tell you how to maximize your productivity on the Bourne Again SHell while minimizing your effort. **bash has a ton of tricks and shortcuts** that allow you to command it with little effort, and I intend to show you the features that help me day in and day out.

Today I'm going to explain the use of features like history, brace and file expansion, and other tricks by example and give you references for later. 

## Master your history

Those who forget history are doomed to repeat it. This is arguably one of the best productivity enhancing features of any shell.

You can check your history with the `history` command, which prints your last 500 commands (or so) by default. Alternatively, you can filter the list:
{% highlight bash %}
# Print last 10 entries
history 10

# searches history for cmd
history | grep cmd
{% endhighlight %}
Each entry has a number, which you can then execute with `!<number>`

Now suppose I want to copy a file to a directory and then change to that directory. The quick way to do that with history is:
{% highlight bash %}
cp myfile.txt my/directory/path
cd !$  # cd my/directory/path
{% endhighlight %}

or if I forget to run a command as super-user:
{% highlight bash %}
vi /etc/fstab  # oops!
sudo !!  # sudo vi /etc/fstab
{% endhighlight %}

to execute the last command starting with "mount", since I don't want to type it all out:
{% highlight bash %}
# Previously...
mount 192.168.0.100:/my/path/to/music /media/music

# Later...
!mount
# Repeats last mount command
{% endhighlight %}
Note that I **often (but not always) prefer `Ctrl-R`**, which will search history as you type. As an added bonus you can view the command before executing it.

Other examples:
{% highlight bash %}
eric@sawyer:~$ echo foo -a bar baz
foo -a bar baz
eric@sawyer:~$ echo !:3-4
bar baz
eric@sawyer:~$ !-2 #2nd-to-last command
foo -a bar baz
eric@sawyer:~$ ^ba^ya #replace 1st "ba" with "ya"
foo -a yar baz
eric@sawyer:~$ !^:p #MUCH cooler than "echo ..." ;)
foo
eric@sawyer:~$ !?bar #Last command containing "bar"
foo -a bar baz
eric@sawyer:~$ !:gs/ba/ya #replace all "ba" with "ya"
foo -a yar yaz
{% endhighlight %}

### Quick reference

`!!`
expands to the last command and all arguments

`!-3`
3rd-to-last command and all arguments

`!^`
first argument of the last command in history

`!:2`
2nd argument of the last command

`!$`
last argument of the last command

`!*`
all arguments of the last command, but not the command itself

`!42`
expands to the 42nd command in the history list

`!foo`
last command beginning with "foo"

`!?baz`
last command containing "baz"

`^foo^bar`
last command with the _first_ occurrence of "foo" replaced with "bar"

`!:gs/foo/bar`
last command with _all_ occurrences of "foo" replaced with "bar"

`<any_above>:p`
prints command without executing

### Helpful .bashrc entries for history

Copy and paste these into `~/.bashrc`
{% highlight bash %}
# Don't put duplicate lines in the history
export HISTCONTROL=ignoredups

# Store a lot history entries in a file for grep-age
shopt -s histappend
export HISTFILE=~/long_history
export HISTFILESIZE=50000

# No reason not to save a bunch in history
# Takes up several more MBs of RAM now, oOOOooh
export HISTSIZE=9999

# Ignore dupe commands and other ones you don't care about
export HISTIGNORE="&:[ ]*:exit"
{% endhighlight %}



### Another neat trick with .inputrc


If you are still particularly fond of the up and down arrows, copy and paste the following into a `~/.inputrc` file. This will allow you to start typing a command and then hit the up-arrow to search backwards through your history for commands starting with what you typed. I prefer other methods usually but this is pretty cool, huh?

{% highlight bash %}
"\eOA": history-search-backward
"\e[A": history-search-backward
"\eOB": history-search-forward
"\e[B": history-search-forward
"\eOC": forward-char
"\e[C": forward-char
"\eOD": backward-char
"\e[D": backward-char
{% endhighlight %}

### Further reading

Peteris Krumins has an excellent write-up called [The Definitive Guide to Bash Command Line History](http://www.catonmat.net/blog/the-definitive-guide-to-bash-command-line-history) which goes in-depth on many of the above topics, should you crave more bash history goodness. 

## Brace expansions

No shorthand list would be complete without the (in)famous brace expansions. Basically, they allow you to specify part(s) of an command to repeat substituting different values of a set within braces. Let me show you what I mean:

{% highlight bash %}
# Quickly make a backup
cp file.txt{,.bak}
# Equivalent to 'cp file.txt file.txt.back'
{% endhighlight %}
This is obviously very useful to prevent having to repeat parts of files or directory paths. 

Suppose I wanted to make a template folder structure, I could make most of the directories I need with:
{% highlight bash %}
mkdir -p {src,test}/com/eriwen/{data,view}
{% endhighlight %}
This will expand every combination so I end up with src/com/eriwen/data, src/com/eriwen/view, test/com/eriwen/data, and so forth. Being able to create a template directory structure with one line is a big time saver!

## Better filename expansion

I'm sure you often use the * operator to match files beginning or ending with something, but bash goes far beyond that. It should be noted, though, **at some point a good `find | grep` is more powerful and useful**. See [Find is a beautiful tool](/productivity/find-is-a-beautiful-tool/) for more information.

In addition to wildcards with `*`, you can use `?` to match any single character. You can also limit matching to certain characters with `[]`. For example:
{% highlight bash %}
ls 
# prints "myfile netbeans.conf netbeans-6.5rc2 netbeans-6.5 netbeans-6.7 src"
ls netbeans-6.?
# matches "netbeans-6.5 netbeans-6.7"
ls netbeans-6.[1-5]*
# matches "netbeans-6.5rc2 netbeans-6.5"
{% endhighlight %}

### .bashrc entries for better filename expansion

{% highlight bash %}
# Include dot (.) files in the results of expansion
shopt -s dotglob
# Case-insensitive matching for filename expansion
shopt -s nocaseglob
# Enable extended pattern matching
shopt -s extglob
{% endhighlight %}

## cd shorthand

There are a couple quick tricks to change to oft-used directories. For example:
{% highlight bash %}
# Lame way to go home
cd ~

# The cool way
cd
{% endhighlight %}

You can also switch to the previous directory with `cd -` like so:
{% highlight bash %}
pwd  # prints /home/eriwen/src
cd /my/webserver/directory

# Do something...

cd -
# Now I'm back in /home/eriwen/src
{% endhighlight %}
To get more advanced with this, try [mastering your directory stack with pushd and popd](/bash/pushd-and-popd/).

## Conclusion

Effective use of history, brace expansions, and other shortcuts will to save you a lot of time. However, **nothing is more productive than no typing**. [Automating things](/productivity/crontab-for-automation/) is best where possible. If you can't automate, [use smart aliases](/productivity/aliases-and-functions/).

I know I did not cover tilde expansions, shell parameter expansions or [bash key commands](http://beerpla.net/2008/12/22/mastering-the-linux-shell-bash-shortcuts-explained/). You will want to check those out as well, but I find them less useful than what I've covered here. 

Have any quick shortcuts you love? Share them in the comments!
