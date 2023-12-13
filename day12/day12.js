// part 1

const text = await Deno.readTextFile("./input.txt");
const lines = text.split("\n");

function parseLine(line, size) {
  let arr = [...Array(size).keys()];
  let parts = line.split(" ");
  let countSingle = parts[1].split(",").map(it => it * 1);
  let counts = arr.flatMap(it => countSingle);
  let springs = arr.map(it => parts[0]).join("?");
  return { springs, counts };
}

let memo = {};

function getCount(springs, counts, stopAt) {
  if (memo[springs + counts] != undefined) {
    return memo[springs + counts];
  }
  
  if (counts.length == 0) {
    if (springs.includes("#")) {
      return 0;
    }
    return 1;
  }
  const reg = new RegExp(`^([?.]+?)([#?]{${counts[0]}})([?.].*)`);
  let done = false;
  let count = 0;
  let current = springs;
  while (!done) {
    let match = reg.exec(current);
    if (match == null) {
      memo[springs + counts] = count;
      return count;
    }

    count += getCount(match[3], counts.slice(1), stopAt);
    current = current.substring(match[1].length);
  }
  memo[springs + counts] = count;
  return count;
}

// part 1

console.log(lines.map(l => parseLine(l, 1)).map(l => getCount("." + l.springs + ".", l.counts)).reduce((a, b) => a + b, 0))

// part 2

console.log(lines.map(l => parseLine(l, 5)).map(l => getCount("." + l.springs + ".", l.counts)).reduce((a, b) => a + b, 0))
