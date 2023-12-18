// part 1

const text = await Deno.readTextFile("./input.txt");
const lines = text.split("\n");

let reg = /([UDLR]) ([0-9]+) \(#([0-9a-f]{6})\)/

function parseLine(line) {
  if (!reg.test(line)) {
    throw `${line} is not in expected format`;
  }
  let match = reg.exec(line);
  return {
    direction: match[1],
    length: match[2] * 1,
    color: match[3]
  };
}

function dig(instructions) {
  let holes = new Set();
  let x = 0;
  let y = 0;

  let xmax = 0;
  let xmin = 0;
  let ymax = 0;
  let ymin = 0;

  holes.add(`${x},${y}`);

  instructions.forEach(instruction => {
    for (let i = 0; i < instruction.length; i++) {
      if (instruction.direction == "U") {
        y--;
      } else if (instruction.direction == "D") {
        y++;
      } else if (instruction.direction == "L") {
        x--;
      } else if (instruction.direction == "R") {
        x++;
      }

      xmax = Math.max(xmax, x);
      xmin = Math.min(xmin, x);
      ymax = Math.max(ymax, y);
      ymin = Math.min(ymin, y);
      holes.add(`${x},${y}`);
    }
  });

  let floodedSquares = new Set();
  let toFlood = new Set();
  toFlood.add(JSON.stringify({ x: xmin - 1, y: ymin - 1 }));

  while (toFlood.size > 0) {
    let nextJson = toFlood.values().next().value;
    toFlood.delete(nextJson);
    floodedSquares.add(nextJson);

    let next = JSON.parse(nextJson);

    let up = { x: next.x, y: next.y - 1 };
    let down = { x: next.x, y: next.y + 1 };
    let left = { x: next.x - 1, y: next.y };
    let right = { x: next.x + 1, y: next.y };

    [up, down, left, right].filter(it => !holes.has(`${it.x},${it.y}`))
      .filter(it => it.x >= xmin - 1)
      .filter(it => it.x <= xmax + 1)
      .filter(it => it.y >= ymin - 1)
      .filter(it => it.y <= ymax + 1)
      .map(it => JSON.stringify(it))
      .filter(it => !floodedSquares.has(it))
      .forEach(it => toFlood.add(it));
  }

  return (((xmax - xmin) + 3) * ((ymax - ymin) + 3)) - floodedSquares.size;
}

console.log(dig(lines.map(parseLine)))
