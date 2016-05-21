---
date: '2008-08-25 13:14:24'
layout: post
comments: true
slug: use-the-dom-inspector
status: publish
title: How to use the DOM Inspector to hack your Firefox UI
wordpress_id: '163'
categories: firefox
---

<div class="alert alert-danger"><strong>NOTE:</strong> this post is <em>very likely</em> out-of-date. Please keep this in mind when considering this article.</div>

Here's a tutorial on how to use Firefox's DOM Inspector add-on to tweak whatever you want.

Suppose we want to remove that bookmark star on the right side of the URL bar.  I'll show you a simple way to do this and then generalize the technique for use with anything.

## Setup

If you didn't get the [DOM Inspector](https://addons.mozilla.org/en-US/firefox/addon/6622) when you downloaded Firefox, you'll obviously want to do that first. Open it up by hitting _Tools > DOM Inspector_ or key in Ctrl+Shift+I (default). You'll want to start out by going to _File > Inspect a Chrome Document_ and choosing the first option which is your Firefox window.

## Find your target

The easiest way to check it out is to inspect it by clicking the <img src="/images/inspect.png" alt="Inspect" /> button and clicking on the star. The DOM Inspector is helpful here because it will highlight the block containing the star with a big red border and show you the markup in the browser document with the XML element highlighted.

We also could have clicked the <img src="/images/search.png" alt="Search" /> button and searched for "bookmark" to see if we could find it that way, but that would not really be the easiest way in this case.

<img src="/images/dominspect.png" alt="DOM Inspector Tree" class="img-center" />

From there you can easily right click and "Insert" a new node. Type "style" in the _Node Name_ field and then the CSS you want to apply in the _Node Value_. In this case you'll type "display: none;" which removes the star immediately once you click OK. We won't worry about the _Namespace URI_ in this tutorial. 

Now take note of the node name, class, or id so you can use CSS rules in your userChrome.css file. **We can see that the ID of the element is "star-button".** Great, in this case that's all we need. You'll need to know a bit of CSS to do any good tweaks so if you want you should check out [sitepoint's CSS reference](http://reference.sitepoint.com/css).

Since you know the element ID, class, etc. you should add a snippet to you userChrome.css file like this:

{% highlight css %}
#star-button { display: none; }
{% endhighlight %}

So easy! Once you get the hang of it you'll think of all kinds of things you'd like to change about Firefox's interface. Now to save you time on some bits I'll close up with a...

## Big ol' list of userChrome.css tweaks

{% highlight css %}
/* Autohide Back/Forward Buttons and Dropdown Marker when there is nothing to go Back/Forward to */
#back-button[disabled="true"] { display: none; }
#forward-button[disabled="true"] { display: none; }
#back-forward-dropmarker[disabled="true"] { display: none; }

/* Hide the Sidebar bookmarks Search box */
#bookmarksPanel > hbox { display:none; }

/* remove Sidebar maximum width restriction */
#sidebar { min-width: none !important; min-width: 0px !important; }

/* hide live feed icon in Address url toolbar */
#feed-button { display: none !important; }

/* Add a keyword when adding a bookmark */
#editBMPanel_keywordRow { visibility: visible; }

/* Combine Stop and Reload Buttons, Hide Both as Necessary */
#reload-button[disabled="true"] { display: none; }
#stop-button[disabled="true"] { display: none; }
#stop-button:not([disabled]) + #reload-button { display: none;}

/* Remove search magnifying glass */
.search-go-button { display: none !important; }

/* Hide the green "Go" arrow */
#go-button { display: none !important; }

/* Move "List All Tabs" Button to the left side of the tab bar */
.tabs-alltabs-stack {-moz-box-ordinal-group: 1 !important}
.tabbrowser-arrowscrollbox {-moz-box-ordinal-group: 2 !important}
.tabs-closebutton-box {-moz-box-ordinal-group: 3 !important}

/* Style the new auto-complete list */ 
.autocomplete-richlistitem { background: #222222 !important; color: #FFFFFF !important; padding: 0px !important; margin: 0px !important; } 
.autocomplete-richlistitem:hover, .autocomplete-richlistitem[selected="true"] {  background: #444444 !important; }  

/* Remove unimportant Location Bar Icon Text */
#identity-icon-label { display: none !important; } 

/* Remove separator under Bookmarks Toolbar */
#bookmarksToolbarFolderMenu + menuseparator { display: none; }

/* Remove Favicon placeholder in Tab Bar */
.tab-icon {display: none !important; }

/* Search bar color */
#search-container .searchbar-textbox { -moz-appearance: none !important; border: 1px !important; font-weight: bold !important; color: darkslateblue important }

/* Hide the Sidebar bookmarks Search box */
#bookmarksPanel > hbox { display:none; }

/* Hide the dropmarker in the Address url toolbar */
.autocomplete-history-dropmarker { display: none !important; }

/* Hide live feed icon in Address url toolbar */
#feed-button { display: none !important; }

/* Chage tab background */
tab { -moz-appearance: none !important; }
.tabbrowser-tabs > tab[selected="true"] .tab-text { background-color: #FF9 !important; color: #0F0 !important; font-style: bold !important;}

/* Change color of inactive tabs */
.tabbrowser-tabs > tab:not([selected="true"]) .tab-text { background-color: #8D6 !important; color: #000 !important;}

/* Hide "List All Tabs" button */
.tabbrowser-arrowscrollbox + stack { display:none !important; }

/* Dim the RSS icon until hover */
#feed-button {-moz-opacity: 0.2 !important;}
#feed-button:hover {-moz-opacity: 1.5 !important;}

/* Dim the URL Bar star icon until hover */
.ac-result-type-bookmark{-moz-opacity: 0.2 !important;}
.ac-result-type-bookmark:hover {-moz-opacity: 1.5 !important;}

/* Dim the Bookmark star icon until hover */
#star-button {-moz-opacity: 0.2 !important;}
#star-button:hover {-moz-opacity: 1.5 !important;}

/* Display only Location Bar textbox */
#menubar-items, #unified-back-forward-button, #stop-button, #reload-button, #search-container, #identity-box, #urlbar-container dropmarker { display: none; }

/* Change Location Bar font */
#urlbar { font-family: â€œCourier Newâ€, monospace; }

/* Turn Location Bar Yellow for HTTPS */
#urlbar[level] .autocomplete-textbox-container { background-color: #FFFFB7 !important; }

/* Remove Search Engine dropdown button */
.searchbar-engine-button { display: none; }

/* Change border of unselected tabs */
#content tab:not([selected="true"]) { border-style: dotted !important; }

/* Remove History Sidebar Search */
#bmHi-toolbar { display: none; }
{% endhighlight %}

There you have it! I welcome any questions or additional tweaks.
