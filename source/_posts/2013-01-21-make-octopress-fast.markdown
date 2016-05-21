---
layout: post
comments: true
title: "Making Octopress Fast"
slug: make-octopress-fast
status: publish
date: 2013-01-21 00:00
category: performance
---

A few months ago, I switched my blog to Octopress from Wordpress. I did this for a number of reasons, one of which
is I could host it entirely from [Amazon Web Services](https://aws.amazon.com).

I haven't quite been satisfied with my [Google Page Speed](https://developers.google.com/speed/pagespeed/) report until
now. I'm going to walk you through my optimizations in this post:

* [Reducing HTTP Requests](https://www.eriwen.com/performance/make-octopress-fast/#combine)
* [Minifying/GZipping HTML/CSS/JS](https://www.eriwen.com/performance/make-octopress-fast/#minify) (with [Source Maps](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/))
* [Image handling](https://www.eriwen.com/performance/make-octopress-fast/#images)
* [Uploading to Amazon S3/CloudFront](https://www.eriwen.com/performance/make-octopress-fast/#aws) with optimal caching headers and cache invalidation

## Intro
[Octopress](http://octopress.org) is a static blog generator based on Jekyll. It has a bunch of HTML5/responsive goodies and does
syntax highlighting and rescues kittens out-of-the-box.

Anyway, this post isn't about how great Octopress is, it's about adding stuff to your Rakefile to make it faster. You can read [the docs](http://octopress.org/docs/) if you want to know more.

## <a id="combine"></a> Reducing HTTP Requests
Every HTTP request [adds significant load time](https://developers.google.com/speed/docs/best-practices/request) to
your blog, so the first step to speed is to cut down the number of requests.
Use of themes and widgets exacerbates the problem, but nothing we can't handle by combining the various resources.
Here are the Rake tasks I use to accomplish this:

{% highlight ruby linenos=table %}
desc "Combine CSS"
task :combine_css do
  puts "## Combining CSS"
  styles_dir = "#{source_dir}/stylesheets"
  # Watch out! Order of files matters here!
  system "cat #{styles_dir}/file1.css file2.css... > #{styles_dir}/all.css"
end

desc "Combine JS"
task :combine_js do
  puts "## Combining JS"
  scripts_dir = "#{source_dir}/javascripts"
  system "cat #{scripts_dir}/file1.js file2.js... > #{scripts_dir}/all.js"
end

desc "Combine CSS/JS"
task :combine => [:combine_css, :combine_js]
{% endhighlight %}

Don't forget to combine files in order of their dependencies. Put jQuery before jQuery plugins and all that.

If you have an especially large JavaScript files (like over 500kb), you might split them up into 2 or more groups so they can be downloaded in
parallel. This seems like a rarity for Octopress blogs, but it's good to think about.

## <a id="minify"></a> Ensmallening HTTP Responses
After combining, I have 73kb of JS and 106kb of CSS. Blogs that use any widgets will probably have a decent amount more.
Using minification and GZip cuts that down to 19kb and 17kb, respectively. Similarly, we can cut the size of our HTML files very
significantly by compressing them.

Unfortunately, ol' CloudFront won't handle GZip automatically for us, so we have to do it ourselves and add an HTTP header
`Content-Encoding: gzip`. Here's some rake tasks that'll handle that for us:

{% highlight ruby linenos=table %}
# For asset versioning
asset_version = Time.new.strftime("%y%m%d%H%M")

desc "Minify CSS"
task :minify_css do
  puts "## Minifying CSS"
  input = "#{source_dir}/stylesheets/all.css"
  output = "#{public_dir}/stylesheets/all.#{asset_version}.css"
  system "cleancss -e -o #{output} #{input}"
end

desc "Minify JS"
task :minify_js do
  puts "## Minifying JS"
  input = "#{source_dir}/javascripts/all.js"
  output = "#{source_dir}/javascripts/all.#{asset_version}.js"
  smap_option = "--source-map all.#{asset_version}.js.map"
  smap_root_option = "--source-map-root https://www.eriwen.com"
  system "uglifyjs #{input} -o #{output} #{smap_option} #{smap_root_option} -p 5 -m -c"
  Dir.glob("#{source_dir}/javascripts/all.*").each do |f|
    FileUtils.mv(f, "#{public_dir}/javascripts")
  end
end

desc "Minify CSS/JS"
task :minify => [:minify_css, :minify_js]

desc "GZip HTML"
task :gzip_html do
  puts "## GZipping HTML"
  system 'find public/ -type f -name \*.html -exec gzip -9 {} \;'
  # Batch rename .html.gz to .html
  Dir['**/*.html.gz'].each do |f|
    test(?f, f) and File.rename(f, f.gsub(/\.html\.gz/, '.html'))
  end
end

desc "GZip CSS"
task :gzip_css do
  puts "## GZipping CSS"
  styles_dir = "#{public_dir}/stylesheets"
  system "gzip -9 #{styles_dir}/all.#{asset_version}.css"
  system "mv #{styles_dir}/all.#{asset_version}.css{.gz,}"
end

desc "GZip JS"
task :gzip_js do
  puts "## GZipping JS"
  scripts_dir = "#{public_dir}/javascripts"
  system "gzip -9 #{scripts_dir}/all.#{asset_version}.js"
  system "mv #{scripts_dir}/all.#{asset_version}.js{.gz,}"
end

desc "GZip All"
task :gzip => [:gzip_html, :gzip_css, :gzip_js]
{% endhighlight %}

With this, page weight for essential resources (HTML, CSS, JS and common images) is around 90kb total!

## <a id="images"></a> What about images?
Images are becoming the biggest contributor to page weight [according to the HTTP Archive](http://httparchive.org/interesting.php#bytesperpage).

I don't have an automated process for optimizing images because my blog is not image-heavy, but I use [ImageOptim](http://imageoptim.com/) to
optimize images before using them. There is an amazing [post on optimizing images](http://calendar.perfplanet.com/2012/giving-your-images-an-extra-squeeze/)
on Planet Performance.

One thing I do and recommend is the use of [SVG](https://developer.mozilla.org/en-US/docs/SVG) to replace icons. If you inspect the header at the top of this page,
you'll notice that the social icons are in fact inline SVG, which is [supported by IE9 and all A-grade browsers](http://caniuse.com/#feat=svg-html5).
That, my friends, is progressive enhancement for the 99.5% of you who aren't on IE8 and lower (from my blog stats). An
alternative is [icon fonts](http://css-tricks.com/flat-icons-icon-fonts/), but I didn't feel like it was worth the extra request. *Come at me, retina screens!*

By the way, if you're curious how those icons came into being, I simply collected the generated SVG from the [Raphael
icon set](http://raphaeljs.com/icons/), but I'm sure there's an easy way to do this...

<a id="aws"></a>
## Deploying to Servers Close to Your Reader
Now that we have tiny static files, the last piece of the puzzle is killing the latency as much as possible. I put files
on [Amazon CloudFront](http://aws.amazon.com/cloudfront/) and aggressively cache assets for this reason. To make this work, we need unique file names so
that we don't have to worry about old files being cached. That's why we version our files.

{% highlight ruby linenos=table %}
# Declared earlier
asset_version = Time.new.strftime("%y%m%d%H%M")

desc "Update head include for static assets"
task :update_asset_versions do
  puts "## Updating asset versions"
  # Replace instances of all.js and all.1234.js with all.{version}.js
  content = ''
  File.open("#{source_dir}/_includes/head.html", 'r') do |file|
    content = file.read.gsub(/all(\.\d+)?\./, "all.#{asset_version}.")
  end
  File.open("#{source_dir}/_includes/head.html", 'w') do |file|
    file.write(content)
  end
end
{% endhighlight %}

If you look closely, I'm only updating content in the `<head>`. That's because I actually moved my `<script>` tags there (*gasp!*) and I
use the `async` attribute so it does not block and the browser can handle evaluating it when it's good and ready. This
results in the page loading even faster because it can asyncrhonously download JavaScript while the rest of the HTML and
CSS are being downloaded, then evaluate it later. You can look at the structure [here](https://github.com/eriwen/eriwen.com/blob/master/source/_includes/head.html).

Finally, we handle deployment. For syncing with Amazon S3, [s3cmd](http://s3tools.org/s3cmd) is priceless. It spares me the headache that would
come if I had to handle custom HTTP headers and mime-types myself. My inspiration for this setup came from [this blog post](http://fusion.dominicwatson.co.uk/2011/09/adding-gzip-to-my-jeyll-setup.html).

{% highlight ruby linenos=table %}
# Deploy config at top of Rakefile
deploy_default = "s3"

desc "Deploy website via s3cmd"
task :s3 do
  puts "## Deploying website via s3cmd"
  bucket = 'www.eriwen.com'
  s3cmd_path = '/path/to/s3cmd'
  # sync gzipped html files
  # NOTE: Setting charset in header for faster browser rendering
  ok_failed system("#{s3cmd_path} sync -P public/* s3://#{bucket}/ --mime-type='text/html; charset=utf-8' --add-header 'Content-Encoding: gzip' --exclude '*.*' --include '*.html'")
  # sync non gzipped, non js/css/image files
  ok_failed system("#{s3cmd_path} sync --guess-mime-type -P public/* s3://#{bucket}/ --exclude 'images/' --exclude '*.css' --exclude '*.js' --exclude '*.html'")
  # sync gzipped css and js
  ok_failed system("#{s3cmd_path} sync --guess-mime-type -P public/* s3://#{bucket}/ --add-header 'Content-Encoding: gzip' --add-header 'Cache-Control: public, max-age=31600000' --exclude '*.*' --include 'all.*.js' --include 'all.*.css'")
  # sync all images
  ok_failed system("#{s3cmd_path} sync --guess-mime-type -P --add-header 'Cache-Control: public, max-age=31600000' public/images/* s3://#{bucket}/images/")
end
{% endhighlight %}

I recommend that you download s3cmd version 1.1.0-beta2 or later as I'm using features from that version.

Lastly, we want to tell CloudFront that assets have changed by invalidating the old assets. That feature is supposed to
be in s3cmd v1.1.0 but doesn't seem to work yet, so I wrote a [script for it](https://github.com/eriwen/eriwen.com/blob/master/aws_cf_invalidate.rb).

## Putting It Together
To put all of these new Rake tasks to use, we update our `generate` task:

{% highlight ruby %}
desc "Generate jekyll site"
task :generate => [:sass, :update_asset_versions, :jekyll, :combine, :minify, :gzip]

desc "Generate website and deploy"
task :gen_deploy => [:integrate, :generate, :deploy]
{% endhighlight %}

And we're done! This cut down my *average post load time from 7 to 3 seconds*, including ~40 requests to disqus/twitter/etc. Here's
a chart with page timings from Google Analytics:

<img src="/images/load-time-chart.png" alt="Load Time Chart" class="img-center" />

If that sounds unimpressive, so you should know that `DOMContentLoaded` typically fires in under 400ms with an empty cache
(unless you're in Russia, apparently).

You should check out the [full Rakefile](https://github.com/eriwen/eriwen.com/blob/master/Rakefile) because it has
additional goodies like `preview` and coffeescript handling. You can also check out the rest
of the source for [eriwen.com on GitHub](https://github.com/eriwen/eriwen.com). Enjoy!
