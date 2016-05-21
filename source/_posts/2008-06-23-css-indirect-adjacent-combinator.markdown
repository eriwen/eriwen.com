---
date: '2008-06-23 16:28:36'
layout: post
comments: true
slug: css-indirect-adjacent-combinator
status: publish
title: About the indirect adjacent combinator (~) in CSS
wordpress_id: '57'
categories: css
---

Similar to the [CSS Adjacent Sibling Combinator](/css/css-adjacent-sibling-selectors/) that I wrote about before, the _indirect_ adjacent combinator is pretty nifty and **supported by IE7+, FF2+, Opera 9.5+, Safari 3+, and even Konqueror.** It is actually part of the CSS3 spec but it's surprisingly well supported. Here's how to use it and what it does:

## Using the CSS Indirect Adjacent Combinator

{% highlight css %}
h3 ~ p {
  color: #FFFFFF;
  padding-left: 20px;
  border-left: 3px solid;
}
{% endhighlight %}

<img src="/images/tilde.png" alt="CSS Indirect Adjacent Combinator" class="img-left" width="80" height="80" />This would affect each `<p>` element that is a sibling of a preceding `<h3>` element. This is different from the Adjacent Sibling Combinator (+) in that it **affects all following <p> siblings instead of just the immediate sibling**. Let us see an example:

## CSS Indirect Adjacent example

Example 1: Adjacent Sibling combinator (h4 + p) test:

- - -

<div id="adjacent">
<h4>Heading 4</h4>
<p>Paragraph 1 - This should be bold and red</p>
<p>Paragraph 2 - This should NOT be red</p>
</div>

- - -

Example 2: _Indirect_ Adjacent Sibling combinator (h4 ~ p) test:

- - -

<div id="indirect-adjacent">
<h4>Heading 4</h4>
<p>Paragraph 1 - This should be bold and red</p>
<p>Paragraph 2 - This should also be bold and red!!</p>
</div>

- - -

Here is the CSS for the above example:
{% highlight css %}
.adjacent h4 + p,
.indirect-adjacent h4 ~ p {
    background-color: #CCC; color: #F00; 
}
{% endhighlight %}

Cool, right? So you see how you can use this instead of the (+) selector to apply styles to the elements you want in basically everything except IE6-! This is a good example of something used for _progressive enhancement_ that should be used to add detail to elements to give your users more information.

Update: Sorry for the name confusion. The [latest draft of the CSS3 spec](http://www.w3.org/TR/css3-selectors/#general-sibling-combinators) calls this the "General Sibling Combinator" and I didn't think it had changed from "Indirect Adjacent Combinator" when I first learned of it so I used the latter. My apologies!

Have you ever used this? What was your experience and what ideas do you have for this CSS gem?
