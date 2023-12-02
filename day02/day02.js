// part 1

const text = await Deno.readTextFile("./input.txt");
const lines = text.split("\n");
const maxes = {
  red: 12,
  green: 13,
  blue: 14
}

function parseLine(line) {
  let match = /Game ([0-9]+): (.*)/.exec(line);
  const gameNumber = match[1] * 1;
  let pullStrings = match[2].split("; ");
  let pulls = pullStrings.map(str => str.split(", ").map(color => {
    let colorMatch = /([0-9]+) ([a-z]+)/.exec(color);
    return {
      color: colorMatch[2],
      count: colorMatch[1] * 1
    }
  }))
  return {
    id: gameNumber,
    pulls: pulls
  };
}

function gamePossible(game) {
  return game.pulls.flatMap(it => it).every(color => maxes[color.color] >= color.count);
}

console.log(lines.map(parseLine).filter(gamePossible).map(it => it.id).reduce((a,b) => a+b, 0))

// part 2

function gamePower(game) {
  return ["blue", "green", "red"]
    .map(c => game.pulls.flatMap(it => it)
      .filter(it => it.color == c)
      .map(it => it.count)
      .reduce((a, b) => Math.max(a, b), 0)
    )
    .reduce((a,b) => a * b, 1)
}

console.log(lines.map(parseLine).map(gamePower).reduce((a,b) => a + b, 0))