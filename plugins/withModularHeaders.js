const { withPodfile } = require("expo/config-plugins");

/**
 * Config plugin to add use_modular_headers! to Podfile
 * Required for Firebase Swift pods to work with static libraries
 */
const withModularHeaders = (config) => {
  return withPodfile(config, (config) => {
    const podfile = config.modResults.contents;

    // Check if use_modular_headers! is already present
    if (!podfile.includes("use_modular_headers!")) {
      // Add use_modular_headers! after use_frameworks! or at the start of the target block
      config.modResults.contents = podfile.replace(
        /target '.*' do/,
        (match) => `use_modular_headers!\n\n${match}`
      );
    }

    return config;
  });
};

module.exports = withModularHeaders;
