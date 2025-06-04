function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

function floor(n: number) {
  return Math.trunc(n - Number(n < 0 && n % 1 !== 0));
}

const MathFunctions = {
  mod,
  floor,
};

export default MathFunctions;
