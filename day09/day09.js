// part 1

const text = await Deno.readTextFile("./input.txt");
const rows = text.split("\n").map(line => line.split(" "));

function findNext(row) {
  const n = row.length;
  return row.map((it, i) => choose(n, n - i) * it * Math.pow(-1, n - i + 1))
    .reduce((a, b) => a + b, 0);
}

function factorial(n) {
  return [...Array(n).keys()].map(i => i + 1).reduce((a,b) => a * b, 1);
}

function choose(n, k) {
  return factorial(n) / (factorial(n - k) * factorial(k));
}

console.log(rows.map(findNext).reduce((a, b) => a + b, 0));

// part 2

console.log(rows.map(it => it.reverse()).map(findNext).reduce((a, b) => a + b, 0));
