// part 1

const text = await Deno.readTextFile("./input.txt");
const maps = text.split("\n\n");

function range(size, startAt) {
  return [...Array(size).keys()].map(i => i + startAt);
}

function parseMap(map) {
  return map.split("\n").map(row => row.split(""));
}

function symmetrical(str) {
  if (str.length % 2 == 1) {
    return false;
  }

  let firstHalf = str.substring(0, str.length / 2);
  let secondHalf = str.substring(str.length / 2);

  return firstHalf == secondHalf.split("").reverse().join("");
}

function findSymmetry(map, notCounting) {
  let left = range(map[0].length - 1, 0)
    .filter(it => notCounting.left == undefined || notCounting.left != it)
    .filter(trim => map.map(row => row.slice(0, row.length - trim).join("")).every(symmetrical))[0];

  let right = range(map[0].length - 1, 0)
    .filter(it => notCounting.right == undefined || notCounting.right != it)
    .filter(trim => map.map(row => row.slice(trim).join("")).every(symmetrical))[0];

  let top = range(map.length - 1, 0)
    .filter(it => notCounting.top == undefined || notCounting.top != it)
    .filter(trim => {
      let trimmed = map.slice(0, map.length - trim);
      return trimmed[0].map((it, i) => trimmed.map(it => it[i]).join("")).every(symmetrical);
    })[0];

  let bottom = range(map.length - 1, 0)
    .filter(it => notCounting.bottom == undefined || notCounting.bottom != it)
    .filter(trim => {
      let trimmed = map.slice(trim);
      return trimmed[0].map((it, i) => trimmed.map(it => it[i]).join("")).every(symmetrical);
    })[0];

  return { left, right, top, bottom };
}

console.log(maps.map(parseMap).map(map => symmetryValue(map, findSymmetry(map, {}))).reduce((a, b) => a + b, 0))

// part 2

function findOtherSymmetry(map) {
  let first = findSymmetry(map, {});
  for (let y = 0; y < map.length; y++) {
    const row = map[y];
    for (let x = 0; x < row.length; x++) {
      let newMap = map.map((row, i) => row.map((c, j) => i == y && j == x ? alt(c) : c));
      let newSymmetry = findSymmetry(newMap, first);
      if (newSymmetry.left != undefined || newSymmetry.right != undefined || newSymmetry.top != undefined || newSymmetry.bottom != undefined) {
        return newSymmetry;
      }
    }
  }
  console.log("failed")
}

function symmetryValue(map, symmetry) {
  if (symmetry.left != undefined) {
    return (map[0].length - symmetry.left) / 2
  } else if (symmetry.right != undefined) {
    return ((map[0].length - symmetry.right) / 2) + symmetry.right
  } else if (symmetry.top != undefined) {
    return ((map.length - symmetry.top) / 2) * 100
  } else if (symmetry.bottom != undefined) {
    return (((map.length - symmetry.bottom) / 2) + symmetry.bottom) * 100
  }

  throw "no symmetry";
}

function alt(c) {
  return c == "." ? "#" : ".";
}

console.log(maps.map(parseMap).map(map => symmetryValue(map, findOtherSymmetry(map))).reduce((a, b) => a + b, 0))
