/*******************************************************************************
 * (C) Copyright
 * Logivations GmbH, Munich 2010-2021
 ******************************************************************************/

module.exports = function(api) {
	api.cache(true);
	return {
		presets: ['babel-preset-expo'],
	};
};
