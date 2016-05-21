---
date: '2008-02-23 22:29:54'
layout: post
comments: true
slug: highlight-search-results-with-js
status: publish
title: How to highlight search results with JavaScript and CSS
wordpress_id: '32'
categories: javascript
---

<img src="/images/highlight_search.jpg" alt="Google highlight search text" class="img-left" width="125" height="133"/>You see it in Google search results and a lot of other sites that have good search functionality. When you perform a search, your words or phrases are highlighted in the search results making it easy for you to find the most relevant content.

Today I'm going to show you a simple way to add this to your website or blog so your users can find what they need in style. I think that this kind of thing should be implemented more often for how easy it is to implement.

## Search Results JavaScript code:

{% highlight js %}
function highlightOnLoad() {
  // Get search string
  if (/s\=/.test(window.location.search)) {
    var searchString = getSearchString();
    // Starting node, parent to all nodes you want to search
    var textContainerNode = document.getElementById("content");
    
    // Informational message for search
    var searchInfo = 'Search Results for: ';
    
    // Split search terms on '|' and iterate over resulting array
    var searchTerms = searchString.split('|');
    for (var i in searchTerms) 	{
      // The regex is the secret, it prevents text within tag declarations to be affected
      var regex = new RegExp(">([^<]*)?("+searchTerms[i]+")([^>]*)?<","ig");
      highlightTextNodes(textContainerNode, regex, i);
      // Add to info-string
      searchInfo += ' <span class="highlighted term'+i+'">'+searchTerms[i]+'</span> ';
    }
    
    // Create div describing the search
    var searchTermDiv = document.createElement("H2");
    searchTermDiv.className = 'searchterms';
    searchTermDiv.innerHTML = searchInfo;
    
    // Insert as very first child in searched node
    textContainerNode.insertBefore(searchTermDiv, textContainerNode.childNodes[0]);
  }
}

// Pull the search string out of the URL
function getSearchString() {
  // Return sanitized search string if it exists
  var rawSearchString = window.location.search.replace(/[a-zA-Z0-9\?\&\=\%\#]+s\=(\w+)(\&.*)?/,"$1");
  // Replace '+' with '|' for regex
  // Also replace '%20' if your cms/blog uses this instead (credit to erlando for adding this)
  return rawSearchString.replace(/\%20|\+/g,"\|");
}

function highlightTextNodes(element, regex, termid) {
  var tempinnerHTML = element.innerHTML;
  // Do regex replace
  // Inject span with class of 'highlighted termX' for google style highlighting
  element.innerHTML = tempinnerHTML.replace(regex,'>$1<span class="highlighted term'+termid+'">$2</span>$3<');
}

// Call this onload, I recommend using the function defined at: http://untruths.org/technology/javascript-windowonload/
addOnLoad(highlightOnLoad());
{% endhighlight %}

## Now, the highlighting CSS:

{% highlight css %}
span.highlighted {
  background-color: #161616;
  font-weight: bold;
}
span.term0 {
  background-color: #161633;
}
span.term1 {
  background-color: #331616;
}
span.term2 {
  background-color: #163316;
}
{% endhighlight %}

## Code explanation

First, the `highlightOnLoad` function checks `window.location.search` to see if we need to be running any of this stuff, then calls _getSearchString_ to get a sanitized search string so that nothing funky can happen if, say, the user searches for `<script>`. You should really be sanitizing all search inputs at least on the back-end anyway.

Then, the `highlightTextNodes` function uses a regex replace on our textContainerNode's innerHTML. The regex verifies that the text is between a `>` and a `<` (and not the other way around). Actually nice and simple!

## Caveats

This may end up being a bit slow if you are doing this on a LOT of text, but for my blog text, it seems quite snappy to me. Also, the CSS does not bold text inside links, but the background color is there to make it obvious.

What do you think? Try it out on the search box on the upper-right. I'm hoping for some optimizations in the comments.
