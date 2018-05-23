/**
 * Author: Liel Kaysari
 *     ID: 201322054
 */
/**
 * Main App Endpoint imports and initialization.
 * I use ejs to serve html, and webpack to bundle the entire
 * app.
 * I used some more middleware here to support bundling.
 */
import { config as Config } from './config';
import express from 'express';
import http from 'http';
import path from 'path';
import favicon from 'serve-favicon';
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import * as mainServer from './server/MainController';
import webpackConfig from './webpack.config.babel.js';

const app = express();
const port = process.env.PORT || 5000;
/**
 * Set Middleware
 */
app.use(webpackMiddleware(webpack(webpackConfig)));
app.set('port', port);
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'client')));
app.use(favicon(path.join(__dirname, 'client/assets/images', 'favicon.ico')));

app.get('/', (req, res) => {
  res.render('../client/flappytoucan');
});

/**
 * Load Config File Endpoint for client
 */
app.get('/config.js', (req, res) => {
  res.sendFile('config.js', { root: __dirname });
});

/**
 * Start Server Listen on port
 */
const server = http.createServer(app).listen(app.get('port'), () => {
  console.log(`Afeka Flappy Toucan is Live On port: ${app.get('port')}.`);
});

const io = require('socket.io')(server, { pingTimeout: 30000 });

/**
 * Run a Server Instance for the game and give it out server's socket.io instance
 */
mainServer.initializeServer(io);
