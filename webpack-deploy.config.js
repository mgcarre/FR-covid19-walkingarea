const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
    mode: 'production',
    entry: './dist/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'public'),
    },
    plugins: [
        new Dotenv({
            safe: true, // load '.env.example' to verify the '.env' variables are all set. Can also be a string to a different file.
            systemvars: false, // load all the predefined 'process.env' variables which will trump anything local per dotenv specs.
            silent: true, // hide any errors
            defaults: false // load '.env.defaults' as the default values if empty.
        })
    ]
};