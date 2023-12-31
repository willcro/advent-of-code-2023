// part 1

const text = await Deno.readTextFile("./input.txt");
const lines = text.split("\n");
const pattern = /[0-9]/

function getDigits(str) {
  return str.split("").filter(it => it.match(pattern));
}

const out = lines.map(line => getDigits(line))
  .map(digits => digits[0] * 10 + digits[digits.length - 1] * 1)
  .reduce((a,b) => a + b, 0)
  
console.log(out)

// part 2

const map = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  0: 0
}

const startPattern = /.*?([0-9]|one|two|three|four|five|six|seven|eight|nine).*/
const endPattern = /.*([0-9]|one|two|three|four|five|six|seven|eight|nine).*?/

const out2 = lines.map(line => map[startPattern.exec(line)[1]] * 10 + map[endPattern.exec(line)[1]])
  .reduce((a, b) => a + b, 0)
  
console.log(out2)

// part 2 with no regex

function getFirstDigit(line) {
  let min = 1;
  let max = 5;
  
  for (let i = 0; i<line.length; i++) {
    for (let j=i+min; j<=i+max; j++) {
      var sub = line.substring(i, j);
      // console.log(sub)
      if (map[sub] != undefined) {
        return map[sub];
      }
    }
  }
}

function getLastDigit(line) {
  let min = 1;
  let max = 5;

  for (let i = line.length - 1; i >= 0; i--) {
    for (let j = i + min; j <= i + max && j <= line.length; j++) {
      var sub = line.substring(i, j);
      // console.log(sub)
      if (map[sub] != undefined) {
        return map[sub];
      }
    }
  }
}

const out3 = lines.map(line => getFirstDigit(line) * 10 + getLastDigit(line))
  .reduce((a, b) => a + b, 0)

console.log(out3)
