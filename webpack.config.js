const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const devMode = process.env.NODE_ENV !== 'production';


module.exports = {
    mode: 'development',

    // base source path
    context: path.resolve(__dirname, 'src'),

    // entry file names to compile
    entry: {
        app: [
            './js/index.js',
            './scss/styles.scss'
        ]
    },

    // entry file names to compile
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: "js/[name].js",
        publicPath: "/" // относительная ссылка для подстановки итоговых файлов в браузер для webpack-dev-server
    },

    // enable source maps
    devtool: 'inline-source-map',

    // directory for starting webpack dev server
    devServer: {
        contentBase: 'dist',
        overlay: true
    },

    // connect other plugins

    plugins: [
        new HtmlWebpackPlugin({ template: './index.html' }),
        new MiniCssExtractPlugin({ filename: "./css/[name].css" }),
        new CopyWebpackPlugin([{ from: './img/static/', to: './img/static/' }]),
        new ImageminPlugin({ test: /\.(jpe?g|png|gif)$/i }),
    ],

    // optimizing configuration
    optimization: {
        minimizer: [
            new OptimizeCSSAssetsPlugin({}),
        ]
    },

    // setting up file extensions handlers
    module: {
        rules: [
            {
                test: /\.txt$/,
                use: 'raw-loader'
            },
            {
                // Styles loader
                test: /\.(sa|sc|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ],
            },
            // Image loader (for styles)
            {
                test: /\.(png|jpe?g|gif)$/,
                loaders: [
                    {
                        loader: 'file-loader',
                        options: { name: '[path][name].[ext]' },
                    },
                    {
                        loader: 'img-loader',
                        options: {
                            plugins: [
                                require('imagemin-gifsicle')({
                                    interlaced: false
                                }),
                                require('imagemin-mozjpeg')({
                                    progressive: true,
                                    arithmetic: false
                                }),
                                require('imagemin-pngquant')({
                                    floyd: 0.5,
                                    speed: 2
                                }),
                                require('imagemin-svgo')({
                                    plugins: [
                                        { removeTitle: true },
                                        { convertPathData: false }
                                    ]
                                })
                            ]
                        }
                    }
                ]
            },
            // SVG converter into 'data:image'
            {
                test: /\.svg$/,
                loader: 'svg-url-loader',
            },
        ]
    },

};

// If you want to change the behavior according to the mode variable inside the webpack.config.js, you have to export a function instead of an object:
// module.exports = (env, argv) => {
//     // if (argv.mode === 'development') {
//     //     config.devtool = 'source-map';
//     // }

//     // if (argv.mode === 'production') {
//     //     //...
//     // }

//     return config;
// };