---
date: '2010-02-18 04:00:09'
layout: post
comments: true
slug: speech-bubble
status: publish
title: A CSS-only speech bubble
wordpress_id: '988'
categories: css
---

I generally try to avoid using images or Javascript when I can accomplish good presentation with CSS. In this case, I wanted to apply [CSS shapes](http://www.howtocreate.co.uk/tutorials/css/slopes) to make a clever speech bubble. 

## The problem with obtuse triangles and CSS

[Obtuse triangles](http://mathworld.wolfram.com/ObtuseTriangle.html) are slightly more complicated, since you can only create acute and right triangles with the CSS shapes method linked above. Therefore I created two triangles: a positive (black) right triangle, and then a negative (white) triangle to emulate an obtuse triangle.

## The HTML

{% highlight html %}
<blockquote class="bubble">
    <!-- Black (positive) triangle -->
    <span class="arrow">
        <!-- White (negative) triangle -->
        <span> </span>
    </span> 
    Content inside bubble
</blockquote>
{% endhighlight %}

Any tag combination will work as long as the CSS shape elements are _inline_ elements. 

## The CSS

The two key parts of the CSS are the rounded corners (available in major, non-IE browsers) and the arrow that extends from the bubble. 

{% highlight css %}
.bubble { 
    margin: 8px 0;
    padding: 10px; 
    position: relative; 
  /* Adjust these to taste */
    width: 175px; 
    border: 2px solid #000; 
    -moz-border-radius: 15px; 
    -webkit-border-radius: 15px; 
    border-radius: 15px; /* Opera and Chrome */
}
.bubble .arrow { 
    border-bottom: 0px solid #FFF; 
    border-right: 20px solid #000; 
    border-top: 15px solid #FFF; 
    position: absolute; 
    left: -20px; 
    top: 5px; 
    height: 0; 
    width: 0; 
    line-height: 0; 
}
.bubble .arrow span { 
    border-bottom: 0px solid transparent; 
    border-right: 20px solid #FFF; 
    border-top: 8px solid transparent; 
    width: 0; 
    height: 0; 
    line-height: 0; 
    position: absolute; 
    left: -2px; 
    top: -8px; 
}
{% endhighlight %}

After all this, we have:

<img src="/images/bubble.png" alt="CSS Bubble image" class="img-center" />

I haven't done so here, but you can can create more interesting elliptical borders with:
{% highlight css %}
    padding: 25px; /* <- increase padding to avoid text overlap of the ellipse */
  /* attribute: width / height */
    -moz-border-radius: 60px / 15px; 
    -webkit-border-radius: 60px / 15px; 
    border-radius: 60px / 15px;
{% endhighlight %}

Note that Opera uses _border-radius_ and that Safari/Chrome does not support percentages. I know this doesn't look as pretty in IE, but it's a neat "progressive enhancement". This might be a great idea for comments, twitter statuses or sub-headings.

There probably is a clever way to inherit a transparent color from a parent element, but I didn't really take the time to dig into it. If you have improvements, I'd love to hear them.
