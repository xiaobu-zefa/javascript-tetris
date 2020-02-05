const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('Mini-css-extract-plugin');

module.exports = {
    entry: {
        index: path.join(__dirname, 'src/index.js'),
    },
    output: {
        path: path.join(__dirname, 'dist/'),
    },

    module: {
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            },
            {
                test: /\.less$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader']
            },
            {
                test: /\.png|.ogg|.wav|.ttf|.woff2|.woff|.eot|.svg$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10,
                        }
                    }
                ]
            },
        ],
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src/index.html'),
            filename: 'index.html',
            inject: true,
            hash: true,
            title: '俄罗斯方块',
            chunks: ['index'],
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
        }),
    ],

    devServer: {
        port: 5500,
        open: true,
        hot: true,
    },
};