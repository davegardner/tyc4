---
layout: layouts/times.njk
featuredImageTitle: Yachts
permalink: /responsiveness/
featuredImage: /images/uploads/_DAG6862.jpg
date: 2020-07-10
title: Responsiveness
eleventyNavigation:
  key: Responsiveness
  order: 999
description: Calculating rhythm
---
This is the original expression from [CSS Tricks ](https://css-tricks.com/math-css-locks/):

```css
@media (min-width: 320px) and (max-width: 959px) {
  h1 {
    font-size: calc( 1.5rem + 16 * (100vw - 320px) / (960 - 320) );
    /* For a negative slope, we have to invert the breakpoints */
    line-height: calc( 120% + 3.2 * (100vw - 960px) / (320 - 960) );
  }
}
```

If we subsitute named variables for the figures we get:

```css
@media (min-width: minWidth) and (max-width: maxWidth) {
  h1 {
    font-size: calc( 1.5rem + 16 * (viewportWidth - minWidth) / (maxWidth - minWidth) );
    /* For a negative slope, we have to invert the breakpoints */
    line-height: calc( 120% + 3.2 * (viewportWidth - maxWidth) / (minWidth - maxWidth) );
  }
}
```

And if we refactor this we get:

```css
@media (min-width: minWidth) and (max-width: maxWidth) {
  h1 {
    font-size: calc( 1.5rem + 16 * (viewportWidth - minWidth) / (maxWidth - minWidth) );
    /* For a negative slope, we have to invert the breakpoints */
    line-height: calc( 120% + 3.2 * (viewportWidth - maxWidth) / (minWidth - maxWidth) );
  }
}
```

## Images
Images are uploaded full-size (between 200px and 4000px wide).

The size of an image is specified in two ways:

- by html/css attributes such as `<img width="200"...>`

- and by appending the size as a querystring parameter to the image url as `/images/sample.jpg?nf_size=fit&w=200`

Image workflow relies on:
- git lfs

- Netlify CLI
