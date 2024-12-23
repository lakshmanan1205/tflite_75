const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolver: {
    assetExts: ['tflite', 'jpg', 'png', 'json', 'ttf', 'otf'], // Include additional extensions if needed
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
