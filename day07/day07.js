// part 1

const text = await Deno.readTextFile("./input.txt");
let lines = text.split("\n");

// I decided to do this all in regex where possible
// I don't think that is actually the best way to do it
// I just like regex and had fun writing them
let types = [
  /(.)(\1)(\1)(\1)(\1)/, // 5 of a kind
  /.*(.).*(\1).*(\1).*(\1).*/, // 4 of a kind
  /(?=.*(.).*(\1).*(\1).*)(.*(?!\1)(.).*(\5).*)/, // full house
  /.*(.).*(\1).*(\1).*/, // 3 of a kind
  /(?=.*(.).*(\1).*)(.*(?!\1)(.).*(\4).*)/, // 2 pair
  /.*(.).*(\1).*/, // pair
  /.*/ // high card
];

let cardMap = {
  'T': 'a',
  'J': 'b',
  'Q': 'c',
  'K': 'd',
  'A': 'e'
}

function handValue(hand) {
  return handType(hand) * 1000000000 + handNumberValue(hand);
}

function handNumberValue(hand) {
  return Number.parseInt(hand.split('').map(d => cardMap[d] ?? d).join(""), 15);
}

function handType(hand) {
  for (let i = 0; i < types.length; i++) {
    if (types[i].test(hand)) {
      // console.log(hand, i)
      return types.length - i;
    }
  }
}

function compareHands(a, b) {
  return handValue(a) - handValue(b);
}

function parseLine(line) {
  let parts = line.split(" ");
  return {
    hand: parts[0],
    bid: parts[1] * 1
  };
}

console.log(lines.map(parseLine).sort((a, b) => compareHands(a.hand, b.hand)).map((it, i) => (i + 1) * it.bid).reduce((a, b) => a + b));

// part 2

// I managed to skip reading the section that changes the value of the Joker like 5 times
cardMap = {
  'J': '2',
  '2': '3',
  '3': '4',
  '4': '5',
  '5': '6',
  '6': '7',
  '7': '8',
  '8': '9',
  '9': 'a',
  'T': 'b',
  'Q': 'c',
  'K': 'd',
  'A': 'e'
}

const cards = ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2']

function maxValue(hand) {
  return cards.map(c => handType(hand.replaceAll("J", c)) * 1000000000 + handNumberValue(hand)).reduce((a,b) => Math.max(a, b), 0);
}

console.log(lines.map(parseLine).sort((a, b) => maxValue(a.hand) - maxValue(b.hand)).map((it, i) => (i + 1) * it.bid).reduce((a, b) => a + b));

