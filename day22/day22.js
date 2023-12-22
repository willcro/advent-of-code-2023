// part 1

const text = await Deno.readTextFile("./practice.txt");
const blocks = text.split("\n").map(parseLine);

// observation, the first point is always less than or equal to the second

function parseLine(line, id) {
  let match = /(\d+),(\d+),(\d+)~(\d+),(\d+),(\d+)/.exec(line);
  return {
    id: id,
    x1: match[1] * 1,
    y1: match[2] * 1,
    z1: match[3] * 1,
    x2: match[4] * 1,
    y2: match[5] * 1,
    z2: match[6] * 1,
  };
}

function dropBrick(bricks, drop) {
  let overlapping = bricks.filter(b => doOverlap2d(b, drop));
  let maxHeight = overlapping.map(b => b.z2).reduce((a, b) => Math.max(a, b), 0);
  let overlappingAtMaxHeight = overlapping.filter(b => b.z2 == maxHeight).map(b => b.id);

  return {
    id: drop.id,
    x1: drop.x1,
    y1: drop.y1,
    z1: maxHeight + 1,
    x2: drop.x2,
    y2: drop.y2,
    z2: maxHeight + 1 + (drop.z2 - drop.z1),
    supportedBy: overlappingAtMaxHeight
  }

}

function doOverlap2d(a, b) {
  let aEdges = getEdges2d(a);
  let bEdges = getEdges2d(b);
  return aEdges.some(aEdge => bEdges.some(bEdge => edgeOverlap(aEdge, bEdge)));
}

function edgeOverlap(a, b) {
  if (a.type == "vertical" && b.type == "vertical") {
    return a.x1 == b.x1 && ((b.y1 >= a.y1 && b.y1 <= a.y2) || (b.y2 >= a.y1 && b.y2 <= a.y2) || (a.y1 >= b.y1 && a.y1 <= b.y2) || (a.y2 >= b.y1 && a.y2 <= b.y2));
  } else if (a.type == "horizontal" && b.type == "horizontal") {
    return a.y1 == b.y1 && ((b.x1 >= a.x1 && b.x1 <= a.x2) || (b.x2 >= a.x1 && b.x2 <= a.x2) || (a.x1 >= b.x1 && a.x1 <= b.x2) || (a.x2 >= b.x1 && a.x2 <= b.x2));
  } else if (a.type == "vertical" && b.type == "horizontal") {
    return a.y1 <= b.y1 && a.y2 >= b.y2 && a.x1 >= b.x1 && a.x1 <= b.x2;
  } else {
    return b.y1 <= a.y1 && b.y2 >= a.y2 && b.x1 >= a.x1 && b.x1 <= a.x2;
  }
}

function getEdges2d(a) {
  return [
    { type: "vertical", x1: a.x1, y1: a.y1, x2: a.x1, y2: a.y2 },
    { type: "horizontal", x1: a.x1, y1: a.y1, x2: a.x2, y2: a.y1 },
    { type: "horizontal", x1: a.x1, y1: a.y2, x2: a.x2, y2: a.y2 },
    { type: "vertical", x1: a.x2, y1: a.y1, x2: a.x2, y2: a.y2 },
  ]
}

function dropAll(bricks) {
  let sorted = bricks.sort((a, b) => a.z1 - b.z1);
  let pile = [];
  for (let i = 0; i < sorted.length; i++) {
    const brick = sorted[i];
    let dropped = dropBrick(pile, brick);
    pile.push(dropped);
  }
  return pile;
}

function countSafe(bricks) {
  return bricks.filter(b1 => !bricks.some(b2 => b2.supportedBy.length == 1 && b2.supportedBy[0] == b1.id)).length;
}

let dropped = dropAll(blocks);
console.log(countSafe(dropped));

// part 2
function totalSupporting(pile, id) {
  let done = false;
  let collapsed = new Set();
  collapsed.add(id);
  while (!done) {
    done = true;
    pile.filter(it => !collapsed.has(it.id))
      .filter(b => b.supportedBy.length != 0 && b.supportedBy.every(s => collapsed.has(s)))
      .forEach(b => {
        collapsed.add(b.id);
        done = false;
      })
  }
  
  return collapsed.size - 1;
}

console.log(dropped.map(it => totalSupporting(dropped, it.id)).reduce((a,b) => a+b, 0))
