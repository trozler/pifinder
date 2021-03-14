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

module.exports = arcTanEulerX;
