require("dotenv").config();
const https = require("https");
const fs = require("fs");
const server = require("./api/server");

const port = process.env.PORT || 5000;
if (process.env.C9_HOSTNAME) {
  https
    .createServer(
      {
        key: fs.readFileSync("dev-server.key"),
        cert: fs.readFileSync("dev-server.cert"),
      },
      server
    )
    .listen(port, () => {
      console.log(
        `Listening on https://${process.env.C9_HOSTNAME || "localhost"}:${port}`
      );
    });
} else {
  server.listen(port, () => {
    console.log(`Listening on ${port}`);
  });
}
