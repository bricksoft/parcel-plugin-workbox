const workboxBuild = require("workbox-build");
const uglifyJS = require("uglify-js");
const logger = require("parcel-bundler/src/Logger");
const { writeFileSync } = require("fs");
const { workboxTask, useMinifyDefault } = require("./constants");

const getWorker = (options, minify = useMinifyDefault) => {
  const task = workboxTask(options);

  return workboxBuild[task](options)
    .then(swString => {
      logger.status("✓", "Service worker generated");
      if (minify) {
        swString = uglifyJS.minify(swString).code;
        logger.status("✓", "Service worker minified");
      }
      writeFileSync(options.swDest, swString);
      logger.status("✓", "Service worker written : " + options.wDest);
    })
    .catch(err => {
      logger.error(err);
    });
};

module.exports = getWorker;
