// part 1

const text = await Deno.readTextFile("./input.txt");
const reg = /([%&]?)([a-z]+) -> ([a-z, ]+)/


class BroadcasterModule {
  constructor(id, inputs, outputs) {
    this.id = id;
    this.outputs = outputs;
  }

  pulse(input) {
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
  }

  pulse(input) {
    if (input.level == "HIGH") {
      return [];
    }
    
    let outLevel = this.state ? "LOW" : "HIGH";
    this.state = !this.state;
    
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
  }
  
  outLevel() {
    let allHigh = Object.entries(this.latest).every(entry => entry[1] == "HIGH");
    return allHigh ? "LOW" : "HIGH";
  }

  pulse(input) {
    this.latest[input.source] = input.level;

    return this.outputs.map(o => {
      return {
        source: this.id,
        destination: o,
        level: this.outLevel()
      }
    })
  }
}

class SignalModule {
  constructor(id, inputs, outputs) {
    this.id = id;
  }



  pulse(input) {
    if (input.level == "LOW") {
      throw `${id} got LOW`;
    }
    return [];
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

function pushButton(modules, input) {
  let pulses = input;
  let allPulses = input.map(it => it);
  while (pulses.length > 0) {
    let pulse = pulses.shift();
    if (modules[pulse.destination] == undefined) {
      continue;
    }
    let newPulses = modules[pulse.destination].pulse(pulse);
    newPulses.forEach(p => pulses.push(p));
    newPulses.forEach(p => allPulses.push(p));
  }
  // console.log(allPulses);
  return allPulses;
}

function part1(n) {
  let modules = parseInput(text);
  let highs = 0;
  let lows = 0;
  for (let i = 0; i < n; i++) {
    let pulses = pushButton(modules, [{ source: "button", level: "LOW", destination: "broadcaster" }]);
    highs += pulses.filter(it => it.level == "HIGH").length;
    lows += pulses.filter(it => it.level == "LOW").length;
  }
  return highs * lows
}

function part2(n) {
  let modules = parseInput(text);
  modules["rx"] = new SignalModule("rx");
  let highs = 0;
  let lows = 0;
  for (let i = 0; i < n; i++) {
    let pulses = pushButton(modules, [{ source: "button", level: "LOW", destination: "broadcaster" }]);
    highs += pulses.filter(it => it.level == "HIGH").length;
    lows += pulses.filter(it => it.level == "LOW").length;
  }
  return highs * lows
}

console.log(part1(1000));

console.log(part2(1000000));
