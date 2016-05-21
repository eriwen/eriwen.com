---
date: '2011-08-31 04:45:52'
layout: post
comments: true
slug: continuous-integration-for-javascript
status: publish
title: Continuous Integration for JavaScript
wordpress_id: '1364'
categories: tools
---

[Jenkins](http://jenkins-ci.org) is a CI tool that is often used for running tests and code analysis after every code push.
There are a lot of benefits that we as a community are not taking advantage of for our web (CSS, JS, etc) code.
In this article I'm going to walk you through setting up automated building and testing for a JavaScript project.

NOTE: The steps outlined are generally Linux/Mac centric, I don't go into depth on Windows setup, but it shouldn't be much different using [Cygwin](http://cygwin.com).

## CI Your JS?

Aside from the traditional benefits you see from your compiled code, there are some very compelling reasons:

* Automate versioning, combining, minifying, and gzipping files
* Run automated tests and get reports, keeping the codebase **maintainable**
* Run static analysis tools like the closure compiler or jshint
* Auto-deploy files (to S3, say) if our build passes
* Tag and other special stuff for release builds
* And that's not all!^TM We can also hook in Selenium tests, [CSS Lint](http://csslint.net) for CSS, and more

## Jenkins setup

Downloading and running Jenkins is incredibly easy. Just [download Jenkins](http://mirrors.jenkins-ci.org/war/latest/) and run:
{% highlight bash %}
wget http://mirrors.jenkins-ci.org/war/latest/jenkins.war
java -jar jenkins.war
{% endhighlight %}

There are also native installers for most environments.

Now point your browser to `http://localhost:8080` to see it running.

Nailed it! Now we have a CI server!

## Prerequisites

If we're going to be using [git](http://git-scm.org) and [gradle](https://gradle.org), we'll need to install them ([Windows Git installer](http://code.google.com/p/msysgit/downloads/list)).
{% highlight bash %}
sudo yum install git-core  # CentOS/RedHat/etc
sudo apt-get install git   # Debian/Ubuntu/etc
sudo port install git-core # MacPorts
brew install git      # Homebrew
{% endhighlight %}

You can run this script, but lately I've really liked using [GVM](http://gvmtool.net/) for managing JVM-centric CLI tools.
{% highlight bash %}
# Replace "XX" with the latest version of Gradle [http://gradle.org]
wget http://services.gradle.org/distributions/gradle-XX-bin.zip
sudo mv gradle-1.0* /usr/local
sudo unzip /usr/local/gradle-XX-bin.zip
sudo ln -s /usr/local/gradle-XX-bin /usr/local/gradle
{% endhighlight %}

To tell Jenkins where to find Gradle, we go to _Manage Jenkins > Configure System_ from the top page.
Add a name and enter your GRADLE_HOME (/usr/local/gradle if you followed the instructions above). It should look like this:

<img src="/images/jenkins-gradle-config-1.png" alt="Jenkins Gradle Setup" class="img-center" />

## Setup a CI job

As an example, I'm going to use my [stacktrace.js project on GitHub](https://github.com/eriwen/javascript-stacktrace).
Even though it's a small JS library, almost all of the setup can be used for any type of project.

First, we want to install a few plugins that will help us out. We'll need [Git](http://git-scm.org) to pull down the
code and [Gradle](http://www.gradle.org) to build it. You'll **want the Git, Gradle, and Violations plugins installed**.
It's pretty easy to figure out, but hit up the [Jenkins wiki](https://wiki.jenkins-ci.org/display/JENKINS/Use+Jenkins) if you get stuck.

We want to create a new job that runs analysis on our JS and runs our tests. Click _New Job_ on the Jenkins sidebar and you'll see the setup form.

## Checking out and building a repo

Under _Source Code Management_ choose _Git_ and enter `git://github.com/eriwen/javascript-stacktrace.git` for the repo location and `master` for the branch. It'll look something like this:
<img src="/images/jenkins-git-1.png" alt="Jenkins Git Setup" class="img-center" />

For the _Build_ section of the setup, we want to run the `minify` build target from Gradle. You'll also want to enter the location of the build file as `build.gradle`. Don't worry about the contents of our build script right now, I have a slew of blog posts in-progress that explain it. [Stay tuned](/feed/).
<img src="/images/jenkins-gradle-build.png" alt="Jenkins Gradle Minify" class="img-center" />

Now would be a good time to click _Save_ at the bottom and then click _Build Now_ on the sidebar for the job.
You should see Jenkins checkout, pull down the latest Closure Compiler, and use it to minify stacktrace.js.

## Running JS unit tests with PhantomJS

The days are past when you have to open a browser to see if your JS is generally working.
[PhantomJS](http://www.phantomjs.org/) is a headless WebKit browser that lets us interact with web pages
(click links, pull from localStorage, etc.) without the browser window! This will let Jenkins run a browser with
our tests and report the result. To follow along with the example, [download and install PhantomJS](http://code.google.com/p/phantomjs/downloads/list) to `/usr/local/bin`
(on Mac OS I just `sudo ln -s /Applications/phantomjs.app/Contents/MacOS/phantomjs /usr/local/bin/phantomjs`).

We also need to update the Build part of the configuration by telling gradle to run the `test` target.
<img src="/images/jenkins-gradle-1.png" alt="Jenkins Gradle Setup" class="img-center" />

Gradle is now setup to run the [QUnit](http://docs.jquery.com/Qunit) tests in the project, but we need to tell Jenkins where to find the test reports. Easy! I encourage you to check out the [source of build.gradle](https://github.com/eriwen/javascript-stacktrace/blob/master/build.gradle) if you want to know how this is setup. It's really quite interesting.
<img src="/images/jenkins-junit-1.png" alt="Jenkins JUnit Setup" class="img-center" />

Save and try that build again to bask in automated JavaScript testing awesomeness.

## Finding potential bugs with JSHint

I'm a big fan of [JSHint](https://github.com/jshint/jshint/) and I think it's worthwhile to have it run on every `git push`.
Here's how to add that. To follow the example, you'll have to install [NodeJS](https://github.com/joyent/node/wiki/Installation) and the jshint module from [npm](http://npmjs.org):
{% highlight bash %}
brew install node      # Homebrew
port install node      # MacPorts
apt-get install nodejs # Debian-based

npm install jshint -g
{% endhighlight %}

Now we just need to tell Jenkins to run jshint as well as our tests and where to find the JSHint report.
The gradle build puts it in `target/jshint.xml`. It should look like this:
<img src="/images/jenkins-violations-1.png" alt="Jenkins Violations Setup" class="img-center" />
<img src="/images/jenkins-jshint-1.png" alt="Jenkins JSHint Setup" class="img-center" />

One more _Build Now_ and we have a fully functioning JavaScript build. You'll also see graphs with test and jshint results on the job page and can drill down into details.

I have really loved my CI setup for my web projects as well as my JVM-based ones. Now you have the power to go
build a cool CI system for your projects. You can read more of my thoughts on this from my [notes from my pursuit of the perfect front-end build](/tools/perfect-front-end-build/). Enjoy!
