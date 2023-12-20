// part 1

const text = await Deno.readTextFile("./input.txt");
const reg = /([%&]?)([a-z]+) -> ([a-z, ]+)/


class BroadcasterModule {
  constructor(id, inputs, outputs) {
    this.id = id;
    this.outputs = outputs;
    this.lastLevel = "NO";
  }

  pulse(input) {
    this.lastLevel = input.level;
    return this.outputs.map(o => {
      return {
        source: this.id,
        destination: o,
        level: input.level
      }
    })
  }
}

class FlipFlopModule {
  constructor(id, inputs, outputs) {
    this.id = id;
    this.outputs = outputs;
    this.state = false;
    this.lastLevel = "NO";
  }

  pulse(input) {
    if (input.level == "HIGH") {
      return [];
    }
    
    let outLevel = this.state ? "LOW" : "HIGH";
    this.state = !this.state;
    
    this.lastLevel = outLevel;
    
    return this.outputs.map(o => {
      return {
        source: this.id,
        destination: o,
        level: outLevel
      }
    })
  }
}

class ConjunctionModule {
  constructor(id, inputs, outputs) {
    this.id = id;
    this.outputs = outputs;
    this.latest = {};
    inputs.forEach(i => this.latest[i] = "LOW");
    this.lastLevel = "NO";
  }
  
  outLevel() {
    let allHigh = Object.entries(this.latest).every(entry => entry[1] == "HIGH");
    return allHigh ? "LOW" : "HIGH";
  }

  pulse(input) {
    this.latest[input.source] = input.level;
    
    this.lastLevel = this.outLevel();

    return this.outputs.map(o => {
      return {
        source: this.id,
        destination: o,
        level: this.outLevel()
      }
    })
  }
}

const moduleMap = {
  "": BroadcasterModule,
  "%": FlipFlopModule,
  "&": ConjunctionModule
}

function parseInput(str) {
  let inputs = {};
  let lines = str.split("\n").map(parseLine);
  
  lines.forEach(line => {
    line.outputs.forEach(out => {
      if (inputs[out] == undefined) {
        inputs[out] = [];
      }
      inputs[out].push(line.id);
    });
  });
  
  let modules = {};
  
  lines.forEach(l => {
    let moduleConstructor = moduleMap[l.type];
    let input = inputs[l.id] == undefined ? [] : inputs[l.id];
    let module = new moduleConstructor(l.id, input, l.outputs);
    modules[l.id] = module;
  });
  
  return modules;
}

function parseLine(line) {
  let match = reg.exec(line);
  let outputs = match[3].split(", ");
  return {
    id: match[2],
    type: match[1],
    outputs: outputs
  };
}

function pushButton(modules, input, n, watched) {
  let pulses = input;
  let allPulses = input.map(it => it);
  while (pulses.length > 0) {
    let pulse = pulses.shift();
    if (modules[pulse.destination] == undefined) {
      continue;
    }
    
    let before = modules[pulse.destination].lastLevel;
    let newPulses = modules[pulse.destination].pulse(pulse);
    let after = modules[pulse.destination].lastLevel;

    if (before != after && pulse.destination == watched) {
      console.log(`${pulse.destination} changed from ${before} to ${after} on iteration ${n}`);
    }
    
    newPulses.forEach(p => pulses.push(p));
    newPulses.forEach(p => allPulses.push(p));
  }
  return allPulses;
}

function part1(n, watched) {
  let modules = parseInput(text);
  let highs = 0;
  let lows = 0;
  for (let i = 0; i < n; i++) {
    let pulses = pushButton(modules, [{ source: "button", level: "LOW", destination: "broadcaster" }], i, watched);
    highs += pulses.filter(it => it.level == "HIGH").length;
    lows += pulses.filter(it => it.level == "LOW").length;
  }
  return highs * lows;
}

console.log(part1(1000, "cq"));

part1(20000, "cq");
part1(20000, "dc");
part1(20000, "rv");
part1(20000, "vp");

function gcd(a, b) {
  if (b == 0) {
    return a;
  }

  return gcd(b, a % b);
}

function lcm(a, b) {
  return (a * b) / gcd(a, b);
}

// I didn't actually write the code to solve this.
// The code above logs when the cq, dc, rv, and vp switch.
// I used that to find the periods, then just used LCM.
// I have no idea how a generic solution to this problem would work.
// This one only worked because there was a nice predictable
// period for the 4 modules at the end
console.log([3877, 3797, 4051, 3847].reduce(lcm, 1));
