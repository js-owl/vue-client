module.exports = {
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: "javascript/auto"
        }
      ] 
  },
  devServer: {
    disableHostCheck: true,
    proxy: {
      "/storage/": {
        target: "http://v2.elis.uaz.ru/",
        logLevel: "debug"
      }
    }
  }
  }
}

