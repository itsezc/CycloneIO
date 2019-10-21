module.exports = function (api) {

    api.cache(true)

    const presets = [
        '@babel/preset-env',
        '@babel/preset-typescript',
    ]

    const plugins = [
        '@babel/plugin-transform-runtime',
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-object-rest-spread',
        '@babel/plugin-transform-classes'
    ]

    const ignore = []

    return {
        presets,
        plugins,
        ignore
    }
}