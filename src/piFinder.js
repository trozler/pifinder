const { Lambda } = require("aws-sdk");

/**
 *
 * @description This function will call 3 lamda functions and wait for the results.
 * Each will compute arctan(x).
 * Worker 1: arctan(18)
 * Worker 2: arctan(57)
 * Worker 3: arctan(239)
 * @param {Number} nCycles
 * @param {Number} nDigits
 */
const piFinder = async (nCycles, nDigits) => {
  console.log(":::::Start of pi finder.");
  console.log(":::::Name of worker:", process.env.workerLamda);

  const promises = [];
  for (const x of [18, 57, 239]) {
    console.log(`Invoking worker lamda with x=${x}.`);
    promises.push(
      new Lambda()
        .invoke({
          FunctionName: process.env.workerLamda,
          Payload: JSON.stringify({
            // needs to be JSON stringified.
            // event.piConfig will access payload in Lambda.
            piConfig: {
              nCycles: nCycles,
              nDigits: nDigits,
              x: x,
            },
          }),
          InvocationType: "RequestResponse",
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

  let part0;
  let part1;
  let part2;

  for (const p of res) {
    console.log(":::::typeof p.Payload:", typeof p.Payload);
    const body = JSON.parse(p.Payload.toString());
    console.log(":::::body worker function:", body);

    if (body === null) {
      console.error("body is null. body:", body);
      throw new Error("body is null: " + body);
    } else if (p.FunctionError) {
      console.error("Function error with lamda. Payload:", body);
      throw new Error(body.toString());
    } else if (Math.floor(p.StatusCode / 100) !== 2) {
      console.error(`Function bad status code. StatusCode: ${p.StatusCode}, Payload: ${body}`);
      throw new Error(body.toString());
    } else if (body.hasError) {
      console.error(`Server side handled error. Payload: ${body}`);
      throw new Error(body.toString());
    }

    try {
      switch (body.x) {
        case 18: {
          part0 = BigInt(body.res) * BigInt(12);
          break;
        }
        case 57: {
          part1 = BigInt(body.res) * BigInt(8);
          break;
        }
        case 239: {
          part2 = BigInt(body.res) * BigInt(5);
          break;
        }
        default:
          break;
      }
    } catch (e) {
      console.error("Failed to convert piFinder result to BigInt.");
      throw e;
    }
  }

  if (!(part0 && part1 && part2)) {
    console.error(`Failed to find all 3 parts.`);
    throw new Error("Failed to find all 3 parts.");
  }

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
