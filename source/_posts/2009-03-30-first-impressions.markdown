---
date: '2009-03-30 04:00:52'
layout: post
comments: true
slug: first-impressions
status: publish
title: Python first impressions
wordpress_id: '621'
categories: python
---

<img src="/images/python.png" alt="Python logo" class="img-left" />A few days ago I got my first [Python](http://www.python.org) project. I'd like to share references I've found, and what I like or dislike about the language. I hope to give insight to would-be Python dabblers and ideas to current Pythoneers.

## Good resources I've found

I have found some good resources online for Python and [Jython](http://www.jython.org/), but I know I didn't find them all so if you Python-istas could put some in the comments I'd be very grateful :)

  1. The somewhat famous [Python is not Java](http://dirtsimple.org/2004/12/python-is-not-java.html) article
  2. [Python Documentation Index](http://www.python.org/doc/)
  3. [Python 2.6.1 Docs](http://docs.python.org/)
  4. [Python Language Notes](http://www.angelfire.com/tx4/cus/notes/python.html) by [Chris Rathman](http://www.angelfire.com/tx4/cus/index.html)
  5. [The Jython Project](http://www.jython.org/Project/)

## What I like so far

I like that a lot of common operations are very easy. Take for example:

{% highlight python %}
# 3 Hellos in Python
hellos = 'Hello ' * 3
{% endhighlight %}
as opposed to 
{% highlight java %}
// 3 Hellos in Java
String hellos = "";
for (int i = 0; i < 3; i++) {
    hellos += "Hello ";
}
{% endhighlight %}

There are a bunch of other features that come to mind, like _string formatting_, _list manipulation_, and _variable and default-valued arguments_. Oh, and of course _closures_ are very straightforward:
{% highlight python %}
def outer(your_name):
    title = random.choice(["Mr", "Mrs", "Miss"])

    def greeter(greeting):
        print greeting, title, your_name

    return greeter

g = outer("Eric")  # invoke it

# g now contains a reference to the inner function, but as it references variables
# from the local scope of outer, the invocation data has been stored in a closure
# Execution of outer is finished, but g can still reference its local variables through
# the closure:

g("Hi")  # prints "Hi Mr. Eric" :D
{% endhighlight %}

I could go on and on, but you really ought to read the [documentation](http://docs.python.org/) to see all of its features. Actually there's not all that much to it!

## Troubles I have with it

I wish I could find more documentation with simple code examples. I'm sure there are a bunch of blog posts out there but it'd be nice if there were more included with the documentation.

Passing arguments by reference doesn't seem to be possible, which is fine, but different. I'm not totally used to the lack of curly braces, but I like the fact that you _must_ have good formatting to have runnable Python. I was surprised to learn that Python is _strongly typed_ which in some way I think is odd because it seems like it'd be simpler if it was weakly typed. 
{% highlight python %}
a = "17"
b = 25
print a + b  # Nope!
{% endhighlight %}

One last thing is classes. I'm not sure I have my head around how they really work in Python. I'm sure I'll get the hang of it soon.

## Conclusion

Overall I'm thoroughly impressed with the language. There almost seems to be a Zen-like aura around Python code that is written with the simplicity the language creators intended.

Obviously I still have a lot to learn, so please help me out if you have some advice in the comments!
