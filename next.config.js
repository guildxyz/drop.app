module.exports = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            icon: true,
            replaceAttrValues: { "#fff": "currentColor" },
          },
        },
      ],
    })

    return config
  },

  images: {
    domains: ["cdn.discordapp.com", "ipfs.fleek.co"],
  },

  async redirects() {
    return [
      {
        source: "/js/script.js",
        destination: "https://stat.zgen.hu/js/plausible.js",
      },
      {
        source: "/api/event",
        destination: "https://stat.zgen.hu/api/event",
      },
    ]
  },
}
