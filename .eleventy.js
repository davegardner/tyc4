module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy('images')
  eleventyConfig.addPassthroughCopy('admin')
  eleventyConfig.addPassthroughCopy('css') // todo: minify and inline
  eleventyConfig.addPassthroughCopy('js') // todo: minify and inline
  eleventyConfig.addPassthroughCopy({ "images/favicons": "/" })

  // Does deep data merging fix the tags problem?
  eleventyConfig.setDataDeepMerge(true);

  const markdownIt = require("markdown-it");
  const mdOptions = {
    html: true,
    breaks: false,
    linkify: true
  };
  eleventyConfig.setLibrary("md", markdownIt(mdOptions));

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
      zone: 'utc'
    }).toFormat('yy-MM-dd');
  });

  eleventyConfig.addFilter("readableDate", dateObj => {
    return DateTime.fromJSDate(dateObj, {
      zone: 'utc'
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

  eleventyConfig.addFilter("toNewspaperDate", dateObj => {
    dateObj = new Date();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const date = `${days[dateObj.getDay()]}, ${dateObj.getDate()} ${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
    // return `${dateObj}`;
    return date;
  });

  eleventyConfig.addFilter("fullDate", dateObj => {
    const dt = new DateTime.local();
    return dt.toLocaleString(DATETIME_FULL);
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

