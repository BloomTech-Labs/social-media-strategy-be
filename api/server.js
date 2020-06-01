const express = require("express");
const server = express();
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");

const apiRouter = require("./routers/apiRouter");

const corsConfig = {
  origin: process.env.APP_URL,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

server.use(cors(corsConfig));

server.use(express.json());
server.use(morgan("combined"));
server.use(helmet());

server.get("/", (req, res) => {
  res.status(200).json({ message: "IT'S WORKING!!!" });
});

server.use("/api", apiRouter);
server.use(errorHandler);

module.exports = server;

function errorHandler(err, req, res, next) {
  res.status(err.code || 500).send(err.message || "Server Error");
}
