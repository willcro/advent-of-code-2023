// part 1

// this solution is pretty complicated, but it basically works like this
// 1. the entire map is turned into a giant grid, where every vertical or
//    horizontal line lines up with a trench. This means that I only
//    need to deal with rectangles. No weird shapes.
// 2. The exterior of the map is flooded to identify which are "inside"
//    and which are outside.
// 3. The areas of the interior rectangles are added up. Overlapping
//    areas between rectangles must be accounted for.

const text = await Deno.readTextFile("./input.txt");
const lines = text.split("\n");

let reg = /([UDLR]) ([0-9]+) \(#([0-9a-f]{5})([0-9a-f])\)/

let dirMap = {
  "0": "R",
  "1": "D",
  "2": "L",
  "3": "U"
}

function parseLinePart1(line) {
  if (!reg.test(line)) {
    throw `${line} is not in expected format`;
  }
  let match = reg.exec(line);
  return {
    direction: match[1],
    length: match[2] * 1,
  };
}

function parseLinePart2(line) {
  if (!reg.test(line)) {
    throw `${line} is not in expected format`;
  }
  let match = reg.exec(line);
  return {
    direction: dirMap[match[4]],
    length: Number.parseInt(match[3], 16),
  };
}

function digLines(instructions) {
  let horizontalLines = [];
  let verticalLines = [];

  let x = 0;
  let y = 0;

  instructions.forEach(instruction => {
    if (instruction.direction == "U") {
      verticalLines.push({ intercept: x, start: y - instruction.length, end: y });
      y -= instruction.length;
    } else if (instruction.direction == "D") {
      verticalLines.push({ intercept: x, start: y, end: y + instruction.length });
      y += instruction.length;
    } else if (instruction.direction == "L") {
      horizontalLines.push({ intercept: y, start: x - instruction.length, end: x });
      x -= instruction.length;
    } else if (instruction.direction == "R") {
      horizontalLines.push({ intercept: y, start: x, end: x + instruction.length });
      x += instruction.length;
    }
  });

  return { horizontal: horizontalLines, vertical: verticalLines };
}

function rectangles(lines) {
  let yIntercepts = lines.horizontal.map(it => it.intercept).sort((a, b) => a - b);
  let ymin = yIntercepts[0] - 10;
  let ymax = yIntercepts[yIntercepts.length - 1] + 10
  let xIntercepts = lines.vertical.map(it => it.intercept).sort((a, b) => a - b);
  let xmin = xIntercepts[0] - 10;
  let xmax = xIntercepts[xIntercepts.length - 1] + 10
  
  // a "moat" is added around the perimeter to help with the flooding later
  yIntercepts.unshift(ymin)
  yIntercepts.push(ymax);
  xIntercepts.unshift(xmin)
  xIntercepts.push(xmax);

  let rectangles = [];

  for (let y = 1; y < yIntercepts.length; y++) {
    const y1 = yIntercepts[y - 1];
    const y2 = yIntercepts[y];
    let row = [];

    if (y1 == y2) {
      continue;
    }
    
    for (let x = 1; x < xIntercepts.length; x++) {
      const x1 = xIntercepts[x - 1];
      const x2 = xIntercepts[x];
      if (x1 == x2) {
        continue;
      }
      row.push({ y1, y2, x1, x2, interior: true });
    }

    rectangles.push(row);
  }

  // flood
  let floodedSquares = new Set();
  let toFlood = new Set();
  toFlood.add(JSON.stringify({ x: 0, y: 0 }));

  while (toFlood.size > 0) {
    let nextJson = toFlood.values().next().value;
    toFlood.delete(nextJson);
    floodedSquares.add(nextJson);
    let next = JSON.parse(nextJson);
    let rec = rectangles[next.y][next.x]
    rec.interior = false;

    let adjacent = [];
    // top
    if (!lineIsTrench(rec.x1, rec.x2, rec.y1, lines.horizontal)) {
      adjacent.push({ x: next.x, y: next.y - 1 });
    }
    
    // bottom
    if (!lineIsTrench(rec.x1, rec.x2, rec.y2, lines.horizontal)) {
      adjacent.push({ x: next.x, y: next.y + 1 });
    }
    
    // left
    if (!lineIsTrench(rec.y1, rec.y2, rec.x1, lines.vertical)) {
      adjacent.push({ x: next.x - 1, y: next.y });
    }
    
    // right
    if (!lineIsTrench(rec.y1, rec.y2, rec.x2, lines.vertical)) {
      adjacent.push({ x: next.x + 1, y: next.y });
    }
    
    adjacent.filter(it => it.x >= 0)
      .filter(it => it.x < rectangles[0].length)
      .filter(it => it.y >= 0 )
      .filter(it => it.y < rectangles.length)
      .map(it => JSON.stringify(it))
      .filter(it => !floodedSquares.has(it))
      .forEach(it => toFlood.add(it));
  }

  return rectangles;
}

function area(rectangles) {
  let sum = 0;
  for (let y = 0; y < rectangles.length; y++) {
    const row = rectangles[y];
    for (let x = 0; x < row.length; x++) {
      const rectangle = row[x];
      if (rectangle.interior) {
        sum += (rectangle.y2 - rectangle.y1 + 1) * (rectangle.x2 - rectangle.x1 + 1);    
        
        // adjust for overlapping rectangles
        // top
        if (y > 0 && rectangles[y - 1][x].interior) {
          sum -= rectangle.x2 - rectangle.x1 - 1;
        }
        // left
        if (x > 0 && rectangles[y][x - 1].interior) {
          sum -= rectangle.y2 - rectangle.y1;
        }
        // top-left
        if ((y > 0 && rectangles[y - 1][x].interior) || (x > 0 && rectangles[y][x - 1].interior) || (y > 0 && x > 0 && rectangles[y - 1][x - 1].interior)) {
          sum -= 1;
        }
        // top-right
        if ((y > 0 && rectangles[y - 1][x].interior) || (y > 0 && x < row.length - 1 && rectangles[y - 1][x + 1].interior)) {
          sum -= 1;
        }
        
      }
    }
  }
  return sum;
}

function lineIsTrench(start, end, intercept, trenches) {
  return trenches.filter(it => it.intercept == intercept)
    .some(it => start >= it.start && end <= it.end);
}

console.log(area(rectangles(digLines(lines.map(parseLinePart1)))));

//part 2
console.log(area(rectangles(digLines(lines.map(parseLinePart2)))));
