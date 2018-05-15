/** Author: Liel Kaysari */
/**
 * Import All Modules
 */
import express from 'express';
import webpackMiddleware from 'webpack-dev-middleware';
import webpack from 'webpack';
import webpackConfig from './webpack.config.babel.js';
import * as routes from './routes';
import http from 'http';
import path from 'path';
import { constant as Const } from './global';
import favicon from 'serve-favicon';
import logger from 'morgan';
import methodOverride from 'method-override';
import session from 'express-session';
import bodyParser from 'body-parser';
import multer from 'multer';
import errorHandler from 'errorhandler';
import * as game from './game_files/game';

const app = express();
app.use(webpackMiddleware(webpack(webpackConfig)));

app.set('port', Const.SERVER_PORT);
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// all environments
app.use(favicon(path.join(__dirname, '/public/images/favicon.ico')));
app.use(logger('dev'));
app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
// development only

if ('development' == app.get('env')) {
  app.use(errorHandler());
}

app.get('/birds', routes.birds);
app.get('/global.js', (req, res) => {
  res.sendfile('global.js');
});

http.createServer(app).listen(app.get('port'), () => {
  console.log(`Express server listening on port ${app.get('port')}`);
});

game.startServer();
