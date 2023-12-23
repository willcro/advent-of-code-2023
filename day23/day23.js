// part 1

const text = await Deno.readTextFile("./input.txt");
const map = text.split("\n").map(line => line.split(""));

function followPath(start, next, slippery) {
  let x = next.x;
  let y = next.y;

  let visited = new Set();
  visited.add(`${start.x},${start.y}`);
  visited.add(`${x},${y}`);

  let options = getOptions(x, y, visited, slippery);

  while (options.result == "CONTINUE") {
    // continue along path until a junction or dead end
    x = options.options[0].x;
    y = options.options[0].y;

    visited.add(`${x},${y}`);
    options = getOptions(x, y, visited, slippery);
  }

  return {
    start: { x: start.x, y: start.y },
    end: { x: x, y: y },
    startId: `${start.x},${start.y}`,
    endId: `${x},${y}`,
    length: visited.size - 1
  };
}

function makeGraph(start, slippery) {
  let verts = new Set();
  let edges = [];
  let vertsToSearch = [start];

  while (vertsToSearch.length > 0) {
    let vert = vertsToSearch.pop();

    if (verts.has(`${vert.x},${vert.y}`)) {
      continue;
    }

    verts.add(`${vert.x},${vert.y}`);
    let options = getOptions(vert.x, vert.y, new Set(), slippery);
    let vertEdges = options.options.map(o => followPath(vert, o, slippery));
    vertEdges.map(it => it.end).filter(v => !verts.has(`${v.x},${v.y}`)).forEach(v => vertsToSearch.push(v));
    vertEdges.forEach(it => edges.push(it));
  }

  let startToEdges = {};

  edges.forEach(e => {
    if (startToEdges[e.startId] == undefined) {
      startToEdges[e.startId] = [];
    }
    startToEdges[e.startId].push(e);
  });

  return {
    verts: Array.from(verts), edges, startToEdges
  }

}

function getOptions(x, y, visited, slippery) {
  // console.log(slippery)
  let out = [];

  let slopes = new Set(["^", "v", "<", ">"]);

  // look up
  if (y > 0 && (map[y - 1][x] == '.' || map[y - 1][x] == '^' || (!slippery && slopes.has(map[y - 1][x])))) {
    out.push({ x: x, y: y - 1 });
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

function dfs(graph, start, end, searched) {  
  if (start == end) {
    return 0;
  }
  
  if (searched.has(start)) {
    return null;
  }

  let newSearched = new Set(Array.from(searched));
  newSearched.add(start);

  let options = graph.startToEdges[start].map(e => {
    let distance = dfs(graph, e.endId, end, newSearched);
    if (distance == null) {
      return null;
    }
    
    return distance + e.length;
  })
  .filter(it => it != null)
    
  if (options.length == 0) {
    return null;
  }
  
  return options.reduce((a, b) => a > b ? a : b);
}

let graph = makeGraph({ x: 1, y: 0 }, true);
console.log(dfs(graph, "1,0", "139,140", new Set()));

// part 2
graph = makeGraph({ x: 1, y: 0 }, false);
console.log(dfs(graph, "1,0", "139,140", new Set()));
