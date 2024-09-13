const { i18n } = require('./next-i18next.config.js');

module.exports = {
  i18n,
  reactStrictMode: true,
  webpack(config, { isServer }) {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
      };
    }
    return config;
  },
};
