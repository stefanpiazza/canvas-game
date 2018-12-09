'use strict';

const express = require('express');
const path = require('path');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const webpackConfig = require('./webpack.config.dev.js');
const compiler = webpack(webpackConfig);

const app = express();
const APP_PORT = 8000;

app.use(webpackDevMiddleware(compiler, webpackConfig.devServer));
app.use(webpackHotMiddleware(compiler, {
    log: console.log
}));

app.use('/static', express.static(path.join(__dirname, 'client/dist/static')));

app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});

app.listen(APP_PORT, () => {
    console.log(`App listening on port ${APP_PORT}`);
});