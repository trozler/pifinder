const arcTanEuler = require("../arcTanEuler");
/**
 *
 * @param {Number} nCycles
 * @param {Number} nDigits
 */
const piGauss = function (nCycles, nDigits) {
  if (nDigits > 1000000) {
    throw Error("Number of digits greater than 1M.");
  }

  const part1 = arcTanEuler(18, nCycles, nDigits) * BigInt(12);
  const part2 = arcTanEuler(57, nCycles, nDigits) * BigInt(8);
  const part3 = arcTanEuler(239, nCycles, nDigits) * BigInt(5);

  const pi = (BigInt(4) * (part1 + part2 - part3)).toString();

  console.log("n digits:", pi.length - 1);
  console.log("pi raw:", pi);

  // Insert dot just before indexDot.
  const indexDot = pi.length - nDigits;
  const piDisplay = `${pi.slice(0, indexDot)}.${pi.slice(indexDot)}`;

  console.log("pi:", piDisplay);
};

piGauss(100, 50);
