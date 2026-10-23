module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("resume.pdf");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("_headers");
  eleventyConfig.addPassthroughCopy("wrangler.jsonc");

  eleventyConfig.ignores.add("README.md");
  eleventyConfig.ignores.add("package.json");
  eleventyConfig.ignores.add("package-lock.json");

  // Collection: Return array of [tag, count] pairs
  eleventyConfig.addCollection("tagList", function(collectionApi) {
    let tagCount = {};
    collectionApi.getFilteredByGlob("posts/*.md").forEach(item => {
      if (item.data.tags) {
        item.data.tags.forEach(tag => {
          if (tag !== "posts") {
            tagCount[tag] = (tagCount[tag] || 0) + 1;
          }
        });
      }
    });
    return Object.entries(tagCount).sort();
  });

  // Collection: Return array of [archiveName, count] pairs
  eleventyConfig.addCollection("archiveList", function(collectionApi) {
    let archiveCount = {};
    collectionApi.getFilteredByGlob("posts/*.md").forEach(item => {
      let date = new Date(item.date);
      let year = date.getFullYear();
      let month = date.toLocaleString('default', { month: 'long' });
      let key = `${month} ${year}`;
      archiveCount[key] = (archiveCount[key] || 0) + 1;
    });
    return Object.entries(archiveCount);
  });

  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes"
    }
  };
};