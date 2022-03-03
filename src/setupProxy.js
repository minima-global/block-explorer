const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
    app.use(
        '/mds',
        createProxyMiddleware({
            target: 'http://localhost:8083',
            changeOrigin: true,
            pathRewrite: function (path, req) {
                return path;
            },
            logLevel: 'debug'
        })
    )
}
