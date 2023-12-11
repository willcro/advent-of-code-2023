// part 1

const text = await Deno.readTextFile("./input.txt");

function range(size, startAt) {
  return [...Array(size).keys()].map(i => i + startAt);
}

function parseInput(text, expansionFactor) {
  const spaces = text.split("\n").map(it => it.split(""));
  
  const rows = new Set(range(spaces.length, 0));
  const columns = new Set(range(spaces[0].length, 0));
  
  const galaxies = [];
  
  for (let y = 0; y < spaces.length; y++) {
    const row = spaces[y];
    for (let x = 0; x < row.length; x++) {
      const element = row[x];
      if (element == "#") {
        rows.delete(y);
        columns.delete(x);
        galaxies.push({x: x, y: y});
      }
    }
  }
    
  galaxies.forEach(g => {
    g.x = g.x + (Array.from(columns).filter(x => x < g.x).length * (expansionFactor - 1));
    g.y = g.y + (Array.from(rows).filter(y => y < g.y).length * (expansionFactor - 1)) ;
  });
  
  return galaxies;
}

function findDistances(galaxies) {
  let out = 0;
  for (let i = 0; i < galaxies.length; i++) {
    const a = galaxies[i];
    for (let j = i + 1; j < galaxies.length; j++) {
      const b = galaxies[j];
      out += findDistance(a,b);
    }
  }
  return out;
}

function findDistance(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

console.log(findDistances(parseInput(text, 2)))

// part 2

console.log(findDistances(parseInput(text, 1000000)))
