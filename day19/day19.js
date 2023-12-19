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

  let condition = () => true;
  if (match[3] != undefined && match[3] == "<") {
    condition = (part) => part[match[2]] < (match[4] * 1);
  }
  if (match[3] != undefined && match[3] == ">") {
    condition = (part) => part[match[2]] > (match[4] * 1);
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
        x: match[1] * 1,
        m: match[2] * 1,
        a: match[3] * 1,
        s: match[4] * 1,
      }
    })
}

function runPart1(workflows, allParts) {
  let buckets = { in: allParts };
  let newBuckets = {};
  
  let done = false;
  while (!done) {
    done = true;
    
    Object.entries(buckets).forEach(bucket => {
      // console.log(bucket)
      let id = bucket[0];
      let parts = bucket[1];
      let workflow = workflows[id];
      if (workflow == undefined) {
        if (newBuckets[id] == undefined) {
          newBuckets[id] = [];
        }
        parts.forEach(part => newBuckets[id].push(part));
        return;
      }
      // console.log(parts)
      parts.forEach(part => {
        let newBucket = workflow.rules.filter(wf => wf.condition(part))[0].result;
        if (newBuckets[newBucket] == undefined) {
          newBuckets[newBucket] = [];
        }
        if (newBucket != id) {
          done = false;
        }        
        newBuckets[newBucket].push(part);
      });
    });
    
    buckets = newBuckets;
    newBuckets = {};
  }
  
  return buckets;
}

let workflows = parseWorkflows(sections[0]);
let parts = parseParts(sections[1]);
let out = runPart1(workflows, parts);

console.log(out["A"].map(part => part.x + part.m + part.a + part.s).reduce((a,b) => a+b, 0))
