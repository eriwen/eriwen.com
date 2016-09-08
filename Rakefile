require "rubygems"
require "bundler/setup"
require "stringex"
require "fileutils"

## -- Deploy config -- ##
deploy_default = "s3"

## -- Misc Configs -- ##
public_dir      = "public"    # compiled site directory
source_dir      = "source"    # source file directory
blog_index_dir  = 'source'    # directory for your blog's index page (if you put your index in source/blog/index.html, set this to 'source/blog')
stash_dir       = "_stash"    # directory to stash posts for speedy generation
posts_dir       = "_posts"    # directory for blog files
themes_dir      = ".themes"   # directory for blog files
new_post_ext    = "markdown"  # default new post file extension when using the new_post task
new_page_ext    = "markdown"  # default new page file extension when using the new_page task
server_port     = "4000"      # port for preview server eg. localhost:4000
asset_version   = Time.new.strftime("%y%m%d%H%M") # For asset versioning


desc "Initial setup for Octopress: copies the default theme into the path of Jekyll's generator. Rake install defaults to rake install[classic] to install a different theme run rake install[some_theme_name]"
task :install, :theme do |_, args|
  if File.directory?(source_dir) || File.directory?("sass")
    abort("rake aborted!") if ask("A theme is already installed, proceeding will overwrite existing files. Are you sure?", %w(y n)) == 'n'
  end
  # copy theme into working Jekyll directories
  theme = args.theme || 'classic'
  puts "## Copying "+theme+" theme into ./#{source_dir} and ./sass"
  mkdir_p source_dir
  cp_r "#{themes_dir}/#{theme}/source/.", source_dir
  mkdir_p "sass"
  cp_r "#{themes_dir}/#{theme}/sass/.", "sass"
  mkdir_p "#{source_dir}/#{posts_dir}"
  mkdir_p public_dir
end

#######################
# Working with Jekyll #
#######################

desc "Generate jekyll site"
task :generate => [:sass, :update_asset_versions, :jekyll, :combine, :minify, :gzip]

desc "Process CoffeeScript"
task :coffee do
  raise "### You haven't set anything up yet. First run `rake install` to set up an Octopress theme." unless File.directory?(source_dir)
  puts "## Generating JS with CoffeeScriptRedux"
  system "#{ENV['COFFEESCRIPT_HOME']}/bin/coffee --js -i #{source_dir}/javascripts/custom.coffee > #{source_dir}/javascripts/custom_cstest.js"
  system "#{ENV['COFFEESCRIPT_HOME']}/bin/coffee --source-map -i #{source_dir}/javascripts/custom.coffee > #{source_dir}/javascripts/custom.js.map"
end

desc "Process Sass"
task :sass do
  raise "### You haven't set anything up yet. First run `rake install` to set up an Octopress theme." unless File.directory?(source_dir)
  puts "## Generating CSS with Compass"
  system "compass compile --sass-dir #{source_dir}/_sass --css-dir #{source_dir}/stylesheets --images-dir #{source_dir}/images"
end

desc "Run Jekyll"
task :jekyll do
  raise "### You haven't set anything up yet. First run `rake install` to set up an Octopress theme." unless File.directory?(source_dir)
  puts "## Generating Site with Jekyll"
  system "jekyll build"
end

desc "Combine CSS"
task :combine_css do
  puts "## Combining CSS"
  styles_dir = "#{source_dir}/stylesheets"
  system "cat #{styles_dir}/bootstrap/bootstrap.css #{styles_dir}/bootstrap/responsive.css #{styles_dir}/syntax/syntax.css #{styles_dir}/custom.css > #{styles_dir}/all.css"
end

desc "Combine JS"
task :combine_js do
  puts "## Combining JS"
  scripts_dir = "#{source_dir}/javascripts"
  system "cat #{scripts_dir}/custom.js > #{scripts_dir}/all.js"
end

desc "Combine CSS/JS"
task :combine => [:combine_css, :combine_js]

desc "Minify CSS"
task :minify_css do
  puts "## Minifying CSS"
  input = "#{source_dir}/stylesheets/all.css"
  output = "#{source_dir}/stylesheets/all.#{asset_version}.css"
  system "cleancss -e -o #{output} #{input}"
  Dir.glob("#{source_dir}/stylesheets/all.*").each do |f|
    FileUtils.cp(f, "#{public_dir}/stylesheets")
  end
