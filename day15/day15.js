// part 1

const text = await Deno.readTextFile("./input.txt");

const chunks = text.split(",");

function hash(s) {
  let current = 0;
  for (let i = 0; i < s.length; i++) {
    current += s.charCodeAt(i);
    current *= 17
    current %= 256
  }
  return current;
}

console.log(chunks.map(hash).reduce((a, b) => a + b, 0));

// part 2
let reg = /([a-z]+)([=-])([0-9]*)/
function range(size, startAt) {
  return [...Array(size).keys()].map(i => i + startAt);
}

function hashmap(s) {
  let match = reg.exec(s);
  let box = hash(match[1]);

  return {
    label: match[1],
    box: box,
    operation: match[2],
    focalLength: match[3] == "" ? null : match[3] * 1
  }
}

function run(instructions) {
  let boxes = range(256, 0).map(it => []);

  instructions.forEach(i => {
    if (i.operation == "=") {
      boxes[i.box] = add(boxes[i.box], i.label, i.focalLength);
    } else {
      boxes[i.box] = remove(boxes[i.box], i.label);
    }
  });

  return boxes;
}

function add(box, label, focalLength) {
  let hasLens = box.some(it => it.label == label);
  if (hasLens) {
    return box.map(it => it.label == label ? { label, focalLength } : it);
  }
  box.push({ label, focalLength });
  return box;
}

function remove(box, label) {
  return box.filter(it => it.label != label);
}

function power(boxes) {
  return boxes.flatMap((box, b) => box.map((lens, l) => (b + 1) * (l + 1) * lens.focalLength))
    .reduce((a, b) => a + b, 0);
}



console.log(power(run(chunks.map(hashmap))))