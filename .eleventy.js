module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy('images')
  eleventyConfig.addPassthroughCopy('admin')
  eleventyConfig.addPassthroughCopy('css') // todo: minify and inline
  eleventyConfig.addPassthroughCopy('js') // todo: minify and inline
  eleventyConfig.addPassthroughCopy({ "images/favicons": "/" })

  let markdownIt = require("markdown-it");
  let mdOptions = {
    html: true,
    breaks: true,
    linkify: true
  };
  eleventyConfig.setLibrary("md", markdownIt(mdOptions));

  const markdownShortcode = require("eleventy-plugin-markdown-shortcode");
  eleventyConfig.addPlugin(markdownShortcode, mdOptions);

  const {
    DateTime
  } = require("luxon");

  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter('htmlDateString', (dateObj) => {
    return DateTime.fromJSDate(dateObj, {
      zone: 'utc'
    }).toFormat('yy-MM-dd');
  });

  eleventyConfig.addFilter("readableDate", dateObj => {
    return DateTime.fromJSDate(dateObj, {
      zone: 'utc'
    }).toFormat("dd-MM-yy");
  });

  const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  eleventyConfig.addCollection("tagList", require("./_11ty/getTagList"));

  // Get the first `n` elements of a collection.
  eleventyConfig.addFilter("head", (array, n) => {
    if (n < 0) {
      return array.slice(n);
    }

    return array.slice(0, n);
  });

  const pluginSass = require("eleventy-plugin-sass");
  eleventyConfig.addPlugin(pluginSass);

};

