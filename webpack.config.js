const autoprefixer = require('autoprefixer');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env, argv) => {

    const isDev = argv.mode === 'development';

    return {
        module: {
            rules: [
                {
                    test: /\.html$/,
                    use: [
                        {
                            loader: "html-loader",
                            options: { minimize: false }
                        }
                    ]
                },
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    query: {
                        presets: [['@babel/preset-env', {targets: {browsers: ['ie >= 8']}}]],
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
                                sourceMap: true,
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins:() => [
                                    autoprefixer({
                                        browsers:['ie >= 8', 'last 4 version']
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
                // {
                //     test: /\.scss$/,
                //     use: [
                //         {
                //             loader: 'file-loader',
                //             options: {
                //                 name: '[name].css',
                //                 outputPath: 'css/'
                //             }
                //         },
                //         {
                //             loader: 'extract-loader'
                //         },
                //         {
                //             loader: 'css-loader',
                //             options: {
                //                 minimize: !isDev,
                //                 sourceMap: true
                //             }
                //         },
                //         {
                //             loader: 'postcss-loader',
                //             options: {
                //                 plugins: [
                //                     autoprefixer({
                //                         browsers:['ie >= 8', 'last 4 version']
                //                     })
                //                 ],
                //                 sourceMap: true
                //             }
                //         },
                //         {
                //             loader: "sass-loader" // compiles Sass to CSS
                //         }
                //     ]
                // }
            ]
        },
        plugins: [
            argv.size ? new BundleAnalyzerPlugin() : function () {},
            new HtmlWebPackPlugin({
                template: "./src/index.html",
                filename: "./index.html"
            }),
            new MiniCssExtractPlugin({
                filename: "css/[name]-[hash:8].css",
                chunkFilename: "[id].css"
            })
        ]
    }
};