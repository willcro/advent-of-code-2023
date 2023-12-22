// part 1

const text = await Deno.readTextFile("./input.txt");
const map = text.split("\n").map(line => line.split(""));
const start = map.flatMap((line, y) => line.map((it, x) => it == "S" ? { x, y } : null)).filter(it => it != null)[0];

function run(steps, start) {
  let xmax = map[0].length - 1;
  let ymax = map.length - 1;
  let current = [start];
  let next = new Set();

  for (var i = 0; i < steps; i++) {
    for (let j = 0; j < current.length; j++) {
      const tile = current[j];
      const x = tile.x;
      const y = tile.y;

      if (x > 0 && map[y][x - 1] != "#") {
        next.add(JSON.stringify({ x: x - 1, y: y }));
      }

      if (x < xmax && map[y][x + 1] != "#") {
        next.add(JSON.stringify({ x: x + 1, y: y }));
      }

      if (y > 0 && map[y - 1][x] != "#") {
        next.add(JSON.stringify({ x: x, y: y - 1 }));
      }

      if (y < ymax && map[y + 1][x] != "#") {
        next.add(JSON.stringify({ x: x, y: y + 1 }));
      }

    }
    current = Array.from(next).map(it => JSON.parse(it));
    next = new Set();
  }

  return current.length;
}

console.log(run(64, start))

// part 2
// this solution only works for the real input, not the practice

// Here is a basic shrunken shape that I worked with
// % is the center (also a dark square): fully saturated
// # means dark square: fully saturated
// . means light square: fully saturated
// + means corner square: 130 steps inside
// @ means first right perimeter: 195 steps inside
// ^ means second ring perimeter: 64 steps inside
/**
 *           +
 *         ^@.@^
 *        ^@.#.@^
 *       ^@.#.#.@^
 *      ^@.#.#.#.@^
 *     ^@.#.#.#.#.@^
 *    ^@.#.#.#.#.#.@^
 *   ^@.#.#.#.#.#.#.@^
 *  ^@.#.#.#.#.#.#.#.@^
 * ^@.#.#.#.#.#.#.#.#.# 
 * +.#.#.#.#.%.#.#.#.#.+
 * ^@.#.#.#.#.#.#.#.#.@^
 *  ^@.#.#.#.#.#.#.#.@^
 *   ^@.#.#.#.#.#.#.@^
 *    ^@.#.#.#.#.#.@^
 *     ^@.#.#.#.#.@^
 *      ^@.#.#.#.@^
 *       ^@.#.#.@^
 *        ^@.#.@^
 *         ^@.@^
 *           +
 */

// "To answer that we need to talk about parallel universes." - pannenkoek2012

let r = (26501365 - 65) / 131 - 1;

let totalFull = 2 * r + 2 * r * r + 1;
let totalFullDark = r * r
let totalFullLight = (r + 1) * (r + 1);

// 201 and 200 have no special meaning. That is just enough
// to saturate the grid
// fully saturared blocks oscilate between 2 values
// so how many they have depends on if we end on an even
// or odd number
let darkValue = run(201, start) * totalFullDark;
let lightValue = run(200, start) * totalFullLight;
let topValue = run(130, { x: 65, y: 130 });
let bottomValue = run(130, { x: 65, y: 0 });
let leftValue = run(130, { x: 130, y: 65 });
let rightValue = run(130, { x: 0, y: 65 });

let topLeftFirstDiagonalValue = run(195, { x: 130, y: 130 }) * r;
let topRightFirstDiagonalValue = run(195, { x: 0, y: 130 }) * r;
let bottomLeftFirstDiagonalValue = run(195, { x: 130, y: 0 }) * r;
let bottomRightFirstDiagonalValue = run(195, { x: 0, y: 0 }) * r;

let topLeftSecondDiagonalValue = run(64, { x: 130, y: 130 }) * (r + 1);
let topRightSecondDiagonalValue = run(64, { x: 0, y: 130 }) * (r + 1);
let bottomLeftSecondDiagonalValue = run(64, { x: 130, y: 0 }) * (r + 1);
let bottomRightSecondDiagonalValue = run(64, { x: 0, y: 0 }) * (r + 1);

console.log(darkValue + lightValue
  + topValue + bottomValue + leftValue + rightValue
  + topLeftFirstDiagonalValue + topRightFirstDiagonalValue + bottomLeftFirstDiagonalValue + bottomRightFirstDiagonalValue
  + topLeftSecondDiagonalValue + topRightSecondDiagonalValue + bottomLeftSecondDiagonalValue + bottomRightSecondDiagonalValue
);