end

desc "Minify JS"
task :minify_js do
  puts "## Minifying JS"
  input = "#{source_dir}/javascripts/all.js"
  output = "#{source_dir}/javascripts/all.#{asset_version}.js"
  source_map_option = "--source-map #{source_dir}/javascripts/all.#{asset_version}.js.map"
  source_map_root_option = "--source-map-root https://www.eriwen.com"
  system "uglifyjs #{input} -o #{output} #{source_map_option} #{source_map_root_option} -p 2 -m -c warnings=false"
  Dir.glob("#{source_dir}/javascripts/all.*").each do |f|
    FileUtils.cp(f, "#{public_dir}/javascripts")
  end
end

desc "Minify CSS/JS"
task :minify => [:minify_css, :minify_js]

desc "Optimize Images"
task :optimize_images do
  puts "## Optimizing Images"
  Dir.glob("#{source_dir}/images/*.{jp,pn}g").each do |f|
    webp_file = "#{f[0..-4]}webp"
    puts "Checking #{f} -> #{webp_file}"
    if test(?f, f) and not File.exists?(webp_file)
      ok_failed system("cwebp -q 100 #{f} -o #{webp_file}")
    end
  end
end

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

  system "gzip -9 #{scripts_dir}/stacktrace.min.js"
  system "mv #{scripts_dir}/stacktrace.min.js{.gz,}"
end

desc "GZip All"
task :gzip => [:gzip_html, :gzip_css, :gzip_js]

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

  content = ''
  File.open("#{source_dir}/_includes/after_footer.html", 'r') do |file|
    content = file.read.gsub(/all(\.\d+)?\./, "all.#{asset_version}.")
  end
  File.open("#{source_dir}/_includes/after_footer.html", 'w') do |file|
    file.write(content)
  end
end

desc "Watch the site and regenerate when it changes"
task :watch do
  raise "### You haven't set anything up yet. First run `rake install` to set up an Octopress theme." unless File.directory?(source_dir)
  puts "Starting to watch source with Jekyll and Compass."
  system "compass compile --css-dir #{source_dir}/stylesheets" unless File.exist?("#{source_dir}/stylesheets/screen.css")
  jekyll_pid = Process.spawn({"OCTOPRESS_ENV" =>"preview"}, "jekyll --auto")
  compass_pid = Process.spawn("compass watch")

  trap("INT") do
    [jekyll_pid, compass_pid].each { |pid| Process.kill(9, pid) rescue Errno::ESRCH }
    exit 0
  end

  [jekyll_pid, compass_pid].each { |pid| Process.wait(pid) }
end

desc "preview the site in a web browser"
task :preview do
  raise "### You haven't set anything up yet. First run `rake install` to set up an Octopress theme." unless File.directory?(source_dir)
  puts "Starting to watch source with Jekyll and Compass. Starting Rack on port #{server_port}"
  system "compass compile --css-dir #{source_dir}/stylesheets" unless File.exist?("#{source_dir}/stylesheets/screen.css")

  # Replace instances of all.{version}.js with all.js
  content = ''
  File.open("#{source_dir}/_includes/head.html", 'r') do |file|
    content = file.read.gsub(/all(\.\d+)?\./, "all.")
  end
  File.open("#{source_dir}/_includes/head.html", 'w') do |file|
    file.write(content)
  end

  jekyll_pid = Process.spawn({"OCTOPRESS_ENV" =>"preview"}, "jekyll --auto")
  compass_pid = Process.spawn("compass watch")
  rackup_pid = Process.spawn("rackup --port #{server_port}")

  trap("INT") do
    [jekyll_pid, compass_pid, rackup_pid].each { |pid| Process.kill(9, pid) rescue Errno::ESRCH }
    exit 0
  end

  [jekyll_pid, compass_pid, rackup_pid].each { |pid| Process.wait(pid) }
end

