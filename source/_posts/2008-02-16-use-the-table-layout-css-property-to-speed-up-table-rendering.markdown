---
date: '2008-02-16 22:21:26'
layout: post
comments: true
slug: use-the-table-layout-css-property-to-speed-up-table-rendering
status: publish
title: Use the table-layout CSS property to speed up table rendering
wordpress_id: '31'
categories: css
---

A rarely used CSS property that can be very useful given the right circumstances is the `table-layout` property. It has great rendering speed benefit when used properly. Obviously this will only apply to HTML `<table>`s, which I know none of you would EVER overuse. Tables are not totally evil, they have their proper implementations and their really, really bad ones. OK, on to the code:

{% highlight css %}
/* Set table to 'fixed' (fastest render) layout */
.fixed_table {
    table-layout: fixed;
}

/* Set table to 'auto' (best fit) layout. This is the default */
.auto_table {
    table-layout: auto;
}
{% endhighlight %}

Or alternatively in JavaScript:

{% highlight javascript %}
$('elementID').style.tableLayout = 'fixed';
{% endhighlight %}

## When you want to use _table-layout: fixed_

How fixed table layout works is that the browser **looks at the first row of the table and determines how to render the table based on the table width and the columns but NOT on the content** of the columns. This allows large tables to be rendered faster but risks the table not displaying "optimally". The best place to use _table-layout: fixed_ is on larger tables (probably > 50 rows) and fairly uniform table cells (as in the cells should evenly divide the table). The benefit can be significant when the browser does not have to calculate the optimal width of each table cell.

## When you want to keep the default style _table-layout: auto_

There is almost no benefit to setting a small table to _table-layout: fixed_. Furthermore, if the cell content varies greatly in length, your table may look really funky and different browsers may display your table in quite odd ways. Let me show you what I mean. Here is a quick example:

- - -

<table style="table-layout:fixed"><caption>Fixed table-layout</caption><thead><tr><th style="width:120px;">Header 1</th><th>Reallyreallyreallyreally looooong header</th><th style="width:120px;">Header 3</th></tr></thead>
<tbody><tr><td>Reallyyyyyyyyyy Looooooong cell conteeeent</td><td>short</td><td>Normal cell content</td></tr>
<tr><td>short</td><td>ReallyyyyyyyyyyLooooooong cell conteeeent</td><td>Normal cell content</td></tr></tbody></table>

<table><caption>Auto table-layout</caption><thead><tr><th>Header 1</th><th>Reallyreallyreallyreally looooong header</th><th>Header 3</th></tr></thead>
<tbody><tr><td>Reallyyyyyyyyyy Looooooong cell conteeeent</td><td>short</td><td>Normal cell content</td></tr>
<tr><td>short</td><td>ReallyyyyyyyyyyLooooooong cell conteeeent</td><td>Normal cell content</td></tr></tbody></table>

So don't mess with _table-layout: auto_ in these circumstances because it is just too unreliable. The harsh reality here with the automatic table layout is that the:

> algorithm is sometimes slow since it needs to access all the content in the table before determining the final layout

This is why nesting or otherwise overusing `<table>`s is a bad idea.

For those interested, here is the [official spec](http://www.w3.org/TR/CSS2/tables.html#propdef-table-layout) from the W3C. Have you ever used the _table-layout_ CSS property? Was it useful and what was the result? Let's hear it!
