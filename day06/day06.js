// part 1

function range(size, startAt) {
  return [...Array(size).keys()].map(i => i + startAt);
}

const text = await Deno.readTextFile("./input.txt");

function parseInput(text) {
  let lines = text.split("\n");
  let times = lines[0].split(/ +/).slice(1).map(it => it * 1);
  let distances = lines[1].split(/ +/).slice(1).map(it => it * 1);
  return times.map((time, i) => {
    return {
      time: time,
      distance: distances[i]
    }
  });
}

function distance(buttonTime, totalTime) {
  return buttonTime * (totalTime - buttonTime);
}

function waysToWin(race) {
  let quads = quadraticFormula(-1, race.time, -race.distance);
  let first = Math.ceil(quads[0]);
  let second = Math.floor(quads[1]);
  return second - first + 1;
}

console.log(parseInput(text).map(waysToWin).reduce((a,b) => a * b, 1));

// part 2

function parseInputPart2(text) {
  let lines = text.split("\n");
  let time = lines[0].split(/ +/).slice(1).join("") * 1;
  let distance = lines[1].split(/ +/).slice(1).join("") * 1;
  return [{time: time, distance: distance}];
}

// This obviously breaks if the answers are imaginary, but that won't happen in this problem.
function quadraticFormula(a, b, c) {
  var first = ((-b) + Math.sqrt(b * b - (4 * a * c))) / (2 * a);
  var second = ((-b) - Math.sqrt(b * b - (4 * a * c))) / (2 * a);
  return [first, second].sort((a,b) => a - b);
}

console.log(parseInputPart2(text).map(waysToWin).reduce((a, b) => a * b, 1));