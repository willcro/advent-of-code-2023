// part 1

const text = await Deno.readTextFile("./input.txt");
const lines = text.split("\n");

function range(size, startAt) {
  return [...Array(size).keys()].map(i => i + startAt);
}

function lineToNumbers(line, y) {
  var out = [];
  var str = line;
  var index = 0;
  var reg = /[0-9]+/
  while (reg.test(str)) {
    var match = reg.exec(str)[0];
    var localIndex = str.search(reg);
    var startIndex = localIndex + index;
    var endIndex = startIndex + match.length - 1
    var coordSet = new Set();
    
    // above
    range(match.length + 2, startIndex - 1).map(x => `${x},${y-1}`).forEach(it => coordSet.add(it));
    
    // below
    range(match.length + 2, startIndex - 1).map(x => `${x},${y + 1}`).forEach(it => coordSet.add(it));
    
    // left
    coordSet.add(`${startIndex - 1},${y}`);
    
    // right
    coordSet.add(`${endIndex + 1},${y}`);
    
    out.push({
      number: match * 1,
      perimeter: coordSet
    })
    
    str = str.substring(localIndex + match.length);
    index = endIndex + 1;
  }
  return out;
}

function lineToSymbols(line, y) {
  var out = [];
  var str = line;
  var index = 0;
  var reg = /[^\.0-9]/
  while (reg.test(str)) {
    var match = reg.exec(str)[0];
    var localIndex = str.search(reg);
    var startIndex = str.search(reg) + index;
    var endIndex = startIndex + match.length - 1;
    
    out.push({
      symbol: match,
      coords: `${startIndex},${y}`
    })

    str = str.substring(localIndex + match.length);
    index = endIndex + 1;
  }
  return out;
}

var numbers = lines.flatMap((line, i) => lineToNumbers(line, i));
var symbols = lines.flatMap((line, i) => lineToSymbols(line, i))

// whoops, O(n^2)
console.log(numbers.filter(num => symbols.some(it => num.perimeter.has(it.coords))).map(num => num.number).reduce((a,b) => a+b, 0));

// part 2
var ratio = symbols.filter(s => s.symbol == "*").map(s => {
  var adjacent = numbers.filter(n => n.perimeter.has(s.coords));
  if (adjacent.length != 2) {
    return 0;
  }
  
  return adjacent.map(n => n.number).reduce((a,b) => a * b, 1);
})
.reduce((a,b) => a + b, 0);

console.log(ratio);

