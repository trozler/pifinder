const serverless = require("serverless-http");
const express = require("express");
const app = express();

const piFinder = require("./piFinder");
const arcTanEulerX = require("./arcTanEulerX");

// Allow JSON and url encoded post requests.
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

// worker lamda function is routed here.
// verify that a new instance is created when spawn multiple.
app.post("/worker", (req, res) => {
  console.log(req.body);
  // const { x, nCycles, nDigits } = req.body.piConfig;
  // return {
  //   statusCode: 200,
  //   body: JSON.stringify({
  //     res: arcTanEulerX(x, nCycles, nDigits),
  //   }),
  // };
});

// helloTest lamda function is routed here.
app.get("/helloTest", async (req, res) => {
  console.log(req.body);
  res.send("helloTest works");
});

// @ts-ignore
module.exports.handler = serverless(app);

/*
  https://www.serverless.com/blog/serverless-express-rest-api#path-specific-routing

  Each serverless function will have the same code, express app etc.
  But depedning on the route a different serverless function will be invoked. 
  This allows the serverless functions to run in a distributed manner.

  Why use path specifc routing?
  Creates a simple interface for our application.
  Since application is very small bloating is of little concern.
*/
