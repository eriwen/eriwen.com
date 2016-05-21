---
date: '2008-01-29 23:47:07'
layout: post
comments: true
slug: css-adjacent-sibling-selectors
status: publish
title: CSS Adjacent Sibling Selectors
wordpress_id: '29'
categories: css
---

Among the types of CSS selectors, one that is often overlooked is the [CSS Adjacent Selector](http://www.w3.org/TR/REC-CSS2/selector.html#adjacent-selectors).

> Adjacent sibling selectors have the following syntax: E1 + E2, where E2 is the subject of the selector. The selector matches if E1 and E2 share the same parent in the document tree and E1 immediately precedes E2.

## The CSS code

{% highlight css %}
h4 + p {
    font-weight: bold;
    color: #F00;
}
{% endhighlight %}

The text below is a simple example of the above code:

- - -

<div id="adjacent"><h4>This is normal heading 4 text</h4><p>This is the <code>&lt;p&gt;</code> after the heading. It should be red.</p></div>

- - -
What's even better is that this seems to work perfectly in IE 7 (UPDATE: it seems that this does not work in IE6, so it will be a bit before this is usable on any large scale. However, it is still good to understand these obscure CSS selectors because you may come across them as a professional, especially if IE8 successfully puts IE6 out of the top 5 browsers), [Firefox](http://getfirefox.com), [Opera](http://opera.com), and Safari. Now I know what you're thinking. Where in the world am I going to use this?

Perhaps we could use something like this to do something to all rows in a table except the first row? What if we knew the next element after an <img> tag was going to be a custom caption that we wanted to place properly underneath our image? The only problem I see is that this couples the HTML and CSS more than we might like sometimes. However, there are many places that probably would benefit from something this simple.  **Simplicity rules**. Now that you know how to use it I have every confidence you can come up with a brilliant use for it.

What ideas do you have to use this CSS gem? What other selectors have you found useful but don't often see?
