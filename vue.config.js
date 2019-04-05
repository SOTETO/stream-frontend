module.exports = {
    chainWebpack: config => {
        config.module
            .rule("vue")
            .use("vue-svg-inline-loader")
            .loader("vue-svg-inline-loader")
            .options({ /* ... */ });
    },
    baseUrl: process.env.NODE_ENV === 'production'
        ? '/stream/'
        : '/stream/'
}
