---
layout: post
comments: true
title: "Analyzing library use with BigQuery"
slug: analyzing-library-use-bigquery-github-activity
published: true
date: 2019-07-15 06:00
category: analytics
---

How do people use your technology? 
Ask any website owner, and they'll point to rich Google Analytics charts. 
Many applications have built-in analytics that tell developers how features are used.
If you are an OSS library author, however, you don't have these tools available.

In this post, I'm going to demonstrate how you can use BigQuery to get usage info for your open-source libraries.
[Skip ahead to the advanced stuff](#library-use-analysis-with-example-queries) if you don't need any convincing.

## Are library analytics important?
I think it's widely accepted that data driven decision-making is effective in many circumstances.
Having downloads data is only a course-grained adoption indicator, but it does not help you understand important usage questions like:

 * How many users would I break if I change this API?
 * Are projects adopting this new feature?
 * Which deprecated APIs can I drop from the next major version?
 * In what context are people using this library?
 
I have provided [examples to start answering these questions](#library-use-analysis-with-example-queries) below.
 
In my experience, even partial data and answers can de-risk large efforts or stop fatally flawed work before investing too much.
[Understand your default action first](https://hbr.org/2019/06/the-first-thing-great-decision-makers-do) before jumping into data.

Data analysis won't help you if you don't have much data, obviously.
Even if you haven't shipped something to measure, much can be learned from how users use similar technologies.

## What you need to know about BigQuery
I'm not going to cover how to use [Google BigQuery](https://cloud.google.com/bigquery/) in this post.
They have [excellent docs](https://cloud.google.com/bigquery/docs/) that will give you the basics in a jiffy.

All you need to know is:

 * It is a very high-scale data store queried using a [standard SQL syntax](https://cloud.google.com/bigquery/docs/reference/standard-sql/).
 * It has [many useful public data sets](https://console.cloud.google.com/marketplace/browse?filter=solution-type:dataset), including a [GitHub Activity dataset](https://console.cloud.google.com/marketplace/details/github/github-repos?filter=solution-type:dataset&id=46ee22ab-2ca4-4750-81a7-3ee0f0150dcb) we'll see today.
 * You can query up to 1TB of data per month for free. You can get quite a lot done with that amount; I share [data-savings tips below](#todo).
 
BigQuery is awesome.
You might feel a child-like sense of wonder when querying Terabytes in seconds.

## Library use analysis with example queries
Here are some queries I make to answer common questions about my projects. 
You can try these out yourself after you [enable BigQuery and the GitHub Activity dataset](https://cloud.google.com/bigquery/public-data/) on your Google account.

The first thing we'll want to do is save a subset of file contents to our own table to save a bunch of data.
Make sure you "Create Dataset" so you can store your own BigQuery tables.
You can story 10GB for free.

Create your own (much smaller) `files` and `contents` tables.
Change the `WHERE` clauses to only match what you're interested in.

{% highlight sql %}
-- "Save Result" to '<your_dataset>.files' table
SELECT f.id id, f.repo_name repo, f.path path
FROM `bigquery-public-data.github_repos.files` f
WHERE f.path LIKE '%.gradle%';
{% endhighlight %}

The `github_repos` dataset has contents of all files under 1MB.
Change `<your_dataset>` and note this is only querying `github_repos.sample_contents` to save your data for demo purposes; change to `contents` to get everything. 
{% highlight sql %}
-- "Save Result" to '<your_dataset>.contents' table
SELECT
  files.id AS id,
  files.repo AS repo_name,
  contents.content
FROM
  `<your_dataset>.files` files,
  `bigquery-public-data.github_repos.sample_contents` contents
WHERE files.id = contents.id;
{% endhighlight %}

**NOTE**: subsequent sections of this article will use `<your_dataset>` in order to save data.

### Counting Project Adoption
First, let's count the number of repositories that use the library or API we're interested in.
For example, we can count the number of open-source Android applications this way:

{% highlight sql %}
SELECT COUNT(DISTINCT files.repo)
FROM
  `<your_dataset>.files` files,
  `<your_dataset>.contents` contents
WHERE
  files.id = contents.id
  AND files.path LIKE 'build.gradle%'
  AND contents.content LIKE '%com.android.application%';
{% endhighlight %}

You can inspect build scripts or `yarn.lock` or other files to get a different view of usage by version than what you'd get from your download numbers. 

You might want to filter out repositories with little activity.
You can join to the `commits` table to achieve this:

{% highlight sql %}
SELECT repo, TIMESTAMP_SECONDS(created_date) AS created_date
FROM (
  SELECT repo, MIN(committer.date.seconds) AS created_date
  FROM
    `bigquery-public-data.github_repos.commits` commits,
    UNNEST(commits.repo_name) AS repo
  WHERE
    repo IN (
    SELECT files.repo
    FROM `<your_dataset>.files` files, `<your_dataset>.contents` contents
    WHERE
      files.id = contents.id
      AND files.path LIKE 'build.gradle%'
      AND contents.content LIKE '%android%')
  GROUP BY repo
  HAVING COUNT(committer.date) >= 5
)
ORDER BY created_date DESC;
{% endhighlight %}

I haven't found a way to use BigQuery to find the timestamp when the code I'm interested in was added.
This is possible with the GitHub API, however, if you have found a better way to achieve this please comment.

### Counting uses of specific APIs
I often count results to see if they are statistically meaningful before doing text processing.

Now that you have a smaller dataset, you can query without much fear of using a ton of data.
Even then, Google Cloud offers a $300 free trial credit and won't charge actual money without asking.

Here's a query that counts the repos that use the `@CacheableTask` (a Gradle API for build caching).
{% highlight sql %}
SELECT COUNT(DISTINCT c.repo_name)
FROM
  `<your_dataset>.contents` c,
  UNNEST(SPLIT(content, '\n')) line
WHERE line LIKE '@CacheableTask%';
{% endhighlight %}

This will just return the count.
You can also rank uses of a subset of APIs.
For example, this query ranks internal APIs by most used:

{% highlight sql %}
SELECT
  REGEXP_EXTRACT(line, r'import ([a-zA-Z0-9\._]*)') class,
  COUNT(DISTINCT c.id) count
FROM
  `<your_dataset>.contents` c,
  UNNEST(SPLIT(content, '\n')) line
WHERE line LIKE 'import org.gradle.%internal%'
GROUP BY 1
ORDER BY count DESC
LIMIT 10;
{% endhighlight %}

### How a given API is used
The GitHub Activity BigQuery dataset has all properly-licenced sources under 1Mb.
We can use this to look at the sources that use an API we're interested in.

This query will select the details of all files that use a given API:
{% highlight sql %}
SELECT c.id, c.repo_name, f.path, c.content
FROM
  `<your_dataset>.contents` c,
  `<your_dataset>.files` f
WHERE
  c.id = f.id
  AND c.content LIKE '%@CacheableTask%';
{% endhighlight %}

You can also look for remote endpoint identifiers such as `https://myservice.company.com/api/`.

This will give us all context surrounding the use of the API.
We can store this into another BigQuery table for further analysis.

Of course, you can also look at single lines instead (exploring use of Gradle's ObjectFactory here):
{% highlight sql %}
SELECT c.id, c.repo_name, f.path, line
FROM
  `<your_dataset>.contents` c,
  `<your_dataset>.files` f,
  UNNEST(SPLIT(content, '\n')) line
WHERE
  c.id = f.id 
  AND line LIKE '%project.objects%';
{% endhighlight %}

The results will look something like this:

| --------- | ---- |
| **gradle-docker-plugin** | `val filteredImageName : Property<String> = project.objects.property(String::class)` |
| **ultrasonic** | `ListProperty<File> jacocoFiles = project.objects.listProperty(File.class)` |
| **gradle-script-kotlin** | `val message = project.objects.property<String>()` |
| **zap-extensions** | `val declaredAddOns = project.objects.setProperty<String>()` |

--- 

From here you can dig deeper into how your APIs are (or aren't) used.

## Advanced tips
Here are some pro tips for working with BigQuery, and the `github_repos` public dataset in particular.

### Use the `sample_` tables for testing before querying full dataset
The `github_repos.contents` and `github_repos.files` tables are very large. 
Try your queries using `sample_*` tables first.
**Heads up**: The schemas for `sample_*` tables are *slightly different*.

### Save query results to a new BigQuery table and use it for subsequent queries
I'm repeating myself here because this tip is important: query large datasets only once to get the interesting subset, then query that table. You can store 10GB for free.

### Use _Cmd-Shift-F_ in the BigQuery editor to format your query
I've found a good number of bugs in my queries by using the built-in formatting.
There are other shortcuts for running queries and auto-suggestions as well.

## Conclusion
I hope you found this a useful introduction to using BigQuery for OSS analysis.

If you want to go deeper, you might consider downloading and parsing sources using ASTs.
Matt Silverlock posted some [interesting slides that describe this](https://speakerdeck.com/campoy/csi-gopher).

Have you used this technique to understand OSS usage?
If so, what have you learned?