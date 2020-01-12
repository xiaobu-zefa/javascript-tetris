const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');



module.exports = {
    entry: {
        index: __dirname + '/src/js/index.js',
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'js/[name].js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']

            },
            {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'less-loader']
            },
        ]
    },


    devServer: {
        port: 5500,
        open: true,
        writeToDisk: true,
    },


    plugins: [
        // 拷贝静态文件到发布目录
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, 'src/*.html'),
                to: path.resolve(__dirname, 'dist/[name].[ext]'),
                toType: 'template',
            },
            {
                from: path.resolve(__dirname, 'src/audio'),
                to: path.resolve(__dirname, 'dist/audio/[name].[ext]'),
                toType: 'template',
            },
            {
                from: path.resolve(__dirname, 'src/imgs'),
                to: path.resolve(__dirname, 'dist/imgs/[name].[ext]'),
                toType: 'template',
            },
        ]),
    ]
};