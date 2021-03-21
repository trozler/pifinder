const { Lambda } = require("aws-sdk");

const WorkerName =
  process.env.NODE_ENV != "production"
    ? "http://localhost:3002/dev/eu-central-1/pifinder-dev-worker"
    : process.env.WorkerLamda;

/**
 * @description This function will call 3 lamda functions and wait for the results.
 * Each will compute arctan(x).
 * Worker 1: arctan(18)
 * Worker 2: arctan(57)
 * Worker 3: arctan(239)
 */
const piFinder = async (nCycles, nDigits) => {
  console.log(":::::Start of pi finder.");
  console.log(":::::Name of worker:", process.env.WorkerLamda);

  const promises = [];
  for (const x of [18, 57, 239]) {
    console.log(`Invoking worker lamda with x=${x}.`);
    promises.push(
      new Lambda()
        .invoke({
          FunctionName: WorkerName,
          Payload: JSON.stringify({
            piConfig: {
              nCycles: nCycles,
              nDigits: nDigits,
              x: x,
            },
          }),
          InvocationType: "Event",
        })
        .promise()
    );
  }

  let res;
  try {
    res = await Promise.all(promises);
  } catch (e) {
    console.log(`invoke ERROR: ${e}`);
    throw e;
  }

  console.log(":::::promise res", res);

  const parts = [];
  for (const p of promises) {
    try {
      parts.push(BigInt(p));
    } catch (e) {
      console.error("Failed to convert piFinder result to BigInt.");
      throw e;
    }
  }

  const part0 = parts[0] * BigInt(12);
  const part1 = parts[1] * BigInt(8);
  const part2 = parts[2] * BigInt(5);

  const pi = (BigInt(4) * (part0 + part1 - part2)).toString();

  console.log(":::::n digits:", pi.length - 1);
  console.log(":::::pi raw:", pi);

  // Insert dot just before indexDot.
  const indexDot = pi.length - nDigits;
  const piDisplay = `${pi.slice(0, indexDot)}.${pi.slice(indexDot)}`;

  console.log(":::::pi:", piDisplay);

  return piDisplay;
};

module.exports = piFinder;

// InvocationType: "Event", // <-- This is the key to being Async If you need the response use RequestResponse
