// part 1

const text = await Deno.readTextFile("./input.txt");
const lines = text.split("\n");

function parseLine(line) {
  return line.split(" ");
}

function findNext(row) {
  return row.map((it, i) => choose(row.length, row.length - i) * it * Math.pow(-1, row.length - i + 1))
    .reduce((a, b) => a + b, 0);
}

function factorial(n) {
  if (n == 0) {
    return 1;
  }
  return factorial(n - 1) * n;
}

function choose(n, k) {
  return factorial(n) / (factorial(n - k) * factorial(k));
}

console.log(lines.map(parseLine).map(findNext).reduce((a, b) => a + b, 0));

// part 2

console.log(lines.map(parseLine).map(it => it.reverse()).map(findNext).reduce((a, b) => a + b, 0));
