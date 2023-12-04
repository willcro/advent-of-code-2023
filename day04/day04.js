// part 1

const text = await Deno.readTextFile("./input.txt");
const lines = text.split("\n");

const regex = /Card +([0-9]+): ([ 0-9]+) \| ([ 0-9]+)/

const games = lines.map(line => regex.exec(line)).map(match => {
  return {
    id: match[1] * 1,
    winningNumbers: new Set(match[2].split(" ").filter(it => it != "")),
    numbers: match[3].split(" ").filter(it => it != "")
  }
});

function winningCount(g) {
  return g.numbers.filter(n => g.winningNumbers.has(n)).length;
}

var score = games.map(winningCount).filter(c => c > 0).map(c => Math.pow(2, c-1)).reduce((a,b) => a+b, 0);

console.log(score)

// part 2

var idToGame = {};
games.forEach(g => idToGame[g.id] = g);

// memoization
var idToCount = {};

function countGame(id) {
  if (idToCount[id] != undefined) {
    return idToCount[id];
  }
  
  let game = idToGame[id];
  let winners = winningCount(game);
  
  let out = 1;
  
  for (let i = id + 1; i <= id + winners; i++) {
    out += countGame(i);
  }
  
  // memoize
  idToCount[id] = out;
  return out;
}

console.log(games.map(g => countGame(g.id)).reduce((a,b) => a+b, 0))

