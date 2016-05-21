---
date: '2011-02-03 03:00:50'
layout: post
comments: true
slug: griffon-jython-plugin
status: publish
title: Griffon, meet Jython
wordpress_id: '1132'
categories: python
---

I've come to love the [Python](http://python.org/) language for its elegant syntax combined with powerful constructs like comprehensions. [Jython](http://jython.org/) allows me to take Python to the next level by allowing it to interact with my existing JVM-compatible code. Now I want to extend that even further and allow myself (and you, of course) to integrate Jython with [Griffon](http://griffon.codehaus.org/), a framework for building desktop applications in [Groovy](http://groovy.codehaus.org/).

## Introducing the Jython plugin for Griffon

The Jython plugin enables compiling and running Jython code on your Griffon application. You don't even need to install Jython manually. A Jython REPL is available with access to your Groovy/Java classes if you use:

<code>griffon jython-repl</code>

You can even load Jython scripts on-the-fly by putting them in `MyGriffonApp/griffon-app/resources/jython`!

In the rest of the article, we are going to create a simple application that mixes Griffon and Jython using the Griffon-Jython plugin.

<img src="/images/jython-sample.png" alt="Jython Sample Application" class="img-center" />

## Getting started with griffon-jython

It's easy to setup Griffon, and you'll find [instructions here](http://griffon.codehaus.org/Installing+Griffon) and [downloads here](http://griffon.codehaus.org/Download). Once you're done, you can create a Griffon app and install the jython plugin by typing:

{% highlight bash %}
griffon create-app MyGriffonApp
cd MyGriffonApp
griffon install-plugin jython
{% endhighlight %}

Now that we've installed the Jython plugin, you can create a Jython class on your command-line:

{% highlight bash %}
# Creates MyGriffonApp/src/jython/com/mypkg/MyJythonClass.py
griffon create-jython-class com.mypkg.MyJythonClass
{% endhighlight %}

Let's create a Jython class that greets the user when a button is clicked.
{% highlight python %}
from com.mypkg import IGreeter

class MyJythonClass(IGreeter):
  def __init__(self):
    pass

  def greet(self, who, model):
    greeting = 'Hello %s from Jython!' % str(who)
    model.setOutput(greeting)
{% endhighlight %}

Jython classes are exposed to Griffon using an [Object Factory Pattern](http://en.wikipedia.org/wiki/Factory_method_pattern) as suggested in the [Definitive Guide To Jython, Chapter 10](http://www.jython.org/jythonbook/en/1.0/JythonAndJavaIntegration.html#using-jython-within-java-applications). Therefore, we create a Java (well, Groovy) interface that `MyJythonClass` will extend to allow Griffon to get at the proper method implementations. It sounds rather complicated, but it really is quite simple. Let's create the `IGreeter` interface to show you what I'm talking about:

{% highlight java %}
package com.mypkg

public interface IGreeter {
  // Same signature as our Jython method
  public void greet(String greetee, def model)
}
{% endhighlight %}

Our `greet()` method accepts a `String` (the textField input) and a model of unspecified type.

Griffon auto-generates MVC classes for you, so we can use those. You'll find them in the `MyGriffonApp/griffon-app/{models,views,controllers}` directories. We are going to change those for our app! Here is the aforementioned `Model`:

{% highlight groovy %}
package com.mypkg
import groovy.beans.Bindable

class MyGriffonAppModel {
    @Bindable String input = ''
    @Bindable String output = ''
}
{% endhighlight %}

Groovy implicitly creates `get/setInput()` methods and allows them to be bound (to the View textField value, e.g.). Here is that `MyGriffonAppView`:

{% highlight groovy %}
package com.mypkg

application(title:'Griffon Jython Sample', pack:true, locationByPlatform:true) {
  gridLayout(cols: 1, rows: 2)
  //Note the ID on this textField
  textField(id: "input", columns: 20)
  button("Click me!", actionPerformed: controller.handleClick)
  bean(model, input: bind {input.text})
}
{% endhighlight %}

Finally, the most critical part of our application that will interact with our Jython class, the `MyGriffonAppController`:

{% highlight groovy %}
package com.mypkg

import java.beans.PropertyChangeListener
import griffon.jython.JythonObjectFactory
import javax.swing.JOptionPane

class MyGriffonAppController {
  // Values auto-injected
  def model
  def view
  def greeter

  def mvcGroupInit(Map args) {
     // When our model output has changed, show a dialog
     model.addPropertyChangeListener("output", { evt ->
       if(!evt.newValue) return
       doLater {
         JOptionPane.showMessageDialog(app.windowManager.windows[0],
           evt.newValue, "Message from Jython", JOptionPane.INFORMATION_MESSAGE)
       }
     } as PropertyChangeListener)

     // Instantiate MyJythonClass
     JythonObjectFactory factory =
         new JythonObjectFactory(IGreeter.class, 'MyJythonClass', 'MyJythonClass')
     greeter = (IGreeter) factory.createObject()
   }

  def handleClick = { evt = null ->
    if(!model.input) return
    model.output = ""
    // invoke Jython class (outside EDT)
    doOutside {
      greeter.greet(model.input, model)
    }
  }
}
{% endhighlight %}

There you have it! Now we can utilize such Jython greatness as [generators](http://wiki.python.org/moin/Generators) and [list comprehensions](http://www.python.org/dev/peps/pep-0202/)!

## Further reading

The [Griffon Guide](http://dist.codehaus.org/griffon/guide/index.html) is the best place to go for Griffon documentation. You can find more comprehensive documentation for the Jython plugin on the [official plugin page](http://griffon.codehaus.org/Jython+Plugin). As always, this stuff is completely open-source, and you can find all of the code and submit suggestions and issues at the [GitHub repository](https://github.com/eriwen/griffon-jython).
