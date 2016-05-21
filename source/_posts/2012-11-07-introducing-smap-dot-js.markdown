---
layout: post
comments: true
title: Introducing smap.js, a forward polyfill for ES6 Maps
slug: introducing-smap-dot-js
status: publish
date: 2012-11-07 10:58
categories: javascript
---

I've been programming a lot in languages other than JavaScript, and one thing I've noticed is the convenience methods that each language's core library provides.
This seems to be a common theme in JavaScript (`String` and `Date` have very few utilities, `Array` finally got some love with ES5).

## Purpose of smap.js
Boris Smus [makes an excellent suggestion](http://smus.com/how-the-web-should-work/) for moving the web forward: *forward polyfills*. That's exactly my intention with [smap.js](http://eriwen.github.com/smap.js/).
I'm hoping you will think this is a great idea, and help [discuss how ES6 Map should work](https://github.com/eriwen/smap.js/issues) or submit pull requests with your own ideas.

This is for *everyone*, not just JavaScript gurus. Standards bodies want feedback from developers like you.

One could argue that you could just add to `Object.prototype`, but that is known to cause *unintended side effects* that are often tough to track down.
The fact that we can stop bastardizing `Object` for dictionary-like behavior is exciting.

## What smap.js does
[smap.js](http://eriwen.github.io/smap.js/) includes a polyfill based on [my ES6 Map Shim](https://github.com/eriwen/es6-map-shim) for environments without a Map implementation that conforms to the (incomplete) ES6 spec; then it adds a number of
convenience methods to help you work with `Map`s more easily. Here are some examples:

{% highlight js linenos=table %}
var map = new Map();
map.set('foo', 'bar');
map.set(0, 42);

// Filter map by a function
map.filter(function(key, value, index) {
   return typeof key == 'string';
});
=> new Map([[0, 42]])

// Merge Maps
map.merge(new Map([['baz', 'thing']]));
=> new Map([[0, 42], ['baz', 'thing']])

// map.get with a default
map.fetch('NON_EXISTANT', 'default');
=> 'default'

// Destructive filter (inline map delete)
map.reject(function(key, value) {
  return typeof key == 'string';
});
map.has('thing');
=> false

// Remove all items
map.clear();

// Check if Map has no items
map.isEmpty();
=> true
{% endhighlight %}

## Getting Started
You can install this via npm for [node.js](http://nodejs.org) v0.8+

```plain
npm install smap
```

For browsers, [download smap.js](https://github.com/eriwen/smap.js/blob/master/smap-shim.min.js) and include in your HTML:

{% highlight html %}
<script type="text/javascript"
    src="https://raw.github.com/eriwen/smap.js/master/smap-shim.min.js"></script>
{% endhighlight %}

smap.js works in IE7+, Google Chrome, Firefox, Safari, Opera, and Node.JS and uses my [es6-map-shim](https://github.com/eriwen/es6-map-shim). It also works in IE and PhantomJS if you include the [es5-shim](https://github.com/kriskowal/es5-shim) first.

## Your turn!
[Go to the GitHub project page](https://github.com/eriwen/smap.js) and tell me what you think, even if it's just to say you think it's a good idea.

If enough people like this idea, we can submit a proposal to TC39 to have this standardized or perhaps get implementations from browser vendors.

Let's move the web forward.
