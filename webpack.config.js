const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    target: 'web',
    entry: {
        main: path.join(__dirname, 'src', 'index.tsx')
    },
    output: {
        filename: 'js/[name].bundle.js',
        path: path.resolve(__dirname, 'build')
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|tsx|ts)$/,
                exclude: /node_modules/,
                use: ["babel-loader"]
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.(hbs|handlebars)$/,
                exclude: /node_modules/,
                use: ['handlebars-loader']
            },
            {
                test: /\.(ico|jpg|jpeg|png|gif|webp|svg|eot|otf|ttf|woff|woff2)(\?.*)?$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: 'storage/[path][name].[ext]',
                    },
                },
            }
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            inject: true,
            hash: true,
            title: 'Cubic Spline Interpolation',
            template: path.join(__dirname, 'src', 'index.hbs')
        })
    ]
}
