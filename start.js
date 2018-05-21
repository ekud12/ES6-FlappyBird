/**
 * Author: Liel Kaysari
 * Import All Modules
 */
import bodyParser from "body-parser";
import errorHandler from "errorhandler";
import express from "express";
import http from "http";
import methodOverride from "method-override";
import logger from "morgan";
import path from "path";
import favicon from "serve-favicon";
import webpack from "webpack";
import webpackMiddleware from "webpack-dev-middleware";
import * as game from "./server/game";
import { config as Config } from "./config";
import webpackConfig from "./webpack.config.babel.js";

const app = express();

/**
 * Set Middleware
 */
app.use(webpackMiddleware(webpack(webpackConfig)));
app.set("port", Config.SERVER_PORT);
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.use(logger("dev"));
app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "client")));

let port = process.env.PORT || 5000;
Config.CLIENT_SOCKET = port;
console.log(Config.CLIENT_SOCKET);

/** TODO : REMOVE */
if ("development" == app.get("env")) {
  app.use(errorHandler());
}

app.get("/", (req, res) => {
  res.render("../client/flappytoucan", {
    ws: `${Config.SERVER_ADDRESS}:${Config.CLIENT_SOCKET}`
  });
});

/**
 * Load Config File
 */
app.get("/config.js", (req, res) => {
  res.sendFile("config.js", { root: __dirname });
});

/**
 * Start Server Listen on port
 */
const server = http.createServer(app).listen(app.get("port"), () => {
  console.log(`Afeka Flappy Toucan is ON! ${app.get("port")}`);
});

var io = require("socket.io").listen(server);

/**
 * Run Game on Server
 */
game.startServer();
