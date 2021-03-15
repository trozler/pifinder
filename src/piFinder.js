const { Lambda } = require("aws-sdk");

/**
 * @description This function will call 3 lamda functions and wait for the results.
 * Each will compute arctan(x).
 * Worker 1: arctan(18)
 * Worker 2: arctan(57)
 * Worker 3: arctan(239)
 */
const piFinder = async (nCycles, nDigits) => {
  const promises = [
    new Lambda()
      .invoke({
        FunctionName: process.env.workerLamda,
        Payload: JSON.stringify({
          piConfig: {
            nCycles: nCycles,
            nDigits: nDigits,
            x: 18,
          },
        }),
        InvocationType: "Event",
      })
      .promise(),
    new Lambda()
      .invoke({
        FunctionName: process.env.workerLamda,
        Payload: JSON.stringify({
          piConfig: {
            nCycles: nCycles,
            nDigits: nDigits,
            x: 57,
          },
        }),
        InvocationType: "Event",
      })
      .promise(),
    new Lambda()
      .invoke({
        FunctionName: process.env.workerLamda,
        Payload: JSON.stringify({
          piConfig: {
            nCycles: nCycles,
            nDigits: nDigits,
            x: 239,
          },
        }),
        InvocationType: "Event",
      })
      .promise(),
  ];

  let res;
  try {
    res = await Promise.all(promises);
  } catch (e) {
    console.log(`invoke ERROR: ${e}`);
    throw e;
  }
};

module.exports = piFinder;

// InvocationType: "Event", // <-- This is the key to being Async If you need the response use RequestResponse
