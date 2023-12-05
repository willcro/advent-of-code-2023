// part 1

const text = await Deno.readTextFile("./input.txt");

function parseSeedsPart1(seedString) {
  return /seeds: (.*)/.exec(seedString)[1]
    .split(" ")
    .map(it => it * 1)
    .map(it => {
      return {
        start: it,
        end: it
      }
    })
}

function parseSeedsPart2(seedString) {
  const seedNumbers = /seeds: (.*)/.exec(seedString)[1]
    .split(" ")
    .map(it => it * 1);

  let seeds = [];

  for (let i = 0; i < seedNumbers.length; i += 2) {
    let rangeStart = seedNumbers[i];
    let length = seedNumbers[i + 1];
    seeds.push({
      start: rangeStart,
      end: rangeStart + length - 1
    });
  }

  return seeds;
}

function parseRange(range) {
  const numbers = range.split(" ");
  const destinationRangeStart = numbers[0] * 1;
  const sourceRangeStart = numbers[1] * 1;
  const length = numbers[2] * 1;

  return {
    start: sourceRangeStart,
    end: sourceRangeStart + length - 1,
    offset: destinationRangeStart - sourceRangeStart
  };
}

function parseGroup(group) {
  const lines = group.split("\n");
  const match = /([a-z]+)-to-([a-z]+) map:/.exec(lines[0]);
  const sourceType = match[1];
  const destinationType = match[2];
  const mapper = (input) => {
    let out = [];
    let next = input;
    for (let i = 1; i < lines.length; i++) {
      let inputRanges = next;
      next = [];
      for (let r = 0; r < inputRanges.length; r++) {
        const inputRange = inputRanges[r];
        let range = parseRange(lines[i]);
        let overlap = getOverlap(inputRange, range);
        if (overlap.overlap != null) {
          out.push({
            start: overlap.overlap.start + range.offset,
            end: overlap.overlap.end + range.offset,
          });
        }
        overlap.range1Remainder.forEach(it => next.push(it));
      }
    }

    next.forEach(it => out.push(it));
    return out;
  }

  return {
    sourceType: sourceType,
    destinationType: destinationType,
    mapper: mapper
  }
}

function parseInput(text, seedParser) {
  const groups = text.split("\n\n");
  const seedStr = groups[0];
  const seeds = seedParser(seedStr);
  const mappers = groups.slice(1).map(parseGroup);
  let out = seeds;
  mappers.forEach(mapper => {
    out = mapper.mapper(out)
  });
  return out;
}

function getOverlap(range1, range2) {
  if (range1.start > range2.start) {
    // simplifies logic by always making range 1 the smaller one
    let ret = getOverlap(range2, range1);
    return {
      overlap: ret.overlap,
      range1Remainder: ret.range2Remainder,
      range2Remainder: ret.range1Remainder
    }
  }

  if (range1.end >= range2.start) {
    const overlap = {
      start: range2.start,
      end: Math.min(range1.end, range2.end)
    };

    let range1Remainder = [];
    let range2Remainder = [];
    if (range1.start < range2.start) {
      range1Remainder.push({ start: range1.start, end: range2.start - 1 });
    }
    if (range1.end > range2.end) {
      range1Remainder.push({ start: range2.end + 1, end: range1.end });
    }
    if (range2.end > range1.end) {
      range2Remainder.push({ start: range1.end + 1, end: range2.end });
    }

    return {
      overlap: overlap,
      range1Remainder: range1Remainder,
      range2Remainder: range2Remainder
    };
  }

  return {
    overlap: null,
    range1Remainder: [
      range1
    ],
    range2Remainder: [
      range2
    ]
  };

}

console.log(parseInput(text, parseSeedsPart1).map(it => it.start).reduce((a, b) => Math.min(a, b)));

// part 2

console.log(parseInput(text, parseSeedsPart2).map(it => it.start).reduce((a, b) => Math.min(a, b)))
