const workboxBuild = require("workbox-build");
const uglifyJS = require("uglify-js");
const logger = require("parcel-bundler/src/Logger");
const { readFile, writeFileSync } = require("fs");
const {
  workboxTask,
  useMinifyDefault,
  defaultEncoding,
  chars
} = require("./constants");
const formatBytes = require("./formatBytes.js");

const getWorker = (options, minify = useMinifyDefault) => {
  const task = workboxTask(options);
  let swData = {
    count: 0,
    size: 0,
    warnings: []
  };

  return workboxBuild[task](options)
    .then(data => {
      if (typeof data === "object") {
        swData = data;
        return data;
      }
    })
    .then(src => {
      return typeof src !== "object" && typeof src !== "undefined"
        ? `${src}`
        : Promise.resolve(
            new Promise((resolve, reject) =>
              readFile(
                options.swDest,
                defaultEncoding,
                (err, data) => (err ? reject(err) : resolve(data))
              )
            )
          );
    })
    .then(swString => {
      logger.status(chars.success, "Service worker generated");
      return swString;
    })
    .then(swString => {
      let minified = swString;
      if (minify) {
        minified = uglifyJS.minify(minified).code;
        logger.status(chars.success, "Service worker minified");
      }
      return minified;
    })
    .then(swString => {
      writeFileSync(options.swDest, swString);
      logger.status(chars.success, `Workbox finished : ${options.swDest}`);
    })
    .then(() => {
      let { size } = swData;
      size = formatBytes(size);
      logger.status(
        chars.link,
        `${swData.count} files will be precached, totalling ${size}.`
      );
    })
    .catch(err => {
      logger.status(chars.error, `Workbox failed : ${err}`);
    });
};

module.exports = getWorker;
