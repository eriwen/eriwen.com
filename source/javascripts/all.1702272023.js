var Page=function(){return Page.fn.init()};Page.fn=Page.prototype={$:function(e){return document.getElementById(e)},init:function(){Page.fn.addEvent(window,"scroll",Page.fn.loadShareWidgets),Page.fn.addEvent(document,"click",Page.fn.trackLinkClick)},loadShareWidgets:function(){if(Page.fn.removeEvent(window,"scroll",Page.fn.loadShareWidgets),Page.fn.$("share")){var e=encodeURIComponent(window.__permalink),t=encodeURIComponent(window.__title);Page.fn.$("reddit-container").innerHTML='<iframe src="https://reddit.com/static/button/button1.html?width=120&url='+e+"&title="+t+'" height="20" width="120" scrolling="no" frameborder="0"></iframe>',Page.fn.$("hn-container").innerHTML='<a href="https://news.ycombinator.com/submit" class="hn-share-button">Vote on HN</a>',Page.fn.loadScript("https://hnbutton.appspot.com/static/hn.js"),Page.fn.$("twitter-container").innerHTML="<a href='https://twitter.com/share' class='twitter-share-button' data-count='horizontal' data-via='eriwen'>Tweet</a>",Page.fn.loadScript("https://platform.twitter.com/widgets.js",Page.fn.$("twitter-container")),Page.fn.$("gplusone-container").innerHTML='<g:plusone size="medium"></g:plusone>',Page.fn.loadScript("https://apis.google.com/js/plusone.js")}if("function"==typeof document.getElementsByClassName){var n=document.getElementsByClassName("twitter-follow-button");n.length&&Page.fn.loadTwitterFollowButton()}},loadTwitterFollowButton:function(){if(!document.getElementById("twitter-wjs")){var e=document.createElement("script"),t=document.getElementsByTagName("script")[0];e.id="twitter-wjs",e.src="//platform.twitter.com/widgets.js",t.parentNode.insertBefore(e,t)}},trackLinkClick:function(e){var t=/^https?\:\/\/([^\/]+)(.*)$/,n=Page.fn.getEventTarget(e),a=n.getAttribute("href");if(!a||!a.match(t))return!1;var o=a.match(t),r=o[1],i=o[2].slice(o[2].lastIndexOf("."));return["jnlp","pdf","zip"].indexOf(i)!==-1?(_gaq.push(["_trackEvent","Downloads",i.toUpperCase(),a]),!0):(a.indexOf(document.domain)===-1||!document.domain)&&(_gaq.push(["_trackEvent","Outbound Traffic",r,a]),!0)},addEvent:function(e,t,n){e.addEventListener?Page.fn.addEvent=function(e,t,n){e.addEventListener(t,n,!1)}:Page.fn.addEvent=function(e,t,n){e.attachEvent("on"+t,n)},Page.fn.addEvent(e,t,n)},removeEvent:function(e,t,n){e.removeEventListener?Page.fn.removeEvent=function(e,t,n){e.removeEventListener(t,n,!1)}:Page.fn.removeEvent=function(e,t,n){e.detachEvent("on"+t,n)},Page.fn.removeEvent(e,t,n)},fireEvent:function(e,t){document.createEvent?Page.fn.fireEvent=function(e,t){var n=document.createEvent("Events");return n.initEvent(t,!1,!0),!e.dispatchEvent(n)}:Page.fn.fireEvent=function(e,t){return e.fireEvent("on"+t,document.createEventObject())},Page.fn.fireEvent(e,t)},getEventTarget:function(e){var t;return e||(e=window.event),e.target?t=e.target:e.srcElement&&(t=e.srcElement),t},domready:function(e){document.addEventListener?Page.fn.domready=function(e){document.addEventListener("DOMContentLoaded",e,!1)}:Page.fn.domready=function(e){"complete"===document.readystate?window.setTimeout(e,0):Page.fn.addEvent(window,"load",e)},Page.fn.domready(e)},loadScript:function(e,t,n){var a=document.createElement("script");a.type="text/javascript",a.readyState?a.onreadystatechange=function(){"loaded"!==a.readyState&&"complete"!==a.readyState||(a.onreadystatechange=null,n&&n())}:a.onload=function(){n&&n()},a.src=e,a.async=!0;var o=t||document.getElementsByTagName("head")[0];return window.setTimeout(function(){o.appendChild(a)},0),a},getEmSize:function(e){"undefined"==typeof e&&(e=document.documentElement);var t=document.createElement("DIV");t.style.height="1em",e.appendChild(t);var n=t.offsetHeight;return e.removeChild(t),n}},window.Page=Page,window.onload=window.Page;
//# sourceMappingURL=source/javascripts/all.1702272023.js.map