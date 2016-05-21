---
date: '2010-05-20 04:00:37'
layout: post
comments: true
slug: testing-with-mrunit
status: publish
title: Testing your Hadoop jobs with MRUnit
wordpress_id: '1137'
categories: hadoop
---

Last Tuesday I gave a short presentation at the new [Boulder Hadoopers Group](http://www.meetup.com/Boulder-Denver-Hadoop/) about testing Hadoop jobs with MRUnit. You will have to know what [Hadoop](http://hadoop.apache.org/) is and how to read [Groovy](http://groovy.codehaus.org/) code to fully understand it. I am including the important notes on the slides as well.

**If your browser doesn't support flash, check out the [slides at slideshare](http://www.slideshare.net/emwendelin/testing-hadoop-jobs-with-mrunit)**

<iframe src="http://www.slideshare.net/slideshow/embed_code/4073730" width="595" height="497" frameborder="0" marginwidth="0" marginheight="0" scrolling="no"></iframe>

## Why use MRUnit?

Testing a Hadoop job requires a lot of effort not related to the job. You must configure it to run locally, create a sample input file, run the job on your sample input, and then compare to an expected output file. This not only takes time, but makes your tests run very slow due to all the file I/O.

[MRUnit](https://mrunit.apache.org/) is:

> a unit test library designed to facilitate easy integration between your MapReduce development process and standard development and testing tools such as JUnit

With MRUnit, there are no test files to create, no configuration parameters to change, and generally less test code. You can cut the clutter and focus on the meat of your tests.

## The Good

Hadoop tests are much simpler to write using MRUnit. Here's an example of entire test class:

{% highlight java %}
class ExampleTest() {
  private Example.MyMapper mapper
  private Example.MyReducer reducer
  private MapReduceDriver driver

  @Before void setUp() {
    mapper = new Example.MyMapper()
    reducer = new Example.MyReducer()
    driver = new MapReduceDriver(mapper, reducer)
  }

  @Test void testMapReduce() {
    driver.withInput(new Text('key'), new Text('val'))
        .withOutput(new Text('foo'), new Text('bar'))
        .runTest()
  }
}
{% endhighlight %}

You can test map and reduce separately, of course. You can also easily verify counters:

{% highlight js %}
driver.withInput(...)
driver.run()

def counters = driver.getCounters()

assertEquals(1, counters.findCounter('foo', 'bar').getValue())
{% endhighlight %}

There's a mess of other cool stuff like _MockReporter_ and _MockInputSplit_, but I mostly haven't found a use for them or time to make a simple example.

## The Bad

Before I tell you to go grab the latest distribution, I want you to know some of the problems we've encountered in the "real-world".

  1. First and foremost, MRUnit is **not useful for streaming jobs**. If you only write streaming map-reduce jobs, you'll have to do it the old fashioned way
  2. Calling _driver.runTest()_ doesn't tell you what the failure was (it just throws an AssertionError). Instead, call _def output = driver.run()_ and assert
  3. The **documentation sucks**. There's only one example and the rest you basically have to figure out from the API
  4. _setup()_ is called for the new Hadoop API (mapreduce packages) but not the old API (mapred packages). You have to call it yourself if you need it
  5. Finally, tests reuse the same JVM. So **if you're accidentally maintaining state in your job, you will be bitten!**

## Conclusion

MRUnit makes writing tests for Hadoop easier. It has drawbacks, but they are far outweighed by the benefits.

**[Grab the latest MRUnit JAR](https://mrunit.apache.org/general/downloads.html)**

By the way, here's how you test a streaming job:
{% highlight bash %}
./myMapper.py < test.input | sort | ./myReducer.py > actual.out
diff expected.out actual.out
{% endhighlight %}
