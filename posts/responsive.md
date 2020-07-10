---
layout: layouts/post.njk
title: Responsiveness
description: Calculating rhythm
date: 2020-07-10
---

```
@media (min-width: 320px) and (max-width: 959px) {
  h1 {
    font-size: calc( 1.5rem + 16 * (100vw - 320px) / (960 - 320) );
    /* For a negative slope, we have to invert the breakpoints */
    line-height: calc( 120% + 3.2 * (100vw - 960px) / (320 - 960) );
  }
}
```

