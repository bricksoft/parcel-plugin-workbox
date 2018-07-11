const workboxConfigKey = "workbox";
const defaultConfig = outDir => ({
  globDirectory: outDir,
  globPatterns: ["**/*.{js,css,html,png}"],
  swDest: path.resolve(outDir, "service-worker.js")
});
const workboxConfig = (outDir, pkg) =>
  Object.assign.apply(null, [
    defaultConfig(outDir),
    pkg[workboxConfigKey] || {}
  ]);

const INJECT = "injectManifest";
const GENERATE = "generateSWString";
const workboxTask = options => (options.swSrc ? INJECT : GENERATE);

module.exports = {
  workboxConfigKey,
  defaultConfig,
  workboxConfig,
  workboxTask
};
