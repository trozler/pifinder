const serverless = require("serverless-http");
const express = require("express");
const app = express();

const piFinder = require("./piFinder");
const arcTanEulerX = require("./arcTanEulerX");

// Allow JSON and url encoded post requests.
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post("/calculate", async (req, res) => {
  if (!req.body.hasOwnProperty("nDigits")) {
    res.status(400).send("POST doesn't include a key nDigits");
  }
  if (!req.body.hasOwnProperty("nCycles")) {
    res.status(400).send("POST doesn't include a key nCycles.");
  }

  const nDigits = parseInt(req.body["nDigits"]);
  const nCycles = parseInt(req.body["nCycles"]);

  if (isNaN(nDigits) || nDigits < 1 || nDigits > 100000) {
    res.status(400).send("nDigits value is bad.\nPlease set value to an integer in the range [1, 100,000]");
  }

  if (isNaN(nCycles) || nCycles < 1 || nCycles > 100000) {
    res.status(400).send("nCycles value is bad.\nPlease set value to an integer in the range [1, 100,000]");
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
  // const { x, nCycles, nDigits } = event.piConfig;
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

  // return {
  //   statusCode: 200,
  //   body: JSON.stringify({
  //     message: "Go Serverless v1.0! Your function executed successfully!",
  //     input: event,
  //   }),
  // };
});

// @ts-ignore
module.exports.handler = serverless(app);
