---
layout: post
comments: true
title: Making Cross-Domain Requests with CORS
slug: how-to-cors
status: publish
date: 2012-05-29 05:00
categories: javascript
---

One thing I've seen experienced JavaScript developers struggle with is making cross-domain requests. Libraries like <a href="http://jquery.com">jQuery</a> will handle all of the complexities of this and gracefully degrade to other technologies as much as possible, but it is important for JS devs to know what is going on under the covers. That's where this post comes in.

## Background
HTTP requests from Javascript are traditionally bound by the <a href="http://en.wikipedia.org/wiki/Same_origin_policy">Same Origin Policy</a>, which means that your ajax requests must have the same domain and port. The common ways to get around this are JSON-P, Proxying and message passing via <code>&lt;iframe&gt;</code>s. These all have their quirks, but the thing they generally have in common is legacy browser support.

<a href="http://www.w3.org/TR/cors/">CORS</a> stands for Cross-Origin Resource Sharing. It is a more robust way of making cross-domain requests supported by all but the lowest grade browsers (IE6 and IE7).

## Why you should use CORS
Compared to proxying, the significant advantage of CORS is not having another system component, possibly complicating the app.

It has a few big advantages over JSON-P as well:

 1. It supports HTTP verbs other than GET
 2. Error handling with JSON-P is tricky or impossible. CORS has access to the HTTP status and the response body just like XHR does
 3. CORS supports many types of authorization (like Basic Auth or OAuth). JSON-P only supports cookies.

IE8 and IE9 support <a href="#simple">simple</a> CORS requests (via <a href="http://msdn.microsoft.com/en-us/library/cc288060(VS.85).aspx">XDomainRequest</a>) and all major browsers (including mobile) have supported it for quite some time. Since <em>IE8 is becoming the new lowest common denominator</em>, we can and should start using this awesome technology. See <a href="https://developer.mozilla.org/en/http_access_control#Browser_compatibility">Browser support for CORS</a> according to MDN.

## How CORS works
To show you how it works, I've come up with the following scenario. I'm going to omit the UI building and focus on the Javascript and the HTTP requests.

<strong>Suppose we are building a one-page webapp on foo.com that allows us to manage a product list through an API hosted on another domain.</strong>

First, we need to get a list of products by making this request from our website, <em>http://foo.com</em>:

<code>GET http://api.foo.com/products</code>

This is an example of a "simple" request (more on this later, but in short this means the browser doesn't have to add another request to get approval for the desired request). Here is a simple JS snippet to do this:

{% highlight javascript linenos=table %}
// DO NOT COPY THIS CODE, ERROR HANDLING AND IE9-
//     SUPPORT HAVE BEEN OMITTED FOR BREVITY!

var req = new XMLHttpRequest();

// Feature detection for CORS
if ('withCredentials' in req) {
    req.open('GET', 'http://api.foo.com/products', true);
    // Just like regular ol' XHR
    req.onreadystatechange = function() {
        if (req.readyState === 4) {
            if (req.status >= 200 && req.status < 400) {
                // JSON.parse(req.responseText) etc.
            } else {
                // Handle error case
            }
        }
    };
    req.send();
}
{% endhighlight %}

CORS uses HTTP headers to control access to the remote resource. Behind the scenes, the browser is adding a request header, <code>Origin: http://foo.com</code> which could be used by the API to restrict access. The API will generally send back a CORS-specific header with the response, <code>Access-Control-Allow-Origin: http://foo.com</code> which denotes the origin domains allowed to make requests to the API. A "*" would mean all domains are allowed.

<h2 name="simple">Simple vs. Preflighted requests</h2>
Now suppose we want to add a new product, but we want to use an Ajax request to keep the user on our the same page (instead of using a form). We want to make a request like this:

<code>POST '{"name": "Awesome Widget", "price": "13.37"}' http://api.foo.com/products</code>

If we want to send the data with a Content-Type of application/json, this would turn our request into a "Preflighted" request. In this case, CORS adds an extra step to the request. This is required by the spec in any of the following circumstances:

 * Uses an HTTP verb other than GET or POST
 * Custom headers need to be sent (e.g. <code>X-API-Key: foobar</code>)
 * The request body has a MIME type other than <code>text/plain</code>

These requests have to be "preflighted", meaning that the browser sends <code>OPTIONS http://api.foo.com</code> request to the URL, and the server must respond with a response that basically approves the actual request you want. Here's what the sequence of HTTP requests and responses might look like (some irrelevant headers omitted):

```plain
=> OPTIONS https://api.foo.com/products
- HEADERS -
Origin: http://foo.com
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Api-Key

<= HTTP/1.1 204 No Content
- RESPONSE HEADERS -
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Max-Age: 86400
Access-Control-Allow-Headers: Api-Key
Access-Control-Allow-Origin: http://foo.com
Content-Length: 0
```

```plain
=> POST https://api.foo.com/products
- HEADERS -
Origin: http://foo.com
Access-Control-Request-Method: POST
Content-Type: application/json; charset=UTF-8

<= HTTP/1.1 200 OK
- RESPONSE HEADERS -
Access-Control-Allow-Origin: http://foo.com
Content-Type: application/json
Content-Length: 58

- RESPONSE BODY -
{"id": "123", "name": "Awesome Widget", "price": "13.37"}
```

<strong>For the sake of IE8 and IE9 support, we want to keep requests "simple"</strong>, but if this is a mobile app without that restriction, we would write it like this:

{% highlight javascript linenos=table %}
var req = new XMLHttpRequest();
var body = // JSON.stringify(productData) or something

if ('withCredentials' in req) {
    req.open('POST', 'http://api.foo.com/products', true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.setRequestHeader('Api-Key', 'foobar');
    req.onreadystatechange = handleResponse;
    req.send(body);
}
{% endhighlight %}

I did not add an example using "withCredentials", but the important thing to know about it is that cookies or certain auth headers aren't sent unless you set <code>req.withCredentials = 'true';</code>. Use this for authenticated CORS requests.

Here is more robust Javascript code (no fallbacks, though) if you want to see it. Please fork and improve this gist if you see any issues.

<script src="https://gist.github.com/2794392.js"> </script>

## Conclusion
Since IE7 is being phased out and we're build more mobile webapps that have cross-domain capabilities, CORS is the most robust solution for making cross-domain requests with Javascript for the foreseeable future. It's the only good way to handle <a href="http://en.wikipedia.org/wiki/Representational_state_transfer">RESTful</a> APIs with JS.

If you want more detail on CORS, I recommend reading <a href="https://developer.mozilla.org/en/http_access_control">MDN Docs on CORS</a> and the <a href="http://www.w3.org/TR/cors/" title="W3C CORS spec">spec</a>.

<div class="alert alert-success">My thanks to <a href="http://johnnywey.com/">Johnny Wey</a> for reviewing the draft of this post.</div>
