const autoprefixer = require('autoprefixer');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = (env, argv) => {

    const isDev = argv.mode === 'development';

    return {
        output: {
            filename: "js/[name]-[hash:4].js"
        },
        module: {
            rules: [
                {
                    test: /\.html$/,
                    use: [
                        {
                            loader: "html-loader",
                            options: { minimize: !isDev }
                        }
                    ]
                },
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    query: {
                        presets: [['@babel/preset-env',
                            {targets: {browsers: ['ie >= 8']}}
                        ]]
                    }
                },
                {
                    test: /\.(css|sass|scss)$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 2,
                                sourceMap: true
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins:() => [
                                    autoprefixer({
                                        browsers:['ie >= 9', 'last 4 version']
                                    })
                                ],
                                sourceMap: true
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true
                            }
                        },
                    ],
                },
                {
                    test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                name: 'fonts/[name].[ext]',
                                limit: 10000,
                                mimetype: 'application/font-woff'
                            }
                        }
                    ]
                },
                {
                    test: /(ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
                    use: [{
                        loader: 'file-loader',
                        options: {
                            name: 'fonts/[name].[ext]'
                        }
                    }]
                },
                {
                    test: /\.(gif|png|jpe?g|svg)?$/i,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: 'img/[name].[ext]'
                            }
                        },
                        'image-webpack-loader'
                    ]
                }
            ]
        },
        plugins: [
            new CleanWebpackPlugin(['dist']),
            new HtmlWebPackPlugin({
                template: "./src/index.html",
                filename: "./index.html"
            }),
            new MiniCssExtractPlugin({
                filename: "[name]-[hash:8].css",
                chunkFilename: "[id].css"
            }),
            argv.size ? new BundleAnalyzerPlugin() : function () {}
        ]
    }
};