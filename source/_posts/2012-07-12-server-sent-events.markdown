---
layout: post
comments: true
title: Pushing updates in real-time with Server-Sent Events
slug: server-sent-events
status: publish
date: 2012-07-12 01:00
categories: javascript
---

For the last few months, I've been writing an app that gathers social network data in real time and does some calculations to it before sending it on to a user's browser. I decided to use [Server-Sent Events](http://en.wikipedia.org/wiki/Server-sent_events) (SSEs, aka EventSource), and wanted to share my learnings.

An EventSource uses [HTTP streaming](http://en.wikipedia.org/wiki/Push_technology) and keeps a connection to the server, which will continuously send an event-stream (more on those below). Communication is one-way, the client has no way to communicate back with the server through the event-stream.

## Anatomy of an EventSource request
To illustrate how EventSources work, consider the scenario of a live stock ticker app. Here's how an EventSource HTTP request and response might look:

```plain
=> GET http://foo.com/stocks/GOOG
- HEADERS -
Accept: text/event-stream

<= HTTP/1.1 200 OK
- RESPONSE HEADERS -
Content-Type: text/event-stream

- RESPONSE BODY -
data: {"time": 1342067399340, "price": "$597.32"}

:a comment to keep the connection alive perhaps

data: Events are sent in real-time
data: {"time": 1342067400233, "price": "$597.33"}

id: 124
event: news
data: {"url": "http://foo.com", "note": "This event has a type"}
...
```

There are a few things to note here:

 * An event is simply some lines of text with special prefixes like `data:`, `event:`, or `id:`
 * Events are terminated by multiple line feeds (`\n`)
 * Events may have a type or id, but it's optional
 * Comments should be sent every so often when data isn't to keep connections alive

## Example client and server code
Here's what we might write for a web client that would consume an EventSource and update a stock chart and news ticker in real-time.

{% highlight js linenos=table %}
var eventSource = new EventSource('/stocks/GOOG');
var stockChart; // A <canvas> wrapper perhaps
var newsTicker; // A <ul> of news story links

eventSource.addEventListener('open', function() {
    stockChart = initializeChart();
    newsTicker = initializeTicker();
}, false);

// An event without a type came in
eventSource.addEventListener('message', function(event) {
    var stockData = event.data;
    if (stockData.last_trade_date && stockData.price) {
        stockChart.addPoint(stockData.time, stockData.price);
    }
}, false);

// Only fired by events with the type: "news"
eventSource.addEventListener('news', function(event) {
    newsTicker.add(event.id, event.data);
}, false);

// EventSource lost connection or timed out
eventSource.addEventListener('error', function() {
    eventSource.close();
    reinitiateEventSource();
}, false);
{% endhighlight %}

Here's a little [Sinatra](http://www.sinatrarb.com) server that continuously gets stock data for a given symbol. This is mostly for illustration, and I haven't tested this stuff much, so please use it at your own risk.

{% highlight ruby linenos=table %}
require 'rubygems'
require 'sinatra'
require 'sinatra/streaming'
require 'yahoo_stock'

post '/stock/:symbol', provides: 'text/event-stream' do
    stream :keep_open do |out|
        # Error handling code omitted
        out << ": hello\n\n" unless out.closed?
        loop do
            quote = YahooStock::Quote.new(:stock_symbols => [params[:symbol]])
            if quote
                data = quote.results(:to_hash).output
                out << "data:{\"price\":\"#{data.last_trade_price_only}\",\"time\":\"#{data.last_trade_date}\"}\n\n"
            else
                out << ": heartbeat\n\n" unless out.closed?
                sleep 1
            end
        end
    end
end
{% endhighlight %}

Luckily, Server-Sent Events uses plain old HTTP so we can create polyfills for older browsers.

## Polyfills
There seem to be 3 solid polyfill solutions out there to extend support for EventSource back to IE8 and up by using XHR polling as a fallback:

 * [Remy Sharp's Polyfill](https://github.com/remy/polyfills/blob/master/EventSource.js) - This is the only true polyfill here in that it has no library dependencies and uses the native EventSource implementation if it exists. Supports IE7+
 * [Rick Waldron's Polyfill](https://github.com/rwldrn/jquery.eventsource) - A jQuery plugin with a simple API that also uses the native implementation if it's available
 * [Yaffle's Polyfill](https://github.com/Yaffle/EventSource) - This is the one I used because it replaces the native implementation with one that normalizes behavior cross-browser and supports [CORS](/javascript/how-to-cors/) requests where possible

## Server-Sent Events in practice
Debugging isn't too difficult because at least Chrome Dev Tools shows every EventSource transaction in the _Network_ tab, but it does help to be able to run both client and server yourself so you can carefully deconstruct problematic scenarios (like race conditions, perhaps).

It's worth mentioning that all of the _real-time updates to the app was actually a bad UX_, and so I decided to just poll for updates and show notifications. I learned that you should consider definitely strongly consider UX before choosing a solution (or at least validate the assumption that you need real-time updates). Heroku made keeping things real-time painful because it closes connections that last over 1 minute and so I had a lot of code to keep the stream going not only to browsers but also to my MongoDB store. Just something to consider when choosing an app host.

That's all I have for now. For more information and demos, check out this [article on HTML5 Rocks](http://www.html5rocks.com/en/tutorials/eventsource/basics/) and the [EventSource spec](http://www.w3.org/TR/eventsource/).