# usage rake new_post[my-new-post] or rake new_post['my new post'] or rake new_post (defaults to "new-post")
desc "Begin a new post in #{source_dir}/#{posts_dir}"
task :new_post, :title do |_, args|
  raise "### You haven't set anything up yet. First run `rake install` to set up an Octopress theme." unless File.directory?(source_dir)
  mkdir_p "#{source_dir}/#{posts_dir}"
  args.with_defaults(:title => 'new-post')
  title = args.title
  filename = "#{source_dir}/#{posts_dir}/#{Time.now.strftime('%Y-%m-%d')}-#{title.to_url}.#{new_post_ext}"
  if File.exist?(filename)
    abort("rake aborted!") if ask("#{filename} already exists. Do you want to overwrite?", %w(y n)) == 'n'
  end
  puts "Creating new post: #{filename}"
  open(filename, 'w') do |post|
    post.puts "---"
    post.puts "layout: post"
    post.puts "comments: true"
    post.puts "title: \"#{title.gsub(/&/,'&amp;')}\""
    post.puts "slug: #{title.downcase.gsub(/ /, '-')}"
    post.puts "published: false"
    post.puts "date: #{Time.now.strftime('%Y-%m-%d %H:%M')}"
    post.puts "category: "
    post.puts "---"
  end
end

