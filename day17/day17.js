// part 1

const text = await Deno.readTextFile("./input.txt");
const map = text.split("\n").map(row => row.split("").map(it => it * 1));

// I thought it would be fun to try to implement a min heap
class Heap {

  constructor(comparitor) {
    this.comparitor = comparitor;
    this.array = [];
  }

  push(it) {
    let index = this.array.push(it) - 1;
    let parentIndex = Math.ceil(index / 2) - 1
    let parent = this.array[parentIndex];
    while(parent != undefined && this.comparitor(it, parent) > 0) {
      // swap
      this.array[parentIndex] = it;
      this.array[index] = parent;
      
      index = parentIndex;
      parentIndex = Math.ceil(index / 2) - 1;
      parent = this.array[parentIndex];
    }
  }
  
  pop() {
    if (this.array.length == 1) {
      return this.array.pop();
    }
    
    if (this.array.length == 0) {
      return undefined;
    }
    
    const last = this.array.pop();
    const first = this.array[0];
    this.array[0] = last;
    
    let index = 0;
    let child1Index = 2 * index + 1;
    let child2Index = 2 * index + 2;
    let child1 = this.array[child1Index];
    let child2 = this.array[child2Index];
    while (true) {      
      if (child1 != undefined && this.comparitor(child1, last) > 0 && (child2 == undefined || this.comparitor(child1, child2) > 0)) {
        this.array[child1Index] = last;
        this.array[index] = child1;
        index = child1Index;
      } else if (child2 != undefined && this.comparitor(child2, last) > 0) {
        this.array[child2Index] = last;
        this.array[index] = child2;
        index = child2Index;
      } else {
        return first;
      }
      
      child1Index = 2 * index + 1;
      child2Index = 2 * index + 2;
      child1 = this.array[child1Index];
      child2 = this.array[child2Index];
    }
  }
  
  length() {
    return this.array.length;
  }
  
  sort() {
    let out = [];
    while(this.array.length > 0) {
      out.push(this.pop());
    }
    return out;
  }
}



function djikstra(map, min, max) {
  let verticesHeap = new Heap((a,b) => b.cost - a.cost);
  verticesHeap.push({ x: 0, y: 0, direction: "right", count: 0, cost: 0 });
  
  let burned = new Set();
  while (verticesHeap.length() > 0) {
    let vert = verticesHeap.pop();
    if (burned.has(`${vert.x},${vert.y},${vert.direction},${vert.count}`)) {
      continue;
    }
    
    burned.add(`${vert.x},${vert.y},${vert.direction},${vert.count}`);
    if (vert.x == map[0].length - 1 && vert.y == map.length - 1) {
      return vert.cost;
    }
    
    let up = {x: vert.x, y: vert.y - 1, direction: "up", count: vert.direction == "up" ? vert.count + 1 : 1 };
    let down = { x: vert.x, y: vert.y + 1, direction: "down", count: vert.direction == "down" ? vert.count + 1 : 1 };
    let left = { x: vert.x - 1, y: vert.y, direction: "left", count: vert.direction == "left" ? vert.count + 1 : 1 };
    let right = { x: vert.x + 1 , y: vert.y, direction: "right", count: vert.direction == "right" ? vert.count + 1 : 1 };
    let options = [];
    
    if (vert.direction != "down" && (vert.direction == "up" || vert.count >= min)) options.push(up);
    if (vert.direction != "up" && (vert.direction == "down" || vert.count >= min)) options.push(down);
    if (vert.direction != "right" && (vert.direction == "left" || vert.count >= min)) options.push(left);
    if (vert.direction != "left" && (vert.direction == "right" || vert.count >= min)) options.push(right);
    
    options.filter(v => inBounds(v, map))
      .filter(v => v.count <= max)
      .filter(v => !burned.has(`${v.x},${v.y},${v.direction},${v.count}`))
      .map(v => {
        v.cost = vert.cost + map[v.y][v.x];
        return v;
      })
      .forEach(v => {
        verticesHeap.push(v);
      });
  }
  
  throw "No path";
}

function heuristic(vert, map) {
  // return Math.abs(vert.x - (map[0].length - 1)) + Math.abs(vert.y - (map.length - 1));
  return 0;
}

function inBounds(vert, map) {
  return vert.x < map[0].length && vert.x >= 0 && vert.y < map.length && vert.y >= 0;
}

console.log(djikstra(map, 0, 3));

// part 2

console.log(djikstra(map, 4, 10));
