// part 1

const text = await Deno.readTextFile("./input.txt");
const reg = /([a-z]+): (.*)/

/**
 * My basic strategy was to first run rollTheDice to create a
 * bunch of random paths and count which nodes were visited
 * most often. The three critical edges were very obvious
 * from this. I then blocked those three (see `blocklist`)
 * and flooded the 2 halves to get their sizes.
 */

function parseLine(line) {
  let match = reg.exec(line);
  return {
    id: match[1],
    connected: match[2].split(" ")
  };
}

let blocklist = new Set([
  "zqg-mhb",
  "mzb-fjn",
  "sjr-jlt"
]);

function blocked(a, b) {
  return blocklist.has(`${a}-${b}`) || blocklist.has(`${b}-${a}`);
}

let components = {};
let input = text.split("\n").map(parseLine);
input.forEach(it => {
  components[it.id] = {
    id: it.id,
    connected: it.connected.filter(c => !blocked(it.id, c))
  }
});

input.forEach(it => {
  it.connected.forEach(c => {
    if (components[c] == undefined) {
      components[c] = {
        id: c,
        connected: []
      }
    }
    
    if (!blocked(it.id, c)) {
      components[c].connected.push(it.id);
    }
  })
});

function djikstra(start, end) {
  let visited = new Set();
  let toVisit = {};
  toVisit[start] = {cost: 0, path:[]};
  
  while(Object.keys(toVisit).length > 0) {
    let next = Object.entries(toVisit).reduce((a,b) => a[1].cost < b[1].cost ? a : b);
    let id = next[0];
    delete toVisit[id];
    visited.add(id);
    
    if (id == end) {
      return next[1];
    }
    
    let connected = components[id] == undefined ? [] : components[id].connected
    
    connected.filter(c => !visited.has(c)).forEach(c => {
      let newPath = next[1].path.map(it => it);
      newPath.push(id);
      toVisit[c] = {
        cost: next[1].cost + 1,
        path: newPath
      }
    });
  }
  throw "No path"
}

let choices = Object.keys(components);
function randomComponent() {
  return choices[Math.floor(Math.random() * choices.length)];
}

function rollTheDice(n) {
  let counts = {};
  for(let i=0; i< n; i++) {    
    let c1 = randomComponent();
    let c2 = randomComponent();
    let path = djikstra(c1, c2);
    path.path.forEach(id => {
      if (counts[id] == undefined) {
        counts[id] = 0;
      }
      counts[id]++;
    });
  }
  
  return Object.entries(counts).sort((a, b) => b[1] - a[1]).map(it => {
    return {
      id: it[0],
      count: it [1]
    }
  });
}

// console.log(rollTheDice(30));


// flood is basically just a copy-paste from djikstra above, without the end condition.
function flood(start) {
  let visited = new Set();
  let toVisit = {};
  toVisit[start] = { cost: 0, path: [] };

  while (Object.keys(toVisit).length > 0) {
    let next = Object.entries(toVisit).reduce((a, b) => a[1].cost < b[1].cost ? a : b);
    let id = next[0];
    delete toVisit[id];
    visited.add(id);

    let connected = components[id] == undefined ? [] : components[id].connected

    connected.filter(c => !visited.has(c)).forEach(c => {
      let newPath = next[1].path.map(it => it);
      newPath.push(id);
      toVisit[c] = {
        cost: next[1].cost + 1,
        path: newPath
      }
    });
  }
  
  return visited;
}

console.log(flood("mzb").size * flood("fjn").size)
