import path from "path";
import express from "express";
import routes from "./routes/index.routes";
import morgan from "morgan";
import bodyParser from "body-parser";
import config from "./config/config";
import "@babel/polyfill";
import webpackHotMiddleware from "webpack-hot-middleware";
import webpack from "webpack";

const webPackConfig = require("../../webpack.config.dev.js");
const compiler = webpack(webPackConfig);

let app = express(),
  DIST_DIR = __dirname,
  HTML_FILE = path.join(DIST_DIR, "./index.html");

app.use(
  webpackHotMiddleware(compiler, {
    log: console.log,
    path: "/__webpack_hmr",
    heartbeat: 10 * 1000
  })
);

app.get("/", (_, res) => {
  res.sendFile(HTML_FILE);
});

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname + "../../dist")));
app.use("/api", routes);

app.listen(config.port, err => {
  if (err) {
    return console.log("error", err);
  }
  console.log(`server listening on port ${config.port}!`);
});
