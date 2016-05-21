---
date: '2008-08-13 05:00:58'
layout: post
comments: true
slug: js-stack-trace
status: publish
title: A Javascript stacktrace in any browser
wordpress_id: '71'
categories: javascript
---

<div class="alert alert-success">This is now a mature <a href="https://github.com/stacktracejs" title="stacktrace.js on GitHub">project on GitHub</a>! Please submit comments/issues there.</div>

Chances are that if you've done any significant Javascript work, you've run into a situation where part of the debugging process could be much improved if you just had the function call stack.

I'm going to give you some ways of doing this with and without the popular [Firebug](http://getfirebug.com) extension and have some examples of their uses.

## Without Firebug and friends? Using IE?

Sometimes bad things only happen in other browsers. Here's how to create/log your own stack trace. Put this code in an accessible place in your Javascript file(s) and call the _printStackTrace()_ function inside any function.

{% highlight javascript linenos=table %}
function printStackTrace() {
  var callstack = [];
  var isCallstackPopulated = false;
  try {
    i.dont.exist+=0; //doesn't exist- that's the point
  } catch(e) {
    if (e.stack) { //Firefox
      var lines = e.stack.split('\n');
      for (var i=0, len=lines.length; i&lt;len; i++) {
        if (lines[i].match(/^\s*[A-Za-z0-9\-_\$]+\(/)) {
          callstack.push(lines[i]);
        }
      }
      //Remove call to printStackTrace()
      callstack.shift();
      isCallstackPopulated = true;
    }
    else if (window.opera &amp;&amp; e.message) { //Opera
      var lines = e.message.split('\n');
      for (var i=0, len=lines.length; i&lt;len; i++) {
        if (lines[i].match(/^\s*[A-Za-z0-9\-_\$]+\(/)) {
          var entry = lines[i];
          //Append next line also since it has the file info
          if (lines[i+1]) {
            entry += ' at ' + lines[i+1];
            i++;
          }
          callstack.push(entry);
        }
      }
      //Remove call to printStackTrace()
      callstack.shift();
      isCallstackPopulated = true;
    }
  }
  if (!isCallstackPopulated) { //IE and Safari
    var currentFunction = arguments.callee.caller;
    while (currentFunction) {
      var fn = currentFunction.toString();
      var fname = fn.substring(fn.indexOf(&amp;quot;function&amp;quot;) + 8, fn.indexOf('')) || 'anonymous';
      callstack.push(fname);
      currentFunction = currentFunction.caller;
    }
  }
  output(callstack);
}

function output(arr) {
  //Optput however you want
  alert(arr.join('\n\n'));
}
{% endhighlight %}

It's ugly, but this works for the latest versions of IE, Firefox, Opera, and Safari. Firefox and Opera give you file names and line numbers when they can, but I couldn't find a mechanism to get the same from IE and Opera. Hopefully the inline comments describe enough of what is going on. If not, ask :).

## Try it out

<script type="text/javascript">
// Global functions for the stacktrace.js example
function foo() { var blah; bar("blah"); }
function bar(blah) { var stuff; thing(); }
function thing() { if (true) { var st = printStackTrace(); alert(st.join("\n\n")); } }
</script>
Give it a shot by <a href="javascript:foo();">clicking here</a>. It will run the snippet below.

{% highlight javascript linenos=table %}
function foo() {
    var blah;
    bar('blah');
}

function bar(blah) {
    // some code
    thing();
}

function thing() {
    if (true) { //your error condition here
        printStackTrace();
    }
}

foo();
{% endhighlight %}

## Obvious easy way: Firebug, Chrome Dev Tools, Dragonfly etc.

You can easily get a stack trace at any time by calling `console.trace()` in your Javascript or in the Firebug console.

> Not only will it tell you which functions are on the stack, but it will include the value of each argument that was passed to each function.

This is obviously the best way to go if you are using [Firefox](http://getfirefox.com).

Furthermore, these tools allow you to dig deeper. Of course, we can't count on them for ALL situations.

## Conclusion

I hope you find this useful. If you have any suggestions/improvements I'd like to hear them! Also all kidding aside, I worked pretty hard on this function, so I'd really appreciate if you'd help me share this with more people. Thanks!
