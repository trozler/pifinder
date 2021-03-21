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
      console.log(`break: term is 0, completed ${k} cycles out of ${nCycles} scheduled.`);
      break;
    }
    total += term;
    twoN += TWO;
  }

  return total;
};

/**
 *
 * @param {Number} nCycles
 * @param {Number} nDigits
 */
const piGauss = function (nCycles, nDigits) {
  if (nDigits > 1000000) {
    throw Error("Number of digits greater than 1M.");
  }

  const part1 = arcTanEulerX(18, nCycles, nDigits) * BigInt(12);
  const part2 = arcTanEulerX(57, nCycles, nDigits) * BigInt(8);
  const part3 = arcTanEulerX(239, nCycles, nDigits) * BigInt(5);

  const pi = (BigInt(4) * (part1 + part2 - part3)).toString();

  console.log("n digits:", pi.length - 1);
  console.log("pi raw:", pi);

  // Insert dot just before indexDot.
  const indexDot = pi.length - nDigits;
  const piDisplay = `${pi.slice(0, indexDot)}.${pi.slice(indexDot)}`;

  console.log("pi:", piDisplay);
};

piGauss(100, 50);
