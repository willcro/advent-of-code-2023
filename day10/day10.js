// part 1

const text = await Deno.readTextFile("./input.txt");
const grid = text.split("\n").map(line => line.split(""));



const letterMap = {
  "|": { N: { dir: "N", rot: 0 }, S: { dir: "S", rot: 0 } },
  "-": { W: { dir: "W", rot: 0 }, E: { dir: "E", rot: 0 } },
  "L": { S: { dir: "E", rot: -1 }, W: { dir: "N", rot: 1 } },
  "J": { S: { dir: "W", rot: 1 }, E: { dir: "N", rot: -1 } },
  "7": { N: { dir: "W", rot: -1 }, E: { dir: "S", rot: 1 } },
  "F": { N: { dir: "E", rot: 1 }, W: { dir: "S", rot: -1 } },
  ".": {}
};

const dirMap = {
  N: { x: 0, y: -1 },
  S: { x: 0, y: 1 },
  E: { x: 1, y: 0 },
  W: { x: -1, y: 0 },
};

function getPath(grid, startingDir) {
  let out = [];
  let goodSet = new Set();
  let badSet = new Set();
  let startCoords = findStart(grid);
  let coords = startCoords;
  let rot = 0;
  let dir = startingDir;
  try {
    coords = { x: coords.x + dirMap[dir].x, y: coords.y + dirMap[dir].y, pipe: grid[coords.y + dirMap[dir].y][coords.x + dirMap[dir].x] }
  } catch {
    return { looped: false };
  }
  while (grid[coords.y][coords.x] != "S") {
    out.push(coords)
    let pipe = grid[coords.y][coords.x];
    
    if (pipe == undefined) {
      return { looped: false };
    }
    // console.log(pipe)
    let instruction = letterMap[pipe][dir];
    if (instruction == undefined) {
      return { looped: false };
    }
    if (dir == "E" || instruction.dir == "E") {
      goodSet.add(`${coords.x},${coords.y}`);
    } else {
      badSet.add(`${coords.x},${coords.y}`);
    }
    
    dir = instruction.dir;
    rot += instruction.rot;
    coords = { x: coords.x + dirMap[dir].x, y: coords.y + dirMap[dir].y, pipe: grid[coords.y + dirMap[dir].y][coords.x + dirMap[dir].x] }
  }
  
  if (dir == "E" || startingDir == "E") {
    goodSet.add(`${coords.x},${coords.y}`);
  } else {
    badSet.add(`${coords.x},${coords.y}`);
  }

  return { looped: true, goodSet, badSet, out, rot };
}

function findStart(grid) {
  for (let y = 0; y < grid.length; y++) {
    const row = grid[y];
    for (let x = 0; x < row.length; x++) {
      const element = row[x];
      if (element == "S") {
        return { x: x, y: y };
      }
    }
  }
  throw "Didn't find the S";
}

function countPixels(grid, pipe) {
  let count = 0;
  for (let y = 0; y < grid.length; y++) {
    const row = grid[y];
    for (let x = 0; x < row.length; x++) {
      if (pixelInPipe(grid, pipe, x, y)) {
        // console.log(x, y);
        count++;
      }
    }
  }
  return count;
}

function pixelInPipe(grid, pipe, x, y) {
  if (pipe.badSet.has(`${x},${y}`) || pipe.goodSet.has(`${x},${y}`)) {
    return false;
  };
  
  while (y >= 0) {
    if (pipe.badSet.has(`${x},${y}`)) {
      return false;
    }
    
    if (pipe.goodSet.has(`${x},${y}`)) {
      return true;
    }
    
    y--;
  }
  
  return false;
}

let longestPipe = ["N", "S", "E", "W"].map(dir => getPath(grid, dir))
  .filter(it => it.looped && it.rot > 0)[0]
  // .map(it => it.length);
  // .reduce((a, b) => Math.max(a, b), 0);

// console.log(longestPipe)

console.log(countPixels(grid, longestPipe))



