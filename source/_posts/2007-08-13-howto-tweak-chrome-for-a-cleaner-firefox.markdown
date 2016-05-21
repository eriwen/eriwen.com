---
date: '2007-08-13 06:29:00'
layout: post
comments: true
slug: howto-tweak-chrome-for-a-cleaner-firefox
status: publish
title: Tweak chrome for a cleaner Firefox
wordpress_id: '12'
categories: firefox
---

<div class="alert alert-danger"><strong>NOTE:</strong> this post is <em>very likely</em> out-of-date. Please keep this in mind when considering this article.</div>

Wow. According to the vote you guys like Firefox. Want your [Firefox](http://www.getfirefox.com) to look cleaner and sleeker? There is so much you can tweak. If you haven't optimized your [Firefox](http://www.getfirefox.com) setup so you can do more efficient research/development/browsing/downloading, it is time to start. Stay tuned for more posts that will look at different ways to improve your 'fox experience.

Today we will look at modifying the userChrome.css file to remove unused menus, give you more viewing space, and generally give you the flexibility to see only what you care about and nothing that you don't. Mozilla has created a [Configuration Guide](http://www.mozilla.org/support/Firefox/edit) that you should check out to find the directory to create your userChrome.css file (it does not exist by default, but there is an example file in that folder).
Find it and open it up in your favorite text editor. Paste any of the following snippets under the @namespace... line at the top. Make your edits and restart [Firefox](http://www.getfirefox.com) to see your changes.

## userChrome.css tweak list

Share how you rock your Chrome in the comments!
{% highlight css %}
    /* Add a keyword when adding a bookmark */
    #keywordRow { display: -moz-grid-line !important; }

    /* Remove the close button on the tab bar and sidebar */
    .tabs-closebutton { display: none !important; }

    /* Hide Tabbar close Button */
    tabbrowser .tabs-closebutton-box { display: none; }

    /* Remove extra padding from the Navigation Bar */
    .toolbarbutton-1, .toolbarbutton-menubutton-button {
       padding: 2px 3px !important;
    }
    .toolbarbutton-1[checked="true"], .toolbarbutton-1[open="true"],
    .toolbarbutton-menubutton-button[checked="true"],
    .toolbarbutton-menubutton-button[open="true"] {
       padding: 4px 1px 1px 4px !important;
    }

    /* Remove the Edit and Help and History menus
     Id's for all toplevel menus:
     file-menu, edit-menu, view-menu, go-menu, bookmarks-menu, tools-menu, helpMenu */
    #file-menu, #helpMenu, #edit-menu, #go-menu, #bookmarks-menu { display: none !important; }

    /* Remove Back button when there's nothing to go Back to */
    #back-button[disabled="true"] { display: none; }

    /* Remove Forward button when there's nothing to go Forward to */
    #forward-button[disabled="true"] { display: none; }

    /* Remove Stop button when there's nothing to Stop */
    #stop-button[disabled="true"] { display: none; }

    /* Remove Home button */
    #home-button { display: none; }

    /*Remove magnifying glass button from search box*/
    .search-go-button-stack { display: none !important; }

    /* Eliminate the throbber and its annoying movement: */
    #throbber-box { display: none !important; }

    /* Remove extra padding from the Navigation Bar */
    .toolbarbutton-1, .toolbarbutton-menubutton-button {
      padding: 0px !important;
      margin: 0px !important;
    }

    /* Remove extra padding from the status bar */
    #status-bar { padding: 0px !important; }

    /* Multi-row bookmarks toolbar */
    #bookmarks-ptf { display:block; }
    #bookmarks-ptf toolbarseparator { display:inline; }

    /* Make inactive tabs partially transparent */
    #content tab:not([selected="true"]) { -moz-opacity: 0.5 !important; }

    /* Hide mail stuff from Tools Menus */
    menuitem[label="Read Mail (0 new)"] { display: none; }
    menuitem[label="Read Mail (0 new)"] + menuseparator { display: none; }
    menuitem[label="New Message..."] { display: none; }
    menuitem[label="New Message..."] + menuseparator { display: none; }

    /* Remove Web Search from Tools Menu */
    menuitem[label="Web Search"] { display: none; }
    menuitem[label="Web Search"] + menuseparator { display: none; }

    /* Hide For Internet Explorer Users & Release Notes from Help Menu */
    menuitem[label="For Internet Explorer Users"] { display: none; }
    menuitem[label="Release Notes"] { display: none; }

    /* Show tab favicon only on selected tab */
    tab:not([selected="true"]) .tab-icon { display: none !important; }

    /* Slightly rounded address and search bar corners */
    #urlbar {
      -moz-appearance: none !important;
      -moz-border-radius: 3px !important;
      padding-right: 1px !important;
    }

    /* Remove separators between toolbars*/
    #toolbar-menubar {
     min-height: 12px !important;
     padding: 0px !important;
     margin: 0px !important;
     border: none !important;
    }
    #nav-bar {
     border: none !important;
     padding: 0px !important;
    }
    #PersonalToolbar { border: none !important; }
    #navigator-toolbox { border-bottom-width: 0px !important; }

    /* Remove Bookmark Toolbar folder from the bookmarks menu */
    menu[label="Bookmarks Toolbar Folder"] { display: none !important; }
{% endhighlight %}
Next time we will look at optimizing your Add-ons so that you can have extra tools in your browser toolbox without making [Firefox](http://www.getfirefox.com) too bloated.
