# FreeBee 

## Description

FreeBee | 50  points | By  `Jack`

I want to read this really cool article, but they have a paywall Can you get me around that?

Web servers: [challs.bcactf.com:30771](http://challs.bcactf.com:30771/)

## Analysis

Website is a simple blog, but after half way we are asked to pay to view the rest. 

Let's view the source.
1. Website is static
2. There's no subscription

When searching for flag in the source nothing shows up.

The blur effect comes from CSS rule on class `b`

## Solution

After `In a fake interview with Dr. Michael Ramirez,` text there's a SVG image, if blur comes from CSS then what is it?

I copied svg into [svgviewer](https://www.svgviewer.dev)

![free-bee-1](/assets/ctf/bcactf/free-bee-1.png)

Flag: `bcactf{BEeutifUl_J0b}`