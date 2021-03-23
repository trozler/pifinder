/**
 * @description A fast way to find arctan(x).
 * @param {Number} x
 * @param {Number} nCycles
 * @param {Number} nDigits
 * Thank you Craig Wood.
 * https://www.craig-wood.com/nick/articles/pi-machin/
 *
 */
const arcTanEuler = function (x, nCycles, nDigits) {
  let fixedPoint = BigInt(10) ** BigInt(nDigits);

  const X = BigInt(x);

  let xSquared = X * X;
  let xSquaredPlus1 = xSquared + BigInt(1);
  let term = (X * fixedPoint) / xSquaredPlus1;
  let total = (X * fixedPoint) / xSquaredPlus1;

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

module.exports = arcTanEuler;
