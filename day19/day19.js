// part 1

const text = await Deno.readTextFile("./input.txt");
const sections = text.split("\n\n");
const ruleReg = /(([xmas])([<>])(-?[0-9]+):)?([a-zA-Z]+)/

function parseWorkflows(str) {
  let reg = /([a-z]+){(.*)}/
  let out = {};
  str.split("\n").map(line => {
    let match = reg.exec(line);
    return {
      id: match[1],
      rules: match[2].split(",").map(parseRule)
    }
  }).forEach(it => out[it.id] = it);

  return out;
}

function parseRule(ruleStr) {
  let match = ruleReg.exec(ruleStr);

  let condition = (part) => {
    return {
      passed: part,
      failed: null
    }
  };

  if (match[3] != undefined && match[3] == "<") {
    condition = (part) => {
      // clone
      let passed = JSON.parse(JSON.stringify(part));
      let failed = JSON.parse(JSON.stringify(part));
      let threshold = (match[4] * 1);

      if (part[match[2]].min >= threshold) {
        passed = null;
      } else if (part[match[2]].max < threshold) {
        failed = null;
      } else {
        passed[match[2]].max = threshold - 1;
        failed[match[2]].min = threshold;
      }

      return { passed, failed };
    };
  }

  if (match[3] != undefined && match[3] == ">") {
    condition = (part) => {
      // clone
      let passed = JSON.parse(JSON.stringify(part));
      let failed = JSON.parse(JSON.stringify(part));
      let threshold = (match[4] * 1);

      if (part[match[2]].max <= threshold) {
        passed = null;
      } else if (part[match[2]].min > threshold) {
        failed = null;
      } else {
        passed[match[2]].min = threshold + 1;
        failed[match[2]].max = threshold;
      }

      return { passed, failed };
    };
  }

  return {
    condition: condition,
    result: match[5]
  }
}

function parseParts(str) {
  let partReg = /{x=(-?[0-9]+),m=(-?[0-9]+),a=(-?[0-9]+),s=(-?[0-9]+)}/
  return str.split("\n")
    .map(line => {
      let match = partReg.exec(line);
      return {
        x: { min: match[1] * 1, max: match[1] * 1 },
        m: { min: match[2] * 1, max: match[2] * 1 },
        a: { min: match[3] * 1, max: match[3] * 1 },
        s: { min: match[4] * 1, max: match[4] * 1 },
      }
    })
}

function push(map, key, value) {
  if (map[key] == undefined) {
    map[key] = [];
  }
  map[key].push(value);
}

function run(workflows, parts) {
  let buckets = { in: parts };
  let newBuckets = {};

  let done = false;
  while (!done) {
    done = true;
    Object.entries(buckets).forEach(bucket => {
      let id = bucket[0];
      let parts = bucket[1];
      let workflow = workflows[id];
      if (workflow == undefined) {
        parts.forEach(part => push(newBuckets, id, part));
        return;
      }
      parts.forEach(part => {
        let remainder = part;
        workflow.rules.forEach(rule => {
          if (remainder == null) {
            return;
          }

          let result = rule.condition(remainder);
          if (result.passed != null) {
            push(newBuckets, rule.result, result.passed);
            done = false;
          }

          remainder = result.failed;
        });

      });
    });

    buckets = newBuckets;
    newBuckets = {};
  }

  return buckets;
}

function sum(ranges) {
  return ranges.map(part => part.x.min + part.m.min + part.a.min + part.s.min).reduce((a, b) => a + b, 0)
}

function combos(ranges) {
  return ranges.map(r => (r.x.max - r.x.min + 1) * (r.m.max - r.m.min + 1) * (r.a.max - r.a.min + 1) * (r.s.max - r.s.min + 1))
    .reduce((a, b) => a + b);
}

let workflows = parseWorkflows(sections[0]);
let parts = parseParts(sections[1]);

let part1 = run(workflows, parts);
console.log(sum(part1.A));

// part 2
let part2 = run(workflows, [{ x: { min: 1, max: 4000 }, m: { min: 1, max: 4000 }, a: { min: 1, max: 4000 }, s: { min: 1, max: 4000 }, }]);
console.log(combos(part2.A));
