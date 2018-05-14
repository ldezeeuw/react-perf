const webpack               = require('webpack');
const path                  = require('path');
const package               = require('./../package.json');
const HtmlWebpackPlugin     = require('html-webpack-plugin');
const UglifyJSPlugin        = require('uglifyjs-webpack-plugin');
const CompressionPlugin     = require('compression-webpack-plugin');
const BundleAnalyzerPlugin  = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const APP_DIR               = path.resolve(__dirname, './../src/app');
const BUILD_DIR             = path.resolve(__dirname, './../dist');
const MODULES_DIR           = path.resolve(__dirname, './../node_modules');

const plugins = [
    new HtmlWebpackPlugin({title: 'Caching and Code Splitting', template: BUILD_DIR + '/index.html'}),
    new webpack.HashedModuleIdsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({name:'vendor', filename: 'vendor.[chunkhash].js'}),
    new webpack.optimize.CommonsChunkPlugin({name:'manifest'}),
    new webpack.DefinePlugin({'process.env.NODE_ENV': '"production"', 'process.env.PLATFORM_ENV': '"web"', 'process.env.BABEL_ENV': '"production"'}),
    new webpack.NoEmitOnErrorsPlugin(),
    new UglifyJSPlugin(),
    new CompressionPlugin({
        asset: "[path].gz[query]",
        algorithm: "gzip",
        test: /\.js$|\.css$|\.html$/,
        threshold: 10240,
        minRatio: 0.8
    })
];

if (process.argv.indexOf('debug') > -1)
    plugins.push(new BundleAnalyzerPlugin());

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
        }, {
            test: /\.less$/,
            use: ['style-loader','css-loader',"less-loader"]
        }]
    },
    plugins
};
