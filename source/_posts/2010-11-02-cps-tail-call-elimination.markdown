---
date: '2010-11-02 01:00:44'
layout: post
comments: true
slug: cps-tail-call-elimination
status: publish
title: Continuation-passing and tail call elimination in Javascript
wordpress_id: '1199'
categories: javascript
---

I've been spending a lot of time recently tinkering with different constructs and methodologies in Javascript, and one of the most fascinating things I've come across is [Spencer Tipping](http://spencertipping.com/blog/)'s use of continuation-passing style.

It's ok if you aren't familiar with CPS, but I think anyone hoping to make the cognitive leap to [functional programming](http://en.wikipedia.org/wiki/Functional_programming) should study it. As a bare miniumum, you need to know that a continuation is:

> [a reification of] an instance of a computational process at a given point in the process's execution

Therefore, [continuation-passing style](http://en.wikipedia.org/wiki/Continuation-passing_style) is just:

> a **style of programming** in which control is passed explicitly in the form of a continuation

**NOTE:** I have replaced my crappy examples just below with Outis's much more reasonable (and correct) ones. I take no credit for the simple CPS code below. Thank you Outis and David for the suggestions.

Consider the naive implementation of the recursive fibonacci function:
{% highlight javascript %}
function fib(n) {
    if (n < 1) {
        return 1;
    } else {
        return fib(n-2) + fib(n-1);
    }
}
{% endhighlight %}

Then, identify function calls and returns. For each such point, create a continuation and pass it to the function call or return it. For example, the continuation for `fibr(n-1) + fibr(n-2)` is:
{% highlight javascript %}
function(x) {
    return x + fib(n-2);
}
{% endhighlight %}

and you get:
{% highlight javascript %}
function cpsFib(n, _return) {
    if (n <= 1) {
        return _return(1);
    } else {
        return cpsFib(n-2, function(a) {
            return cpsFib(n-1, function(b) {
                return _return(a+b);
            });
        });
    }
}
{% endhighlight %}

Apply this process to the linear recursive fibonacci function and you get:
{% highlight javascript %}
function cpsFib(n, prev, cur, _return) {
    // Key component: call escape function when done
    if (n < 2) {
        return _return(cur);
    }
    return cpsFib(--n, cur, cur + prev, _return);
}
// Note the use of an identity function here
cpsFib(1000, 0, 1, function(x) {return x});
{% endhighlight %}

The only problem with this, however, is that **Javascript engines to not optimize tail recursion**, so calling: _fibonacci_cps(10000)_ would cause a _StackOverflowError_ in some browsers.
{% highlight javascript %}
function() {
	return [1000, 0, 1,
		function() { return [999, 1, 1,
			function() { return [998, 1, 2,
				... ]]
			}
		}
	];
}
{% endhighlight %}

However, by adding to Function.prototype and changing the way we pass continuations, **we can fix this problem.**
{% highlight javascript linenos=table %}
// Function prototypes heavily inspired by Spencer Tipping's js-in-ten-minutes:
//   https://github.com/spencertipping/js-in-ten-minutes
Function.prototype.tail = function() {
	return [this, arguments];
}
// Tail-call optimization
Function.prototype.tco = function() {
	var continuation = [this, arguments];
	var escapeFn = arguments[arguments.length - 1];
	while (continuation[0] !== escapeFn) {
		continuation = continuation[0].apply(this, continuation[1]);
	}
	return escapeFn.apply(this, continuation[1]);
}

// Note the use of "Function.prototype.tail()"
function cpsFib(n, prev, cur, escapeFn) {
	if (n < 2) {
		return escapeFn.tail(cur);
	}
	return cpsFib.tail(--n, cur, cur + prev, escapeFn);
}

function identity(x) {return x}

// We pass the escape function instead of a reference to cpsFib
cpsFib.tco(1000, 0, 1, identity);
{% endhighlight %}

{% highlight javascript %}
// within while (continuation[0] !== escapeFn) {
[cpsFib, [1000, 0, 1, identity]]
[cpsFib, [999, 1, 1, identity]]
[cpsFib, [998, 1, 2, identity]]
[cpsFib, [3, 2.686e+208, 4.3467e+208, identity]]

// return escapeFn.apply(this, continuation[1]);
[identity, 4.34673e+208]
{% endhighlight %}

## How CPS and TCO can be practical

All this talk about styles and optimizations can sound rather like "over-engineering" to those of us who aren't familiar with these concepts. While it's a risk, good engineers will know when it is effective. Here's how I would recommend you use these concepts:

  1. Processing large structures in a recursive way, perhaps recursing through an Object or HTML tree of indeterminate depth
  2. You're adding functional methods to iterable objects (adding Array.prototype.map())
  3. Practicing uses of functional programming with Javascript

## Conclusion

Knowing how to use functional techniques in Javascript will be more valuable as it moves to the server-side (due to the rising popularity of [node.js](http://nodejs.org/)) because doing more actual computation will be acceptable instead of blocking a UI.

I learned a lot from Spencer's write-up [Javascript in Ten Minutes](https://github.com/spencertipping/js-in-ten-minutes), and would recommend you check it out. I've also found reading [his other Javascript code](https://github.com/spencertipping) and comments very insightful.

Please share other uses of functional Javascript you've come across.
