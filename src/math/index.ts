function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

function floor(n: number) {
  if (n % 1 === 0) return n;
  return n >= 0 ? Math.trunc(n) : Math.trunc(n - 1);
}

function abs(n: number) {
  return n < 0 ? -n : n;
}

const MathFunctions = {
  mod,
  floor,
  abs,
};

export default MathFunctions;
