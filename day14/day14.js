// part 1

const text = await Deno.readTextFile("./input.txt");
const map = text.split("\n").map(row => row.split(""));

function tickNorth(map) {
  for (let y = 0; y < map.length; y++) {
    const row = map[y];
    for (let x = 0; x < row.length; x++) {
      const element = row[x];
      if (element == "O" && y > 0 && map[y - 1][x] == ".") {
        map[y][x] = ".";
        map[y - 1][x] = "O";
      } 
    }
  }
  return map;
}

function tickSouth(map) {
  for (let y = 0; y < map.length; y++) {
    const row = map[y];
    for (let x = 0; x < row.length; x++) {
      const element = row[x];
      if (element == "O" && y < map.length - 1 && map[y + 1][x] == ".") {
        map[y][x] = ".";
        map[y + 1][x] = "O";
      }
    }
  }
  return map;
}

function tickWest(map) {
  for (let y = 0; y < map.length; y++) {
    const row = map[y];
    for (let x = 0; x < row.length; x++) {
      const element = row[x];
      if (element == "O" && x > 0 && map[y][x - 1] == ".") {
        map[y][x] = ".";
        map[y][x - 1] = "O";
      }
    }
  }
  return map;
}

function tickEast(map) {
  for (let y = 0; y < map.length; y++) {
    const row = map[y];
    for (let x = 0; x < row.length; x++) {
      const element = row[x];
      if (element == "O" && x < row.length - 1 && map[y][x + 1] == ".") {
        map[y][x] = ".";
        map[y][x + 1] = "O";
      }
    }
  }
  return map;
}

function tilt(map, tiltFunc) {
  let last = "";
  let current = map;
  while (last != JSON.stringify(current)) {
    last = JSON.stringify(current);
    current = tiltFunc(current);
  }
  return current;
}

function weight(map) {
  let out = 0;
  for (let y = 0; y < map.length; y++) {
    const row = map[y];
    for (let x = 0; x < row.length; x++) {
      const element = row[x];
      if (element == "O") {
        out += map.length - y;
      }
    }
  }
  return out;
}

console.log(weight(tilt(map, tickNorth)));

// part 2

function spin(map) {
  let out = tilt(map, tickNorth);
  out = tilt(map, tickWest);
  out = tilt(map, tickSouth);
  out = tilt(map, tickEast);
  return out;
}

function spinN(map, n) {
  let history = {};
  let out = map;
  for (let i = 0; i < n; i++) {
    out = spin(out);
    let key = out.flatMap(row => row.join("")).join("\n");
    if (history[key] != undefined) {
      let k = (i - history[key]);
      let mod = i % k;
      let nMod = (n - 1) % k;
      let remainingLoops = nMod - mod;
      remainingLoops = remainingLoops < 0 ? remainingLoops + k : remainingLoops;
      return spinN(out, remainingLoops);
    }
    history[key] = i;
  }
  return out;
}

console.log(weight(spinN(map, 1000000000)));
