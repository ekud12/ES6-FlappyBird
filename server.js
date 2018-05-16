/** Author: Liel Kaysari */
/**
 * Import All Modules
 */
import bodyParser from 'body-parser';
import errorHandler from 'errorhandler';
import express from 'express';
import http from 'http';
import methodOverride from 'method-override';
import logger from 'morgan';
import path from 'path';
import favicon from 'serve-favicon';
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import * as game from './game_files/game';
import { constant as Const } from './global';
import webpackConfig from './webpack.config.babel.js';

const app = express();
app.use(webpackMiddleware(webpack(webpackConfig)));

app.set('port', Const.SERVER_PORT);
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// all environments
app.use(logger('dev'));
app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

/** TODO : REMOVE */
if ('development' == app.get('env')) {
  app.use(errorHandler());
}

app.get('/', (req, res) => {
  res.render('../public/flappybird', { ws: `${Const.SOCKET_ADDR}:${Const.SOCKET_PORT}` });
});
app.get('/global.js', (req, res) => {
  res.sendfile('global.js');
});

http.createServer(app).listen(app.get('port'), () => {
  console.log(`Afeka Flappy Bird is ON! ${app.get('port')}`);
});

game.startServer();
