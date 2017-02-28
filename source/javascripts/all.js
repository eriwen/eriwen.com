/*global ActiveXObject: false, $: false, _gaq: false */
/**
 * Web page related functions for eriwen.com
 * @class Page
 * @xtype Page
 * @namespace
 */
var Page = function() {
    return Page.fn.init();
};

Page.fn = Page.prototype = {
    $: function $(str) {
        return document.getElementById(str);
    },

    /**
     * Set events and call any other initializing functions.
     */
    init: function init() {
        // Load sharing bits after user scrolls to optimize initial page loadtime
        Page.fn.addEvent(window, 'scroll', Page.fn.loadShareWidgets);
        Page.fn.addEvent(document, 'click', Page.fn.trackLinkClick);
    },
    /**
     * Inject resources for sharing buttons.
     */
    loadShareWidgets: function loadShareWidgets() {
        Page.fn.removeEvent(window, 'scroll', Page.fn.loadShareWidgets);
        if(Page.fn.$('share')) {
            // Load social buttons
            var permalink = encodeURIComponent(window.__permalink);
            var title = encodeURIComponent(window.__title);
            Page.fn.$('reddit-container').innerHTML = '<iframe src="https://reddit.com/static/button/button1.html?width=120&url=' + permalink + '&title=' + title + '" height="20" width="120" scrolling="no" frameborder="0"></iframe>';
            Page.fn.$('hn-container').innerHTML = '<a href="https://news.ycombinator.com/submit" class="hn-share-button">Vote on HN</a>';
            Page.fn.loadScript('https://hnbutton.appspot.com/static/hn.js');
            Page.fn.$('twitter-container').innerHTML = "<a href='https://twitter.com/share' class='twitter-share-button' data-count='horizontal' data-via='eriwen'>Tweet</a>";
            Page.fn.loadScript('https://platform.twitter.com/widgets.js', Page.fn.$('twitter-container'));
            Page.fn.$('gplusone-container').innerHTML = '<g:plusone size="medium"></g:plusone>';
            Page.fn.loadScript('https://apis.google.com/js/plusone.js');
        }
        if(typeof document.getElementsByClassName == 'function') {
            var followButtons = document.getElementsByClassName('twitter-follow-button');
            if (followButtons.length) {
                Page.fn.loadTwitterFollowButton();
            }
        }
    },

    loadTwitterFollowButton: function loadTwitterFollowButton() {
        if(!document.getElementById('twitter-wjs')) {
            var js = document.createElement('script');
            var fjs = document.getElementsByTagName('script')[0];
            js.id = 'twitter-wjs';
            js.src = '//platform.twitter.com/widgets.js';
            fjs.parentNode.insertBefore(js, fjs);
        }
    },

    /**
     * Given an event object, determine if the source element was a link, and track it with Google Analytics
     * @param {Event} evt object that should be fired due to a link click.
     * @return True if link was successfully tracked.
     */
    trackLinkClick: function trackLinkClick(evt) {
        var reUrl = /^https?\:\/\/([^\/]+)(.*)$/;
        var targ = Page.fn.getEventTarget(evt);
        var href = targ.getAttribute('href');
        if(!href || !href.match(reUrl)) {
            return false;
        }
        var parts = href.match(reUrl);
        var domain = parts[1];
        var extension = parts[2].slice(parts[2].lastIndexOf('.'));
        if(['jnlp', 'pdf', 'zip'].indexOf(extension) !== -1) {
            _gaq.push(['_trackEvent', 'Downloads', extension.toUpperCase(), href]);
            return true;
        } else if(href.indexOf(document.domain) === -1 || !document.domain) {
            _gaq.push(['_trackEvent', 'Outbound Traffic', domain, href]);
            return true;
        }
        return false;
    },
    /**
     * Adds a javascript event listener to obj of a type
     * and also receives a function to execute when that event is fired
     * @param obj {Object} reference.
     * @param type {String} containing event name (e.g. "onclick").
     * @param fn {Function} definition to execute.
     */
    addEvent: function addEvent(obj, type, fn) {
        if(obj.addEventListener) {
            Page.fn.addEvent = function(obj, type, fn) {
                obj.addEventListener(type, fn, false);
            };
        } else { //IE
            Page.fn.addEvent = function(obj, type, fn) {
                obj.attachEvent('on' + type, fn);
            };
        }
        Page.fn.addEvent(obj, type, fn);
    },
    /**
     * Removes a javascript event listener to obj of a type and also receives a
     * function to execute when that event is fired.
     * @param obj {Object} reference.
     * @param type {String} containing event name (e.g. "onclick").
     * @param fn {Function} definition to execute.
     */
    removeEvent: function removeEvent(obj, type, fn) {
        if(obj.removeEventListener) {
            Page.fn.removeEvent = function(obj, type, fn) {
                obj.removeEventListener(type, fn, false);
            };
        } else { //IE
            Page.fn.removeEvent = function(obj, type, fn) {
                obj.detachEvent('on' + type, fn);
            };
        }
        Page.fn.removeEvent(obj, type, fn);
    },
    /**
     * Fires an event of the given type on the given object.
     * @param obj {Object} to fire event on.
     * @param type {String} of event to fire.
     */
    fireEvent: function fireEvent(obj, type) {
        if(document.createEvent) {
            Page.fn.fireEvent = function(obj, type) {
                var evt = document.createEvent('Events');
                evt.initEvent(type, false, true);
                return !obj.dispatchEvent(evt);
            };
        } else { //IE
            Page.fn.fireEvent = function(obj, type) {
                return obj.fireEvent('on' + type, document.createEventObject());
            };
        }
        Page.fn.fireEvent(obj, type);
    },
    /**
     * Returns the HTML element that an event occured upon.
     * @param {Event} evt object.
     * @return {HTMLElement} event target.
     */
    getEventTarget: function getEventTarget(evt) {
        var targ;
        if(!evt) {
            evt = window.event;
        }
        if(evt.target) {
            targ = evt.target;
        } else if(evt.srcElement) {
            targ = evt.srcElement;
        }
        return targ;
    },
    /**
     * Add an event to execute a given function once the DOM is loaded.
     * @param func - Function to execute as soon as possible.
     */
    domready: function(func) {
        if(document.addEventListener) {
            Page.fn.domready = function(fn) {
                document.addEventListener('DOMContentLoaded', fn, false);
            };
        } else { //IE
            Page.fn.domready = function(fn) {
                if(document.readystate === 'complete') { //Prevent this from firing too early in IE7
                    window.setTimeout(fn, 0);
                } else {
                    Page.fn.addEvent(window, 'load', fn);
                }
            };
        }
        Page.fn.domready(func);
    },
    /**
     * Inject a Javascript file and call a callback function when it's loaded.
     * @param src {String} URL to JS file.
     * @param targetEl {HTMLElement} script should be injected into, defaults to HEAD.
     * @param callback {Function} to execute on success.
     * @return {HTMLElement} Script so we can set the source to null or whatever later.
     */
    loadScript: function loadScript(src, targetEl, callback) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        if(script.readyState) { //IE
            script.onreadystatechange = function() {
                if(script.readyState === 'loaded' || script.readyState === 'complete') {
                    script.onreadystatechange = null;
                    if(callback) {
                        callback();
                    }
                }
            };
        } else {
            script.onload = function() {
                if(callback) {
                    callback();
                }
            };
        }

        script.src = src;
        script.async = true;
        // Suggested by Google: https://googlecode.blogspot.com/2010/11/instant-previews-under-hood.html
        var injectTarget = targetEl || document.getElementsByTagName('head')[0];
        window.setTimeout(function() {
            injectTarget.appendChild(script);
        }, 0);
        return script;
    },
    /**
     * Determine the size of 1 "em" based on the given element or the body.
     * @param {HTMLElement} el within which to measure (Optional).
     * @return {Number} size of 1em in pixels.
     */
    getEmSize: function getEmSize(el) {
        // Default to body
        if(typeof el === 'undefined') {
            el = document.documentElement;
        }
        var tempDiv = document.createElement('DIV');
        tempDiv.style.height = 1 + 'em';
        el.appendChild(tempDiv);
        var emSize = tempDiv.offsetHeight;
        el.removeChild(tempDiv);
        return emSize;
    }
};

window.Page = Page;
window.onload = window.Page;
