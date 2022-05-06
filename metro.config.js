/*******************************************************************************
 * (C) Copyright
 * Logivations GmbH, Munich 2010-2021
 ******************************************************************************/

const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');
config.resolver.minifierConfig = {
	assetExts: config.resolver.assetExts.filter(ext => ext !== 'svg'),
	sourceExts: [...config.resolver.sourceExts, 'svg', 'mp3'],
};

module.exports = config;
