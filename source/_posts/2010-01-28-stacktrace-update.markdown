---
date: '2010-01-28 04:00:10'
layout: post
comments: true
slug: stacktrace-update
status: publish
title: Javascript Stacktrace update
wordpress_id: '1050'
categories: javascript
---

I started a [Javascript Stacktrace project](/javascript/js-stack-trace/) back in August 2008. The idea was to give additional debugging power to browsers where you don't have good tools to work with. I'd like to give you an update on where the project is today.

Lately, I've been working on updating my old script. Since it was written, we've seen lots of major browser releases and the introduction of the V8 Javascript engine used by [Google Chrome](https://www.google.com/chrome).

## Updated browser compatibility

Browsers that are fully-supported and well-tested:

  1. Firefox (and Iceweasel) 0.9+
  2. UPDATE: Chrome 1+ now perfectly supported
  3. Safari 3+
  4. IE 5.5+
  5. Opera 9+
  6. Konqueror 3.5+
  7. K-Meleon 1.5.3+
  8. Epiphany 2.28.0+

Browsers that are supported in almost all cases but not as well-tested:

  1. Chrome 1+ - One bug (feature?) that may be in Chrome reporting functions as anonymous when they aren't. HOWEVER, Chrome's stack gives us line numbers AND column numbers, so we can see exactly where our problem is - even in minified Javascript! Sweet! Chrome 1+ now fully supported.
  2. Opera 7-8 - Opera is dead to me now. Opera 10+ has removed the error.stack info we needed and introduced error.stacktrace, but it seems very unstable. Argh.

More info about compatibility can be shown with the [BrowserShots of the test suite](http://browsershots.org//js/javascript-stacktrace/test-stacktrace.html).

## Now socially coded

I'm not going to post the code here because the source and tests are now on the [javascript-stacktrace project on GitHub](https://github.com/eriwen/javascript-stacktrace). You can download it [here](https://github.com/eriwen/javascript-stacktrace/downloads).

Follow it, file bugs, and make comments there. If you have improvements to make, please fork the project and then contact me or do a "push request". I'll make sure you get credit ;)

UPDATE: [Øyvind Sean Kinsey](http://kinsey.no/blog) has added memoization (caching the implementation) for the mode and XHR bits as well as the ability to pass an **existing Javascript Error** and get a stacktrace.  We're working on tests and you should see project updates soon. Thanks, Øyvind!

{% highlight js %}
var lastError;
try {
    // error producing code
} catch(e) {
   lastError = e;
   // do something else with error
}

// later...
printStackTrace({e: lastError}); //Returns stacktrace from lastError!
{% endhighlight %}

## Try it out!
<script type="text/javascript">
// Global functions for the stacktrace.js example
function foo() { var blah; bar("blah"); }
function bar(blah) { var stuff; thing(); }
function thing() { if (true) { var st = printStackTrace(); alert(st.join("\n\n")); } }
</script>

The code is in use on my blog, <a href="javascript:foo();">click here</a> to give it a try.

{% highlight js %}
function foo() {
    var blah;
    bar("blah");
}

function bar(blah) {
    var stuff;
    thing();
}

function thing() {
    if (true) { //your error condition here
        var st = printStackTrace();
        alert(st.join("\n\n"));
    }
}

foo();
{% endhighlight %}

Random note: one cool suggestion I saw was to assign printStackTrace to `window.onerror`. Pretty brilliant if you ask me.

I want to thank the guys who contributed to the script: **[Luke Smith](http://lucassmith.name), Loic Dachary and Johan Euphrosine.**

I could use a bit of help getting the Chrome and Opera bugs worked out. I'm sure some of you guys who remember how to write software can help. Suggestions and whinings are welcome as long as they don't get out of hand in the comments.

[stacktrace.js on GitHub](https://github.com/eriwen/javascript-stacktrace)
