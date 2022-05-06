const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function (app) {
    app.use((req, res, next) => {
        res.removeHeader('Cross-Origin-Resource-Policy');
        res.removeHeader('Cross-Origin-Embedder-Policy');
        next();
    });
    const drupalProxy = createProxyMiddleware({
      target: "https://news.gramene.org/ww",
      changeOrigin: true
    });
    app.use('/ww', drupalProxy);
};
