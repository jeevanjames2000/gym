const { getDefaultConfig } = require("expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

module.exports = {
  ...defaultConfig,
  resolver: {
    ...defaultConfig.resolver,
    sourceExts: [...defaultConfig.resolver.sourceExts, "cjs"],
    alias: {
      "@components": "./components",
      "@screens": "./components/screens",
      "@assets": "./assets",
    },
  },
};
