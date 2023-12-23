// part 1

const text = await Deno.readTextFile("./input.txt");
const map = text.split("\n").map(line => line.split(""));

function dfs(start, end, visited, slippery) {
  let x = start.x;
  let y = start.y;
  
  let newVisited = new Set(Array.from(visited));
  newVisited.add(`${x},${y}`);
  
  let options = getOptions(x, y, newVisited, slippery);
  
  while(options.result == "CONTINUE") {
    // continue along path until a junction or dead end
    x = options.options[0].x;
    y = options.options[0].y;
    
    newVisited.add(`${x},${y}`);
    options = getOptions(x, y, newVisited, slippery);
  }
  
  if (x == end.x && y == end.y) {
    return newVisited.size;
  }
  
  // we have reached a fork in the road;
  let routes = options.options.map(o => dfs(o, end, newVisited, slippery)).filter(it => it != null);
  if (routes.length == 0) {
    return null;
  }
  
  return routes.reduce((a,b) => Math.max(a,b), 0);
}


function getOptions(x, y, visited, slippery) {
  // console.log(slippery)
  let out = [];
  
  let slopes = new Set(["^", "v", "<", ">"]);
  
  // look up
  if (y > 0 && (map[y - 1][x] == '.' || map[y - 1][x] == '^' || (!slippery && slopes.has(map[y - 1][x])))) {
    out.push({x: x, y: y - 1});
  }
  
  // look down
  if (y < map.length - 1 && (map[y + 1][x] == '.' || map[y + 1][x] == 'v' || (!slippery && slopes.has(map[y + 1][x])))) {
    out.push({ x: x, y: y + 1 });
  }
  
  // look left
  if (x > 0 && (map[y][x - 1] == '.' || map[y][x - 1] == '<' || (!slippery && slopes.has(map[y][x - 1])))) {
    out.push({ x: x - 1, y: y });
  }
  
  // look right
  if (x < map[y].length - 1 && (map[y][x + 1] == '.' || map[y][x + 1] == '>' || (!slippery && slopes.has(map[y][x + 1])))) {
    out.push({ x: x + 1, y: y });
  }
  
  
  let filtered = out.filter(it => !visited.has(`${it.x},${it.y}`));
  
  if (out.length == 1 && filtered.length == 0) {
    return {
      result: "DEADEND",
      options: []
    };
  }
  
  if (filtered.length == 0) {
    return {
      result: "LOOPED",
      options: []
    };
  }

  if (out.length <= 2 && filtered.length == 1) {
    return {
      result: "CONTINUE",
      options: filtered
    };
  }
  
  return {
    result: "FORK",
    options: filtered
  };
}

// console.log(dfs({ x: 1, y: 0 }, { x: 21, y: 22 }, new Set(), false) - 1);

console.log(dfs({ x: 1, y: 0 }, { x: 139, y: 140 }, new Set(), true) - 1);

// part 2

// console.log(dfs({ x: 1, y: 0 }, { x: 139, y: 140 }, new Set(), false) - 1);

