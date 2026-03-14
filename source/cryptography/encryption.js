const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const publicKey = fs.readFileSync(
  path.join(process.cwd(), "source/cryptography/publicKey.pem"),
  "utf8"
);

function encryptData(data) {
  const buffer = Buffer.from(data, "utf8");

  const encrypted = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    },
    buffer
  );

  return encrypted.toString("base64");
}

module.exports = encryptData;