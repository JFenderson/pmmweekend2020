import path from "path";
import express from "express";
import routes from "./routes/index.routes";
import morgan from "morgan";
import bodyParser from "body-parser";
import config from "./config/config";
import "@babel/polyfill";
import webpackHotMiddleware from "webpack-hot-middleware";
import webpack from "webpack";
import cors from 'cors';
import dotenv from "dotenv";

dotenv.config();

const webPackConfig = require("../../webpack.config.prod.js");
const compiler = webpack(webPackConfig);

let app = express(),
  DIST_DIR = __dirname,
  HTML_FILE = path.join(DIST_DIR, "./index.html"),
  errorPg = path.join(DIST_DIR, "../dist/404.html"), //this is your error page
  legal = path.join(DIST_DIR, "../dist/legal/legal.html"),
  privatePolicy = path.join(DIST_DIR, "../dist/legal/privatePolicy.html"),
  cookiesPolicy = path.join(DIST_DIR, "../dist/legal/cookiesPolicy.html"),
  term = path.join(DIST_DIR, "../dist/legal/term.html"),
  returnPolicy = path.join(DIST_DIR, "../dist/legal/return.html");

if (process.env.NODE_ENV !== "production") {
	console.log("Looks like we are in development mode!");
}

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

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(express.json());
app.set("trust proxy", true);
app.set("trust proxy", "loopback");
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname + "../../dist")));
app.use("/api", routes);

// getting legal html files
app.get('/legal/legal', (_,res) => {
  res.sendFile(legal)
})
app.get('/legal/term', (_,res) => {
  res.sendFile(term)
})
app.get('/legal/privatePolicy', (_,res) => {
  res.sendFile(privatePolicy)
})
app.get('/legal/cookiesPolicy', (_,res) => {
  res.sendFile(cookiesPolicy)
})
app.get('/legal/return', (_,res) => {
  res.sendFile(returnPolicy)
})

//catch all endpoint will be Error Page
app.use('*', function (req, res) {
	res.sendStatus(404).sendFile(errorPg);
});

app.listen(config.port, "167.172.226.138", err => {
  if (err) {
    return console.log("error", err);
  }
  console.log(`server on port ${config.port}!`);
});
