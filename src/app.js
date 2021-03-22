const serverless = require("serverless-http");
const express = require("express");
const app = express();

const piFinder = require("./piFinder");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post("/calculate", async (req, res) => {
  if (!req.body["nDigits"]) {
    return res.status(400).send("POST doesn't include a key nDigits.");
  }
  if (!req.body["nCycles"]) {
    return res.status(400).send("POST doesn't include a key nCycles.");
  }

  const nDigits = parseInt(req.body["nDigits"]);
  const nCycles = parseInt(req.body["nCycles"]);

  if (isNaN(nDigits) || nDigits < 1 || nDigits > 100000) {
    return res.status(400).send("nDigits value is bad.\nPlease set value to an integer in the range [1, 100,000]");
  }

  if (isNaN(nCycles) || nCycles < 1 || nCycles > 100000) {
    return res.status(400).send("nCycles value is bad.\nPlease set value to an integer in the range [1, 100,000]");
  }

  let pi;
  try {
    pi = await piFinder(nCycles, nDigits);
  } catch (e) {
    console.error(":::::piFinder error,", e);
    res.status(500).send("Unexpected server side error.");
  }
});

// @ts-ignore
module.exports.handler = serverless(app);