# usage rake new_page[my-new-page] or rake new_page[my-new-page.html] or rake new_page (defaults to "new-page.markdown")
desc "Create a new page in #{source_dir}/(filename)/index.#{new_page_ext}"
task :new_page, :filename do |t, args|
  raise "### You haven't set anything up yet. First run `rake install` to set up an Octopress theme." unless File.directory?(source_dir)
  args.with_defaults(:filename => 'new-page')
  page_dir = [source_dir]
  if args.filename.downcase =~ /(^.+\/)?(.+)/
    filename, dot, extension = $2.rpartition('.').reject(&:empty?)         # Get filename and extension
    title = filename
    page_dir.concat($1.downcase.sub(/^\//, '').split('/')) unless $1.nil?  # Add path to page_dir Array
    if extension.nil?
      page_dir << filename
      filename = "index"
    end
    extension ||= new_page_ext
    page_dir = page_dir.map! { |d| d = d.to_url }.join('/')                # Sanitize path
    filename = filename.downcase.to_url

    mkdir_p page_dir
    file = "#{page_dir}/#{filename}.#{extension}"
    if File.exist?(file)
      abort("rake aborted!") if ask("#{file} already exists. Do you want to overwrite?", %w(y n)) == 'n'
    end
    puts "Creating new page: #{file}"
    open(file, 'w') do |page|
      page.puts "---"
      page.puts "layout: page"
      page.puts "title: \"#{title}\""
      page.puts "date: #{Time.now.strftime('%Y-%m-%d %H:%M')}"
      page.puts "comments: true"
      page.puts "sharing: true"
      page.puts "footer: true"
      page.puts "---"
    end
  else
    puts "Syntax error: #{args.filename} contains unsupported characters"
  end
end

# usage rake isolate[my-post]
desc "Move all other posts than the one currently being worked on to a temporary stash location (stash) so regenerating the site happens much quicker."
task :isolate, :filename do |_, args|
  stash_dir = "#{source_dir}/#{stash_dir}"
  FileUtils.mkdir(stash_dir) unless File.exist?(stash_dir)
  Dir.glob("#{source_dir}/#{posts_dir}/*.*") do |post|
    FileUtils.mv post, stash_dir unless post.include?(args.filename)
  end
end

desc "Move all stashed posts back into the posts directory, ready for site generation."
task :integrate do
  FileUtils.mv Dir.glob("#{source_dir}/#{stash_dir}/*.*"), "#{source_dir}/#{posts_dir}/"
end

desc "Clean out caches: .pygments-cache, .gist-cache, .sass-cache"
task :clean do
  rm_rf %w(.pygments-cache/** .gist-cache/** .sass-cache/** source/stylesheets/screen.css)
end

desc "Move sass to sass.old, install sass theme updates, replace sass/custom with sass.old/custom"
task :update_style, :theme do |_, args|
  theme = args.theme || 'classic'
  if File.directory?("sass.old")
    puts "removed existing sass.old directory"
    rm_r "sass.old", :secure=>true
  end
  mv "sass", "sass.old"
  puts "## Moved styles into sass.old/"
  cp_r "#{themes_dir}/"+theme+"/sass/", "sass"
  cp_r "sass.old/custom/.", "sass/custom"
  puts "## Updated Sass ##"
end

desc "Move source to source.old, install source theme updates, replace source/_includes/navigation.html with source.old's navigation"
task :update_source, :theme do |_, args|
  theme = args.theme || 'classic'
  if File.directory?("#{source_dir}.old")
    puts "## Removed existing #{source_dir}.old directory"
    rm_r "#{source_dir}.old", :secure=>true
  end
  mkdir "#{source_dir}.old"
  cp_r "#{source_dir}/.", "#{source_dir}.old"
  puts "## Copied #{source_dir} into #{source_dir}.old/"
  cp_r "#{themes_dir}/"+theme+"/source/.", source_dir, :remove_destination=>true
  cp_r "#{source_dir}.old/_includes/custom/.", "#{source_dir}/_includes/custom/", :remove_destination=>true
  cp "#{source_dir}.old/favicon.png", source_dir
  mv "#{source_dir}/index.html", "#{blog_index_dir}", :force=>true if blog_index_dir != source_dir
  cp "#{source_dir}.old/index.html", source_dir if blog_index_dir != source_dir && File.exists?("#{source_dir}.old/index.html")
  puts "## Updated #{source_dir} ##"
end

##############
# Deploying  #
##############

desc "Default deploy task"
task :deploy do
  # Check if preview posts exist, which should not be published
  if File.exists?(".preview-mode")
    puts "## Found posts in preview mode, regenerating files ..."
    File.delete(".preview-mode")
    Rake::Task[:generate].execute
  end

  Rake::Task[:copydot].invoke(source_dir, public_dir)
  Rake::Task["#{deploy_default}"].execute
end

desc "Deploy website via s3cmd"
task :s3 do
  puts "## Deploying website"
  bucket = 'www.eriwen.com'
  s3cmd_path = 'aws s3'
  # sync gzipped html files
  ok_failed system("#{s3cmd_path} sync --acl public-read public/ s3://#{bucket}/ --content-type 'text/html; charset=utf-8' --content-encoding 'gzip' --exclude '*.*' --include '*.html'")
  # sync non gzipped, non js/css/image files
  ok_failed system("#{s3cmd_path} sync --acl public-read public/ s3://#{bucket}/ --exclude 'images/' --exclude '*.css' --exclude '*.js' --exclude '*.html'")
  # sync gzipped css and js
  ok_failed system("#{s3cmd_path} sync --acl public-read public/stylesheets/ s3://#{bucket}/stylesheets/ --content-encoding 'gzip' --cache-control 'public, max-age=31600000'")
  ok_failed system("#{s3cmd_path} sync --acl public-read public/javascripts/ s3://#{bucket}/javascripts/ --content-encoding 'gzip' --cache-control 'public, max-age=31600000'")
  # sync all images
  ok_failed system("#{s3cmd_path} sync --acl public-read public/images/ s3://#{bucket}/images/ --cache-control 'public, max-age=31600000'")
end

desc "Generate website and deploy"
task :gen_deploy => [:clean, :integrate, :generate, :deploy]

desc "copy dot files for deployment"
task :copydot, :source, :dest do |_, args|
  FileList["#{args.source}/**/.*"].exclude("**/.", "**/..", "**/.DS_Store", "**/._*").each do |file|
    cp_r file, file.gsub(/#{args.source}/, "#{args.dest}") unless File.directory?(file)
  end
end

def ok_failed(condition)
  if condition
    puts "OK"
  else
    puts "FAILED"
  end
end

def get_stdin(message)
  print message
  STDIN.gets.chomp
end

def ask(message, valid_options)
  if valid_options
    answer = get_stdin("#{message} #{valid_options.to_s.gsub(/"/, '').gsub(/, /,'/')} ") while !valid_options.include?(answer)
  else
    answer = get_stdin(message)
  end
  answer
end

desc "list tasks"
task :list do
  puts "Tasks: #{(Rake::Task.tasks - [Rake::Task[:list]]).join(', ')}"
  puts "(type rake -T for more detail)\n\n"
end
