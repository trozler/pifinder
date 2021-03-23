const arcTanEuler = require("./arcTanEuler");
/**
 *
 * @param {Object} event runtime will have converted JSON formatted string to object.
 * @returns all data will be JSON.stringified automatically.
 * https://docs.aws.amazon.com/lambda/latest/dg/nodejs-handler.html
 *
 */
const worker = function (event, context, callback) {
  console.log("event:", JSON.stringify(event, null, 2));

  if (!event.piConfig) {
    return callback(new Error("no piConfig specialised."));
  }

  const { x, nCycles, nDigits } = event.piConfig;
  let res;
  try {
    res = arcTanEuler(x, nCycles, nDigits).toString();
  } catch (e) {
    return callback(e);
  }

  // console.log(`:::::x: ${x}, res: ${res}`);

  // Do not stringify as auto done for you.
  return callback(null, {
    x: x,
    res: res,
  });
};

module.exports.handler = worker;
