const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const privateKey = fs.readFileSync(
  path.join(process.cwd(), "source/cryptography/privateKey.pem"),
  "utf8"
);

function decryptData(encryptedData) {
  const buffer = Buffer.from(encryptedData, "base64");

  const decrypted = crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    },
    buffer
  );

  return decrypted.toString("utf8");
}

module.exports = decryptData;