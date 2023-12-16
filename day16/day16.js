// part 1

const text = await Deno.readTextFile("./input.txt");
const map = text.split("\n").map(row => row.split(""));

const dirMap = {
  up: {x: 0, y: -1},
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const tokenMap = {
  ".": {
    up: ["up"],
    down: ["down"],
    left: ["left"],
    right: ["right"],
  },
  "\\": {
    up: ["left"],
    down: ["right"],
    left: ["up"],
    right: ["down"],
  },
  "/": {
    up: ["right"],
    down: ["left"],
    left: ["down"],
    right: ["up"],
  },
  "-": {
    up: ["left", "right"],
    down: ["left", "right"],
    left: ["left"],
    right: ["right"],
  },
  "|": {
    up: ["up"],
    down: ["down"],
    left: ["up", "down"],
    right: ["up", "down"],
  },
}

function shineLaser(x, y, dir) {
  let lasers = [{x,y,dir}];
  let points = new Set();
  let history = new Set();
  while (lasers.length > 0) {
    let next = []
    lasers.forEach(laser => {
      points.add(`${laser.x},${laser.y}`);
      history.add(`${laser.x},${laser.y},${laser.dir}`);
      let token = map[laser.y][laser.x];
      tokenMap[token][laser.dir].map(dir => {
        return {
          x: laser.x + dirMap[dir].x,
          y: laser.y + dirMap[dir].y,
          dir: dir
        };
      }).forEach(it => next.push(it));
    });
    
    // filter out the out of bounds
    lasers = next.filter(laser => laser.x < map[0].length && laser.y < map.length && laser.x >= 0 && laser.y >= 0)
      // filter loops
      .filter(laser => !history.has(`${laser.x},${laser.y},${laser.dir}`));
      
  }
  return points;
}

console.log(shineLaser(0,0,"right").size);

// part 2

function findIdeal() {
  let max = 0;
  
  // top
  for (let x = 0; x < map[0].length; x++) {
    max = Math.max(shineLaser(x, 0, "down").size, max);
  }
  
  // bottom
  for (let x = 0; x < map[0].length; x++) {
    max = Math.max(shineLaser(x, map.length - 1, "up").size, max);
  }
  
  // left
  for (let y = 0; y < map.length; y++) {
    max = Math.max(shineLaser(0, y, "right").size, max);
  }
  
  // right
  for (let y = 0; y < map.length; y++) {
    max = Math.max(shineLaser(map[0].length - 1, y, "left").size, max);
  }
  
  return max;
}

console.log(findIdeal());
