---
layout: post
comments: true
title: "Quick Tip: More Readable Conditionals in Ruby"
slug: more-readable-conditionals
status: published
date: 2013-01-07 00:00
category: ruby
---

When [Code Climate](https://codeclimate.com/) and [Tammer Saleh](https://twitter.com/tsaleh) from Thunderbolt Labs
teamed up to offer free code reviews at [RubyConf](http://rubyconf.org/),
I seized the opportunity to get feedback on my first Ruby gem -- [gnip-rule](https://github.com/eriwen/gnip-rule)).
A number of refactorings came out of that session, but one I found most interesting was an approach to making
conditionals more maintainable in languages like Ruby and CoffeeScript.

They say that the use of [conditionals in Ruby is a code smell](http://ghendry.net/refactor.html#dc).
Decisions about how your team approaches conditionals should be discussed then outlined in your project styleguide.

This is the refactoring I'm talking about -- I have a bunch of different checks according to
[Gnip's PowerTrack API constraints](http://support.gnip.com/customer/portal/articles/600659-powertrack-generic#Rules) to
ensure that a PowerTrack rule follows the constraints.
{% highlight ruby %}
module GnipRule
  class Rule
    def valid?
      # So many ORs
      if contains_stop_word? || too_long? || contains_negated_or? || too_many_positive_terms? || contains_empty_source?
        return false
      end
      true
    end

    # def contains_stop_word?..end etc.
  end
end
{% endhighlight %}

...And here is the same method, refactored. We turned each condition into an early `return` if the conditional expression is true:
{% highlight ruby %}
module GnipRule
  class Rule
    def valid?
      return false if too_long?
      return false if too_many_positive_terms?
      return false if contains_stop_word?
      return false if contains_empty_source?
      return false if contains_negated_or?
      return true
    end
  end
end
{% endhighlight %}

Some might cringe at seeing so many `return` statements, but I argue that it's more maintainable this way because it's
obvious to the reader what is being checked. If another check is added, it doesn't hang off a long chain of `||`s (or
use a bunch of ugly `\`s to break lines).

Not only is this useful in Ruby, but CoffeeScript as well. Example:
{% highlight coffeescript %}
stringify = (obj) ->
  return 'undefined' if obj is undefined
  return 'null' if obj is null
  return obj if (typeof obj is 'string' or Number.isFinite(obj))
  return "[#{obj.join(', ')}]" if obj instanceof Array
  return Object.prototype.toString.call(obj)
{% endhighlight %}

Thank you again, [Tammer](https://twitter.com/tsaleh), for your very helpful advice.

What do you think of this formatting?
