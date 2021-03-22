/**
 * @description A fast way to find arctan(x).
 * @param {Number} x
 * @param {Number} nCycles
 * @param {Number} nDigits
 */
const arcTanEulerX = function (x, nCycles, nDigits) {
  let fixedPoint = BigInt(Math.pow(10, nDigits));

  let xSquared = BigInt(x * x);
  let xSquaredPlus1 = xSquared + BigInt(1);
  let term = (BigInt(x) * fixedPoint) / xSquaredPlus1;
  let total = (BigInt(x) * fixedPoint) / xSquaredPlus1;

  const TWO = BigInt(2);
  const ZERO = BigInt(0);
  const ONE = BigInt(1);
  let twoN = BigInt(2);

  for (let k = 0; k < nCycles; k++) {
    let divisor = (twoN + ONE) * xSquaredPlus1;
    term *= twoN;
    term = term / divisor;

    if (term === ZERO) {
      console.log(`break converged: term is 0, completed ${k} cycles out of ${nCycles} scheduled.`);
      break;
    }
    total += term;
    twoN += TWO;
  }

  return total;
};

/**
 *
 * @param {Object} event don't have to JSON parse anything.
 * @returns all data will be JSON.stringified automatically.
 */
const worker = function (event) {
  console.log("event:", JSON.stringify(event, null, 2));

  if (!event.piConfig) {
    return JSON.stringify({
      hasError: true,
      error: "no piConfig specialised.",
    });
  }

  const { x, nCycles, nDigits } = event.piConfig;
  let res;
  try {
    res = arcTanEulerX(x, nCycles, nDigits).toString();
  } catch (error) {
    return JSON.stringify({
      hasError: true,
      error: error,
    });
  }

  console.log(`:::::x: ${x}, res: ${res}`);

  return JSON.stringify({
    x: x,
    res: res,
  });
};

module.exports.handler = worker;
