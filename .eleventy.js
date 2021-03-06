module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy('images')
  eleventyConfig.addPassthroughCopy('admin')
  eleventyConfig.addPassthroughCopy('css') // todo: minify and inline
  eleventyConfig.addPassthroughCopy('js') // todo: minify and inline
  eleventyConfig.addPassthroughCopy({ "images/favicons": "/" })

  // Does deep data merging fix the tags problem?
  eleventyConfig.setDataDeepMerge(true);

  const mdOptions = {
    html: true,
    breaks: false,
    linkify: true
  }

  const responsiveOptions = {
    responsive: {
      'srcset': {
        '*': [        // <= files matching this wildcard pattern
          {                     // rule 0
            width: 450,         // request a file this width
            nf_resize: 'fit',   // from netlify transformations: https://docs.netlify.com/large-media/transform-images/
          },
          {                     // rule 1
            width: 800,         // and this width
            nf_resize: 'fit'    // use netlify transformations: https://docs.netlify.com/large-media/transform-images/
          },
          {                     // rule 2, etc
            width: 1200,
            nf_resize: 'fit'
          },
          // more rules can go here
        ]
      },
      'sizes': { // this list must match wildcard pattern above
        '*': '(min-width: 1800px) 1200px, (min-width: 1200px) 800px, (min-width: 560px) 450px, 80vw',
      }
    }
  };

  // setup markdown-it with responsive image plugin
  // var responsive = require('@davegardner/markdown-it-responsive');
  //var markdownIt = require('markdown-it');
  //markdownIt(mdOptions).use( require('@davegardner/markdown-it-responsive'), responsiveOptions );
  //eleventyConfig.setLibrary("md", markdownIt());

  var md = require('markdown-it')(mdOptions).use( require('@davegardner/markdown-it-responsive'), responsiveOptions );
  eleventyConfig.setLibrary("md", md);
  
  // This universal shortcode is needed to 'include' markdown for partials. 
  // Frontmatter in partials is ignored.
  const markdownShortcode = require("eleventy-plugin-markdown-shortcode");
  eleventyConfig.addPlugin(markdownShortcode, mdOptions);

  const {
    DateTime
  } = require("luxon");

  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter('htmlDateString', (dateObj) => {
    return DateTime.fromJSDate(dateObj, {
      zone: 'local'
    }).toFormat('yy-MM-dd');
  });

  eleventyConfig.addFilter("readableDate", dateObj => {
    return DateTime.fromJSDate(dateObj, {
      zone: 'local'
    }).toFormat("dd-MM-yy");
  });

  // Date of last build
  eleventyConfig.addShortcode("buildDate", function () {
    return new Date();
  });

  // Date of last build
  eleventyConfig.addShortcode("fullBuildDate", function () {
    const dt = DateTime.local();
    return dt.toLocaleString(DateTime.DATETIME_FULL);

  });

  // Displays date in the form 'SATURDAY, 11 JULY 2020'
  eleventyConfig.addFilter("toNewspaperDate", dateObj => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const date = `${days[dateObj.getDay()]}, ${dateObj.getDate()} ${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
    return date;
  });

  // Current date time.
  eleventyConfig.addFilter("fullDate", dateObj => {
    const dt = new DateTime.local();
    return dt.toLocaleString(DATETIME_FULL);
  });

  // navigation
  const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  // local taglist (not used)
  eleventyConfig.addCollection("tagList", require("./_11ty/getTagList"));

  // Get the first `n` elements of a collection.
  eleventyConfig.addFilter("head", (array, n) => {
    if (n < 0) {
      return array.slice(n);
    }

    return array.slice(0, n);
  });

  // sass transpile
  const pluginSass = require("eleventy-plugin-sass");
  eleventyConfig.addPlugin(pluginSass);

  // minify css
  const CleanCSS = require("clean-css");
  eleventyConfig.addFilter("cssmin", function (code) {
    return new CleanCSS({}).minify(code).styles;
  });


};

