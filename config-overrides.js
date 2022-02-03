module.exports = function override(config, env) {
  config.resolve.fallback = {
    fs: false,
    tls: false,
    net: false,
    path: false,
    zlib: false,
    http: false,
    https: false,
    stream: false,
    crypto: false,
    util: false,
  }

  return config
}
