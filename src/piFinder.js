const { Lambda } = require("aws-sdk");

/**
 * @description This function will call 3 lamda functions and wait for the results.
 */
const piFinder = async (event) => {
  const { x, nCycles, nDigits } = JSON.parse(event.body);

  console.log(`before calling test2(${process.env.Lambda2})`);
  try {
    let res = await new Lambda()
      .invoke({
        FunctionName: process.env.workerLamda,
        Payload: JSON.stringify({
          piConfig: "",
        }),
        InvocationType: "Event",
      })
      .promise();

    console.log(`invoke test2 response: ${JSON.stringify(res, null, 2)}`);
  } catch (err) {
    console.log(`invoke ERROR: ${err}`);
  }
  console.log(`after calling test2`);
};

module.exports = piFinder;

// InvocationType: "Event", // <-- This is the key to being Async If you need the response use RequestResponse
