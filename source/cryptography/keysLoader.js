const fs = require("fs");
const path = require("path");

function loadKey(file) {
  return fs.readFileSync(path.join(__dirname, file), "utf8");
}

module.exports = {
  publicKey: loadKey("publicKey.pem"),
  privateKey: loadKey("privateKey.pem"),
};
