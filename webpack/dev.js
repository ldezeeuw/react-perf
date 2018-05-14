const path              = require('path');
const webpack           = require('webpack');
const package           = require('./../package.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin    = require('uglifyjs-webpack-plugin');

const BUILD_DIR         = path.resolve(__dirname, './../dist');
const APP_DIR           = path.resolve(__dirname, './../src/app');
const MODULES_DIR       = path.resolve(__dirname, './../node_modules');

let plugins = [
    new HtmlWebpackPlugin({title: 'Caching and Code Splitting', template: APP_DIR + '/rootContainers/index.html'}),
    new webpack.HashedModuleIdsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({minChunks: ({resource}) => /node_modules/.test(resource), name:'vendor', filename: 'vendor.[chunkhash].js'}),
    new webpack.optimize.CommonsChunkPlugin({name:'manifest'}),
    new webpack.DefinePlugin({'process.env.NODE_ENV': '"production"', 'process.env.PLATFORM_ENV': '"web"', 'process.env.BABEL_ENV': '"production"'}),
    new UglifyJSPlugin()
];

module.exports = {
    devServer: {
        historyApiFallback: true
    },
    entry: {
        app: APP_DIR +'/rootContainers/index.js'
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
        }, {
            test: /\.less$/,
            use: ['style-loader','css-loader',"less-loader"]
        }]
    },
    plugins
};
