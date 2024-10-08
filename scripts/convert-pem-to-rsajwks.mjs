import fs from "node:fs";
import rsaPemToJwk from "rsa-pem-to-jwk";

const privateKey = fs.readFileSync("./certs/public.pem");

const jwk = rsaPemToJwk(
  privateKey,
  {
    use: "sig",
  },
  "public",
);

console.log(JSON.stringify(jwk));