Assignment 4 - Visualizations and Multiple Views  
===

Demo Link: <https://lionandbull.github.io/04-MultipleViews/>

## Overview

![](https://ws4.sinaimg.cn/large/006tNc79ly1g1tp4nvqkkj31qa0u0gxd.jpg)

There are three different type of interactive views which are Time brush (on the top), Industry bar chart (on the left) and Map view (on the right). Interactions in any given view updates the other two. 

## Data Source

The data source of this project is from data.world – INC 5000 2017, which includes information of fastest growing private companies from 2007 to 2017. [[Downloadable CSV\]](https://data.world/aurielle/inc-5000-10-years). However, the original dataset is too big (It contains **34718** items) to making the whole visualization fluent, thus I only use **the first 8000 items** for the data visualization. I attched in gh-pages with name: data.json.

Screenshot:

![](https://ws1.sinaimg.cn/large/006tNc79ly1g1tpgv6ag8j32cu084q4i.jpg)

![](https://ws2.sinaimg.cn/large/006tNc79ly1g1tphplm89j32d60m0aij.jpg)

It has 8 properties which are city, industry, latitue, longitude, revenue, state, workers and year.

## Details

### Brush

![](https://ws1.sinaimg.cn/large/006tNc79ly1g1tpo3spmcj31am07swet.jpg)

For each year, each green rectangle indicates the total revenue of all companies in this year, higher rectangle means larger revenue. When we brush years, i.e. 

![](https://ws3.sinaimg.cn/large/006tNc79ly1g1tplht28mj319u0740t2.jpg)

it will include 2009, 2010 and 2011 three years data, and the others tow views will change correspondingly.

### Bar chart

![](https://ws4.sinaimg.cn/large/006tNc79ly1g1tpo94uuaj311g0lqwfx.jpg)

For each industry, the width of each brown rectangle means how many revenue of this type of industry in given years (we can control the range of years by Brush). We can move the mouse into any rectangle to show the explicity revenue and workers:

![](https://ws1.sinaimg.cn/large/006tNc79ly1g1tptnjvsrj311o0kqabz.jpg)

When we click and rectangle, it leads the Map and the Brush only show data containing the specific industry. 

### Map

![](https://ws4.sinaimg.cn/large/006tNc79ly1g1tpv4omlhj31600sa0zf.jpg)

Each circle contains the specific information of each single company, the size stands for how large the revenue they had in a year. When moving mouse into any circle, it will show all relevant information. Since the information will disappear immediately after our mouse move out, it's hard to take a screenshot. So I will not present the picture here.

After we click any circle, the other two views will show the city's relevant information where the company locates in. For example, we click a circle in the city Englewood, the bar chart shows this city only has four type of industries as well as the revenue, and the Brush also shows relevant information where the companies locate in Englewood:

![](https://ws2.sinaimg.cn/large/006tNc79ly1g1tq3o4ypfj31tr0u0k1r.jpg)

## Design Achievements

From this visualization, we can discover the dataset more efficiently and throughly.

- We can know which industry got the most revenue or what are the top 3 industries which earned most revenue in a given year or among years. Based on this, we can learn what types of companies are more profitable and growing rapidly.
- We also can know which city or what cities has/have more profitable companies, and what region company wants to locate.
- We also can know what's the total revenue of a given year or years of different industries.

## Technical Achievements

### Visualization (D3.js)

- Designed bar chart
- Designed Map view
- Designed Brush view
- Achieved interactions among the three visualizations

### Website (HTML, React, JS, Bootstrap)

Use this combination to make a simple, fast and interactive website.