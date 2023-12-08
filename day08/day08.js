// part 1

const text = await Deno.readTextFile("./practice.txt");
let parts = text.split("\n\n");
let paths = {};
const reg = /(.{3}) = \((.{3}), (.{3})\)/;

function parseLine(line) {
  var match = reg.exec(line);
  paths[match[1]] = {
    "L": match[2],
    "R": match[3]
  };
}

parts[1].split("\n").forEach(parseLine);

let instructions = parts[0].split("");

function countSteps() {
  let count = 0;
  let current = "AAA";
  while (current != "ZZZ") {
    current = paths[current][instructions[count % instructions.length]];
    count++;
  }
  return count;
}

// console.log(countSteps());

// part 2

function countZsInLoop(start) {
  let count = 0;
  let current = start;
  let set = new Set();
  while (!set.has(current)) {
    if (current.endsWith("Z")) {
      set.add(current);
    }
    current = paths[current][instructions[count % instructions.length]];
    count++;
  }
  return set.size;
}
// Important note: all the ghosts have exactly one Z space in their loop
// This simplifies the logic a lot.
// console.log(Object.keys(paths).filter(it => it.endsWith("A")).map(countZsInLoop));

function analyzeGhost(start) {
  let count = 0;
  let current = start;
  let set = new Set();
  let first = 0;
  while (!set.has(current)) {
    if (current.endsWith("Z")) {
      set.add(current);
      first = count;
    }
    current = paths[current][instructions[count % instructions.length]];
    count++;
  }
  return {
    offset: first,
    loop: count - first
  };
}
// Another important note: All the loops are exactly the same length as their
// initial offset. If this wasn't true, I think we would have to use the Chinese
// remainder theorem to solve, but since it is, we can just use LCM
// console.log(Object.keys(paths).filter(it => it.endsWith("A")).map(analyzeGhost));

function gcd(a, b) {
  if (b == 0) {
    return a;
  }
  
  return gcd(b, a % b);
}

// another note: the GCD of the loops is 263, which is exactly the same as the length of the instructions
// this also simplifies the logic a lot. They could have made this problem a lot more difficult than they did

function lcm(a, b) {
  return (a * b) / gcd(a,b);
}

let loops = Object.keys(paths).filter(it => it.endsWith("A")).map(analyzeGhost).map(it => it.loop);
console.log(loops.reduce((a,b) => lcm(a,b), 1));
