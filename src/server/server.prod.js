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
import http from 'http';
import https from 'http2';
import fs from 'fs';

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
  returnPolicy = path.join(DIST_DIR, "../dist/legal/return.html"),
  hostname = "167.172.226.138";


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


app.use(cors());
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(express.json());
app.set("trust proxy", true);
app.set("trust proxy", "loopback");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname + "../../dist")));
app.use((req, res, next) => {
  if (!req.secure) {
    return res.redirect(["https://", req.get("Host"), req.url].join(""));
  }
  next();
});

app.get("/", cors(), (_, res) => {
  res.sendFile(HTML_FILE);
});

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

//http.get("*", function(req, res) {
//  res.redirect("https://pmmweekend.com" + req.url);

  // Or, if you don't want to automatically detect the domain name from the request header, you can hard code it:
  // res.redirect('https://example.com' + req.url);
//});

//catch all endpoint will be Error Page
app.use('*', function (req, res) {
	res.sendStatus(404).sendFile(errorPg);
});


// app.listen(config.port, err => {
//   if (err) {
//     return console.log("error", err);
//   }
//   console.log(`server on port ${config.port}!`);
// });

// const options = {
//   hostname: "pmmweekend.com",
//   port: 443,
//   key: fs.readFileSync('test/fixtures/keys/agent2-key.pem'),
//   cert: fs.readFileSync('test/fixtures/keys/agent2-cert.pem')
// };

http.createServer(app).listen(8080, () => {
  console.log(`listening on 8080`);
});

// https.createServer(options, app).listen(433)

