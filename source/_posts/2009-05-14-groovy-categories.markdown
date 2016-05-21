---
date: '2009-05-14 08:25:38'
layout: post
comments: true
slug: groovy-categories
status: publish
title: Using Groovy Categories to override operators
wordpress_id: '793'
categories: groovy
---

I recently ran into a case where I was violating the DRY principle by having to encode part of a string every time I added to it. After some digging I found the solution: [Groovy Categories](http://docs.codehaus.org/display/GROOVY/Groovy+Categories).

## A bit of Groovy background

A couple key features of [Groovy](http://groovy.codehaus.org/) are that everything is an object and that operators are just syntactic sugar for calling methods on the objects. What's cool about this is that with Groovy you can override the default behavior of these operators for certain classes. For example, `4 + 2` in Groovy really means `4.plus(2)`

## How to implement/override operators in Groovy

Groovy allows you to override a LOT of stuff, including final methods and operators. If I want to override a method on the `String` class, all I need to do is:

{% highlight java %}
String.metaClass.plus {
    //It is a special term for the argument passed (if there is only 1)
    String stringToEncode = it
    //delegate is a special term for the caller of the method
    delegate << URLEncoder.encode(it, 'UTF-8')
}

String first = "my delegate "
String second = "twitter @eriwen"
//prints "my delegate twitter+%40eriwen"
println first + second
{% endhighlight %}

Notice that it (intentionally) only encodes the second `String`. Check out the list of [operators and associated methods](http://groovy.codehaus.org/Operator+Overloading). This is great, but I need to restrict this to code blocks I so choose. That's where Groovy Categories come in.

## Overriding with Categories

Groovy Categories allow you to add functionality to any class at runtime. This means that you can add in methods to final classes (like `java.lang.String`). In this case I just want to override a method instead of adding one.

{% highlight java %}
class MyUtils {
  //Takes 2 java.lang.Strings and returns a String - TYPES ARE OPTIONAL
  static String plus(String first, String second) {
    //Concatenates the Strings and returns
    first << URLEncoder.encode(second, encoding)
  }
}

//my other class in another file...
import MyUtils

class MyOtherClass {
  String first = "first"
  String second = "to be encoded"
  use (MyUtils) {
    // This will now encode value
    list << first + second
  }
}
{% endhighlight %}

Note that Groovy defaults to `GString`s, so you can't just use `def actuallyMyString`. 

How would you make this even _more_ Groovy? Enjoy!
