---
layout: post
comments: true
title: "Task-Oriented Comments"
slug: todo-comments
status: publish
date: 2013-03-19 03:00
category: opinion
---

Those who pair program with me know that I'm an advocate of leaving comments like `// FIXME: Breaks layout on tablets` or `# TODO: Extract to model`.
Little reminders of things I don't want to forget before, say, pushing a new feature.

I have a non-trivial amount of tooling I use around these _task-oriented comments_, and I've been meaning to write about how I
use them. Here you go.

## My Approach
Often while working on new features (and sometimes, bugs) I sketch out a plan of what I need to do in English with a collection
of comments. This helps me break the task into little pieces so I can make sure I don't miss anything. It also has the benefit
of helping me discuss the general approach with my pair so they can consider better solutions.

Next, I distribute these comments _to the places where I'm going to code the implementation_ (if possible); that way
they give the reader context so it's easier to think about the pieces involved. I'll write the implementation and tests,
adding comments as I think of them. I want to write these intermittent notes down quickly so I can forget about them
until I'm ready to address them.

Lastly, I like to write myself notes before taking long breaks or quitting for the day.
Comments like `# TODO: Finish injecting response into view` help me to pick up right where I left off later.
No more awkward "Now what was I doing yesterday?" moments.

## Properties of good TODO comments
This is not so hard, you just have to always write them as if someone else will read them.
Remember to _make it specific_. If it's a bug, you might _explain why_, especially if someone else is going
to be fixing it. Perhaps you might briefly explain why something should be implemented a certain way.
Finally, _don't go overboard!_ If you can write the code in 30 seconds, why waste time telling yourself what to do.

## Improving task-oriented comments with tools
You might be saying to yourself: "But the advantage of a real TODO list is that it's in one place". (OK maybe not, but go with me here, eh?)
&mdash; and you'd be right. That's where our tools come in; the simplest of which is [grep](/tools/grep-is-a-beautiful-tool/).

{% highlight bash %}
egrep -R "(TODO|FIXME)" *
{% endhighlight %}

Editors like IntelliJ IDEA/RubyMine keep track of comments with keywords like this automatically. Just hit ⌘6 (Alt-6 on Windows/Linux)
and the aptly named TODO pane comes up. I actually like to add new patterns in IntelliJ's TODO settings panel, to make FIXME comments stand out in red.
Sublime Text seems to have a handy plugin called [SublimeTODO](https://github.com/robcowie/SublimeTODO)
that aggregates these keyword comments, as well. Leave a comment with other neat TODO-tracking tools.

We can also utilize [git hooks](http://git-scm.com/book/en/Customizing-Git-Git-Hooks) to tell us anything we missed
so that we can either fix them before we push or add stories to our favorite agile task board. Here's the git hook that
I use _pre-commit_:

<script src="https://gist.github.com/5193583.js"> </script>

All this does is print out any new `TODO` or `FIXME` comments. To use this git hook, just copy it to `.git/hooks/pre-commit`
in any repo (don't forget to make it executable). It runs before every commit and you can prevent the commit by returning a
non-zero exit code. You can fork the [gist here](https://gist.github.com/eriwen/5193583) for your own needs.

Finally, [Jenkins](http://jenkins-ci.org/) has a plugin called [Task Scanner](https://wiki.jenkins-ci.org/display/JENKINS/Task+Scanner+Plugin) that
lets you track comments matching certain patterns and give them priorities. I like to mark `FIXME` comments as high-priority and
`TODO` comments as medium or low priority. It'll also provide reports and charts so you can keep track of your task-oriented
comments on a higher level.

Sometimes I don't use this system if the task is small or I have a really good grasp of how to write the thing I want to write.
The point is to _program deliberately_. Cheers.
