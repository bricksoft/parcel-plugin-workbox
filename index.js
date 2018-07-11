const logger = require("parcel-bundler/src/Logger");
const { workboxConfig: getWorkboxConfig } = require("./constants");
const getServiceWorker = require("./serviceWorker");

module.exports = bundle => {
  const { outDir, minify } = bundle.options;
  let pkg = {};

  // get package.json
  if (
    bundle.mainAsset &&
    bundle.mainAsset.package &&
    bundle.mainAsset.package.pkgfile
  ) {
    // for parcel-bundler version@<1.8
    pkg = require(bundle.mainAsset.package.pkgfile);
  } else {
    pkg = bundle.mainBundle.entryAsset.package;
  }

  const workboxConfig = getWorkboxConfig(outDir, pkg);
  bundle.on("bundled", () => {
    logger.status("🛠️", "Workbox");
    getServiceWorker(workboxConfig, minify);
  });
};
