import crypto from "node:crypto";
import fs from "node:fs";

const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: "pkcs1",
    format: "pem",
  },
  privateKeyEncoding: {
    type: "pkcs1",
    format: "pem",
  },
});

fs.writeFileSync("certificates/private.pem", privateKey);
fs.writeFileSync("certificates/public.pem", publicKey);