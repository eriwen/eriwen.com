---
layout: post
title: Gradle JavaScript Plugin, 1.0
slug: javascript-plugin-1-dot-0
date: 2012-06-27 04:00
comments: true
categories: gradle
status: publish
---

Last week, I released version 1.0 of my [JS Plugin](http://git.io/gradlejs) for [Gradle](https://gradle.org). It's come a long way since its inception, and I wanted to explain what it does and where it's headed in the future.

## Features of the JS plugin

I'd argue the most common (and important) task a build can do with regard to JavaScript is [reduce HTTP requests](http://developer.yahoo.com/performance/rules.html) to improve site speed, so that's the first thing I tackled with the plugin.

{% highlight groovy %}
combineJs {
    source = javascript.source.libs.js.files + javascript.source.custom.js.files
    dest = file("${buildDir}/all.js")
}

// Uses Google Closure Compiler
minifyJs {
    // Tell the task to consume the output of combineJs
    source = combineJs
    dest = file("${buildDir}/all-min.js")
}

def version = "whatever"
gzipJs {
    source = minifyJs
    dest = file("${buildDir}/all-${version}.min.js")
}
{% endhighlight %}

You might also want to make sure your code is linted to prevent possible bugs, so I've included [JSHint](http://jshint.com) support:
{% highlight groovy %}
jshint {
    source = javascript.source.custom.js.files
    dest = file("${buildDir}/jshint.out")
}
{% endhighlight %}

There are a bunch of JS documentation tools out there, and I have started by adding support for [JSDoc 3](https://github.com/micmath/jsdoc)
{% highlight groovy %}
jsdoc {
    source = javascript.source.custom.js.files
    destinationDir = buildDir
}
{% endhighlight %}

Finally, Nicolas Zakas developed a tool that converts Java properties to JSON or JSON-P called [Props2Js](https://github.com/nzakas/props2js):
{% highlight groovy %}
props2Js {
    source = file("${projectDir}/src/test/resources/test.properties")
    dest = file("${buildDir}/props.jsonp")
    props {
        type = 'jsonp'
        functionName = 'callbackFn'
    }
}
{% endhighlight %}

I have a bunch of examples of things you can do without a plugin, like run QUnit tests with [PhantomJS](http://phantomjs.org) or upload JS files to a CDN as part of my [stacktrace.js build](https://github.com/eriwen/javascript-stacktrace/blob/master/build.gradle) and [eriwen.com build](https://github.com/eriwen/eriwen.com-v3/blob/master/build.gradle).

You can also see detailed tasks usage and options on the [Gradle JS project site](http://eriwen.github.io/gradle-js-plugin/).

## Screencast Intro

I have recorded a screencast where I combine, minify and version/gzip JavaScript for a small site, then update all references to the new JS file version and upload to Amazon S3. Those in RSS readers can check this [screencast on Youtube](http://youtu.be/3sOROlHTCvo).

<iframe class="center" width="760" height="570" src="http://www.youtube.com/embed/3sOROlHTCvo" frameborder="0" allowfullscreen></iframe>

This is the very same process as what I do for this site.

## Pros and cons of this tool

Most of the good and the bad come from having tighter JVM integration than tools like [Grunt](http://gruntjs.com). Gradle can:

* More easily take advantage of tools written in Java, JRuby, Groovy, Scala or other JVM languages.
* There are a bunch of ant tasks already written that Gradle can use out-of-the-box
* Better outputs (like JUnit XML for tests) for [Continuous Integration](/tools/continuous-integration-for-javascript/)

The limitations and downsides I see are:

* NodeJS integration. There is no reason you can't run `node` from Gradle, but integration won't be better than strings in and strings out until we have decent Node-JVM integration.
* While Gradle can use ant tasks, Grunt and Maven have a larger set of contributed tasks and scripts because they have larger communities.
* JS developers tend to back away from Groovy/Java tools, even though Gradle is just a DSL.

I strive to build a tool that's easy to use for many types of developers, yet is as flexible and powerful as I can make it.

## The Future

The Gradleware team is working on a ton of features that support JavaScript, and I plan on taking full advantage of them (most of the features are already in the [nightly build](https://gradle.org/nightly)). Gradle will be able to download JS dependencies just like it does with Java dependencies. It will also have might tighter integration with [Rhino](http://www.mozilla.org/rhino/).

* With these new features, I hope to solve JS dependency resolution. I have help from [Joshua Newman](https://github.com/jnewman) to include [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD) and [CommonJS](http://www.commonjs.org/) in the next version of the plugin. If you're interested, you should [subscribe to the issues](https://github.com/eriwen/gradle-js-plugin/issues/21) or provide feedback.
* Testing is another gap I hope to close soon. I have plans to incorporate automated testing via Rhino+QUnit/Jasmine/Other and [JSTestDriver](https://github.com/eriwen/gradle-js-plugin/issues/10).
* I'd like to give some automatic benefits to projects that adhere to common conventions like folder structure. We can auto-wire source declarations and configure tasks.
* Finally, [source maps](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/) is a small but useful and easy-to-implement feature.

If you feel like something is missing, you can always [email me](mailto:me@eriwen.com) or [submit an issue on GitHub](https://github.com/eriwen/gradle-js-plugin/issues).
