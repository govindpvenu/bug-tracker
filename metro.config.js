const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);
const assetExt = config.resolver?.assetExt ?? [];

config.resolver = config.resolver ?? {};

if (!assetExt.includes("wasm")) {
  config.resolver.assetExt = [...assetExt, "wasm"];
}

module.exports = withNativeWind(config, {
  input: "./global.css",
  inlineRem: 16,
});
