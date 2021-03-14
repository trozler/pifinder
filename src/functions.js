// All functions will be imported into here and exported.
const piFinder = require("./piFinder");
const arcTanEulerX = require("./arcTanEulerX");

const helloTest = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Go Serverless v1.0! Your function executed successfully!",
      input: event,
    }),
  };
};

const worker = function (event) {
  const { x, nCycles, nDigits } = event.piConfig;
  return {
    statusCode: 200,
    body: JSON.stringify({
      res: arcTanEulerX(x, nCycles, nDigits),
    }),
  };
};

/**
 * @description Function that will be hit with post.
 * We export a mini express app here.
 * @param {Object} event
 * @returns
 */
const calculate = async (event) => {
  if (event.hasOwnProperty("body")) {
    return {
      statusCode: 400,
      message: "post contains no body.",
    };
  }

  let pi;
  try {
    pi = await piFinder();
  } catch (e) {
    return {
      statusCode: 500,
      body: e,
    };
  }
  return {
    statusCode: 200,
    body: pi,
  };
};

module.exports = {
  helloTest: helloTest,
  worker: worker,
  calculate: calculate,
};
