const webpack           = require('webpack');
const path              = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const APP_DIR           = path.resolve(__dirname, './../src/app');
const BUILD_DIR         = path.resolve(__dirname, './../dist');
const MODULES_DIR       = path.resolve(__dirname, './../node_modules');
const package           = require('./../package.json');

module.exports = {
    devServer: {
        historyApiFallback: true
    },
    entry: {
        app: APP_DIR +'/rootContainers/index.js',
        vendor: Object.keys(package.dependencies)
    },
    output: {
        path: BUILD_DIR,
        publicPath: '/',
        chunkFilename: '[name].[chunkhash].js',
        filename: '[name].[chunkhash].js'
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        modules: [APP_DIR, MODULES_DIR]
    },
    module: {
        rules: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            include : APP_DIR,
            use: {
                loader: 'babel-loader'
            }
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({title: 'Caching and Code Splitting', template: BUILD_DIR + '/index.html'}),
        new webpack.HashedModuleIdsPlugin(),
        new webpack.optimize.CommonsChunkPlugin({name:'vendor', filename: 'vendor.[chunkhash].js'}),
        new webpack.optimize.CommonsChunkPlugin({name:'manifest'}),
        new webpack.DefinePlugin({'process.env.NODE_ENV': '"developpement"', 'process.env.PLATFORM_ENV': '"web"', 'process.env.BABEL_ENV': '"developpement"'}),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                screw_ie8: true,
                dead_code: true,
                unused: true
            },
            output: {comments: false},
            exclude: [/\.min\.js$/gi]
        })
    ]
};
