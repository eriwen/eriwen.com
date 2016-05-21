---
date: '2008-03-28 21:08:24'
layout: post
comments: true
slug: measure-ems-for-layout
status: publish
title: 'Javascript: Measure those "em"s for your layout'
wordpress_id: '40'
categories: javascript
---

For many of us designing fluid layouts, which are generally based in "em"s (pronounced like the letter M) you end up not really knowing how many pixels an "em" is while you are deep in the DOM tree. This is especially confusing if you increase/decrease text size with your browser.

For this reason, I have created a simple Javascript function that you can use to poll any element on your test page and figure out what size an "em" is.

## The Javascript code:

Old, busted way that supports Safari 2:
{% highlight javascript %}
function getEmSize(el) {
  // If you pass in an element ID then get a reference to the element
  if (typeof el == "string") el = document.getElementById(el);
  
  if (el != null) {
    var tempDiv = document.createElement('div');
    tempDiv.style.height = '1em';
    el.appendChild(tempDiv);
    var emSize = tempDiv.offsetHeight;
    el.removeChild(tempDiv);
    return emSize;
  }
}
{% endhighlight %}

New hotness (from [David Baron's suggestion on StackOverflow](http://stackoverflow.com/questions/4571813/why-is-this-javascript-function-so-slow-on-firefox)):
{% highlight javascript %}
function getEmSize(el) {
    return Number(getComputedStyle(el, '').fontSize.match(/(\d+(\.\d+)?)px$/)[1]);
}
{% endhighlight %}

## Explanation and Usage

You can easily use this function by calling:

{% highlight javascript %}
    getEmSize("elementid");
    // OR
    getEmSize(elementReference);
{% endhighlight %}

from your navigation bar or [Firebug](http://getfirebug.com) console or of course within a loop traversing your entire DOM tree (watch out for those text nodes though!).

## Caveats

You could improve this by using a loop as I said earlier and print out a nice DOM tree with pixel values.

I know that there are some improvements to be made here so I wanna see some in the comments! What other ways do you keep track of your "em"s in a fluid layout?
