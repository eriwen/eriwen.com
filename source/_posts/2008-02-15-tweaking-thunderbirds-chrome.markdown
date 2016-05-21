---
date: '2008-02-15 23:57:07'
layout: post
comments: true
slug: tweaking-thunderbirds-chrome
status: publish
title: Personalize your Thunderbird by changing it's chrome
wordpress_id: '30'
categories: css
---

<div class="alert alert-danger"><strong>NOTE:</strong> this post is <em>very likely</em> out-of-date. Please keep this in mind when considering this article.</div>

<img src="/images/thunderbird-icon.png" alt="Thunderbird" class="img-left" width="90" height="90" />It's been awhile since we [tweaked our Firefox chrome](/firefox/howto-tweak-chrome-for-a-cleaner-firefox/), and it's about time we get to hack Mozilla's wonderful email client [Thunderbird](http://www.mozilla.com/en-US/thunderbird/).

In this post I'll give you the necessary tools to change the look of Thunderbird and give you some suggestions (and code, of course :) to help you along the way. First, let me give credit to [Twister MC's wonderful post](http://www.twistermc.com/blog/2007/04/10/thunderbird-labels) that I will be using as a reference for the label coloring scripts below. OK, let's get started!

I recommend that you create a Stylish script using the [Stylish Add-on for Thunderbird](https://addons.mozilla.org/en-US/thunderbird/addon/2108) and putting these CSS snippets in there. 

Right! So open up your userChrome.css file in your favorite text editor (not Microsoft Word, I recommend [jEdit](http://www.jedit.org)) We'll need to begin the file by defaulting to the XUL namespace:

{% highlight css %}
@namespace url("http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul");
/* set default namespace to XUL */
{% endhighlight %}

Then we get to the good stuff. Here are some snippets I have created for you to put in the userChrome.css file:

{% highlight css %}
/* Change menu and dialog font sizes */
menupopup > * {
    font-size: 12px !important
}

/* Change font-size of email list */
.tree-rows {
    font-size: 10px !important;
}

/* Change all fonts to Century Gothic */
* {
    font-family: "Century Gothic", sans-serif !important;
}

/* Hide status bar */
#status-bar {
    display: none !important;
}

/* Get rid of the throbber */
#throbber-box {
    display: none !important;
}

/* Make Sidebar header big and bold */
#folderpane-title {
    font-size: 1.2em !important;
    font-weight: bold !important;
}

/* Hide Menus: menu_File, menu_Edit, menu_View, messageMenu, ltnCalendarMenu, tasksMenu */
#menu_File, #menu_Edit, #menu_View {
    display: none !important;
}

/* Remove disabled toolbar buttons until enabled */
toolbarbutton[disabled="true"] {
    display: none !important;
}

/* Make unread messages blue and italic */
treechildren:-moz-tree-cell-text(unread) {
    color: #CCCCFF !important;
    font-style: italic !important;
}

/* Change background color of unread messages to slightly red */
treechildren::-moz-tree-cell(unread) {
    background-color: #330000 !important;
}
treechildren::-moz-tree-cell(unread,selected) {
    background-color: #660000 !important;
}

/* Change colors of replied messages */
treechildren::-moz-tree-cell(replied) {
    background-color: #003300 !important;
}
treechildren::-moz-tree-cell(replied,selected) {
    background-color: #006600 !important;
}
treechildren::-moz-tree-cell(replied,current) {
    background-color: #009900 !important;
}
treechildren:-moz-tree-cell-text(replied,current) {
    color: #FFFFFF !important;
}

/* Change color of deleted messages */
treechildren::-moz-tree-cell(imapdeleted) {
    background-color: #999999 !important;
}
treechildren:-moz-tree-cell-text(imapdeleted) {
    color: #FFFFFF !important;
text-decoration: line-through !important;
}
treechildren::-moz-tree-cell(imapdeleted,selected) {
    background-color: #333333 !important;
}
treechildren::-moz-tree-cell(imapdeleted,current) {
    background-color: #666666 !important;
}
treechildren:-moz-tree-cell-text(imapdeleted,selected) {
    color: #DDDDFF !important;
}
treechildren:-moz-tree-cell-text(imapdeleted,current) {
    color: #DDDDFF !important;
}
treechildren::-moz-tree-cell-text(imapdeleted, offline) {
    background-color: #DDDDDD !important;
    text-decoration: line-through !important;
}

/* Folder pane(color/text) and Message pane(color) */
treechildren {
    background-color: #2D2D2D !important;
}

/* change Message Pane text */
treechildren:-moz-tree-cell-text(unread) {
    font-size: 10px !important;
    font-family: "Times New Roman" !important;
    font-weight: bold !important;
    color: #D50000 !important
}
treechildren:-moz-tree-cell-text(read) {
    font-size: 10px !important;
    font-family: "Times New Roman" !important;
    font-weight: bold !important;
}

/* Set no-label (default) bottom border */
treechildren::-moz-tree-cell {
    border-bottom: 1px solid #FFFFFF !important;
}
{% endhighlight %}

I've also created a [snippet for pretty labels](https://gist.github.com/757944) on GitHub. Enjoy!

You can add to these easily by using the [Thunderbird DOM Inspector](https://addons.mozilla.org/en-US/thunderbird/addon/1806). I know my brilliant readers have some more of these up their sleeves so let's see what tweaks you have for [Thunderbird](http://www.mozilla.com/en-US/thunderbird/) in the comments!
