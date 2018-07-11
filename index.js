const logger = require("parcel-bundler/src/Logger");
const { workboxConfig: getWorkboxConfig, chars } = require("./constants");
const getServiceWorker = require("./serviceWorker");

module.exports = bundler => {
  const { outDir, minify } = bundler.options;
  let pkg = {};
  let workboxConfig = {};

  bundler.on("bundled", () => {
    // get package.json
    if (
      bundler.mainAsset &&
      bundler.mainAsset.package &&
      bundler.mainAsset.package.pkgfile
    ) {
      // for parcel-bundler version@<1.8
      pkg = require(bundler.mainAsset.package.pkgfile);
    } else if (bundler.mainBundle) {
      pkg = bundler.mainBundle.entryAsset.package;
    } else {
      logger.warn(chars.error, "mainAsset/mainBundle not available!");
      return;
    }

    workboxConfig = getWorkboxConfig(outDir, pkg);
    logger.status(chars.workbox, "Workbox");
    getServiceWorker(workboxConfig, minify);
  });
};
