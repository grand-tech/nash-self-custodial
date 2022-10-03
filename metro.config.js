/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

// List of node modules compatible with react native.
const nodeLibs = require('node-libs-react-native');

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    extraNodeModules: {
      ...nodeLibs,
      net: require.resolve('react-native-tcp'),
      fs: require.resolve('react-native-fs'),
    },
  },
};
