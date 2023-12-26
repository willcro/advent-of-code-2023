// part 1

const text = await Deno.readTextFile("./input.txt");
const reg = /(-?\d+), +(-?\d+), +(-?\d+) +@ +(-?\d+), +(-?\d+), +(-?\d+)/

function abs(x) {
  return x < 0n ? -x : x;
}

class Rational {

  constructor(num, den) {
    num = BigInt(num);
    den = BigInt(den)
    if (den < 0) {
      num = -num;
      den = -den;
    }

    let g = gcd(abs(num), abs(den));

    this.numerator = BigInt(num / g);
    this.denominator = BigInt(den / g);
    this.value = Number(this.numerator) / Number(this.denominator);
  }

  plus(other) {
    return new Rational(this.numerator * other.denominator + other.numerator * this.denominator, this.denominator * other.denominator);
  }

  minus(other) {
    return new Rational(this.numerator * other.denominator - other.numerator * this.denominator, this.denominator * other.denominator);
  }

  times(other) {
    return new Rational(this.numerator * other.numerator, this.denominator * other.denominator);
  }

  dividedBy(other) {
    return new Rational(this.numerator * other.denominator, this.denominator * other.numerator);
  }

  equals(other) {
    return this.numerator == other.numerator && this.denominator == other.denominator;
  }

  numberValue() {
    return this.value
  }
  
}

const ZERO = new Rational(0, 1);
const stones = text.split("\n").map(parseLine);

function parseLine(line) {
  let match = reg.exec(line);
  return {
    origin: {
      x: new Rational(match[1] * 1, 1),
      y: new Rational(match[2] * 1, 1),
      z: new Rational(match[3] * 1, 1),
    },
    direction: {
      x: new Rational(match[4] * 1, 1),
      y: new Rational(match[5] * 1, 1),
      z: new Rational(match[6] * 1, 1),
    }
  };
}

function findIntersection2d(s1, s2) {
  let k1 = s1.direction.y.dividedBy(s1.direction.x);
  let k2 = s2.direction.y.dividedBy(s2.direction.x);
  let i1 = s1.origin.y.minus(k1.times(s1.origin.x));
  let i2 = s2.origin.y.minus(k2.times(s2.origin.x));

  let x = i2.minus(i1).dividedBy(k1.minus(k2));
  let y = k1.times(x).plus(i1);

  return { x, y };
}

function countIntersections(xmin, xmax, ymin, ymax) {
  let count = 0;

  for (let i = 0; i < stones.length; i++) {
    const s1 = stones[i];
    for (let j = i + 1; j < stones.length; j++) {
      const s2 = stones[j];
      let intersection = findIntersection2d(s1, s2);

      if ((intersection.x.minus(s1.origin.x)).dividedBy(s1.direction.x).numberValue() < 0 || (intersection.x.minus(s2.origin.x)).dividedBy(s2.direction.x).numberValue() < 0) {
        // in the past
        continue;
      }

      if (intersection.x.numberValue() <= xmax && intersection.x.numberValue() >= xmin && intersection.y.numberValue() <= ymax && intersection.y.numberValue() >= ymin) {
        count++;
      }
    }
  }

  return count;
}

console.log(countIntersections(200000000000000, 400000000000000, 200000000000000, 400000000000000))

function plus(a, b) {
  return {
    x: a.x.plus(b.x),
    y: a.y.plus(b.y),
    z: a.z.plus(b.z)
  };
}

function minus(a, b) {
  return {
    x: a.x.minus(b.x),
    y: a.y.minus(b.y),
    z: a.z.minus(b.z)
  };
}

function scalerProduct(v, s) {
  return {
    x: v.x.times(s),
    y: v.y.times(s),
    z: v.z.times(s)
  }
}

function dotProduct(a, b) {
  return a.x.times(b.x).plus(a.y.times(b.y)).plus(a.z.times(b.z));
}

function crossProduct(b, c) {
  return {
    x: b.y.times(c.z).minus(b.z.times(c.y)),
    y: b.z.times(c.x).minus(b.x.times(c.z)),
    z: b.x.times(c.y).minus(b.y.times(c.x))
  };
}

function closestPoints(a, b) {
  let r1 = a.origin;
  let r2 = b.origin;
  let e1 = a.direction;
  let e2 = b.direction;
  let n = crossProduct(e1, e2);

  let nSquared = dotProduct(n, n);

  if (nSquared.equals(ZERO)) {
    return null;
  }

  let t1 = dotProduct(crossProduct(e2, n), minus(r2, r1)).dividedBy(nSquared);
  let t2 = dotProduct(crossProduct(e1, n), minus(r2, r1)).dividedBy(nSquared);

  let p1 = plus(scalerProduct(e1, t1), r1);
  let p2 = plus(scalerProduct(e2, t2), r2);
  return [p1, p2];
}

const ORIGIN = { x: new Rational(0, 1), y: new Rational(0, 1), z: new Rational(0, 1) };

function project(normal, stone) {
  let points = closestPoints(stone, { origin: ORIGIN, direction: normal });
  
  if (points == null) {
    return null;
  }
  
  let origin = minus(points[0], points[1]);
  let direction = crossProduct(normal, crossProduct(stone.direction, normal));
  return { origin, direction };
}

function areTheSame(a, b) {
  let cross = crossProduct(a.direction, b.direction);

  if (!cross.x.equals(ZERO) || !cross.y.equals(ZERO) || !cross.z.equals(ZERO)) {
    return false;
  }

  let coef = 0;
  
  if (!a.direction.x.equals(ZERO)) {
    coef = (a.origin.x.minus(b.origin.x)).dividedBy(a.direction.x);
  } else if (!a.direction.y.equals(ZERO)) {
    coef = (a.origin.y.minus(b.origin.y)).dividedBy(a.direction.y);
  } else if (!a.direction.z.equals(ZERO)) {
    coef = (a.origin.z.minus(b.origin.z)).dividedBy(a.direction.z);
  }
    
  if (!(a.origin.x.plus(a.direction.x.times(coef))).minus(b.origin.x).equals(ZERO)) {
    return false;
  }

  if (!(a.origin.y.plus(a.direction.y.times(coef))).minus(b.origin.y).equals(ZERO)) {
    return false;
  }

  if (!(a.origin.z.plus(a.direction.z.times(coef))).minus(b.origin.z).equals(ZERO)) {
    return false;
  }

  return true;
}

function printVector(s) {
  console.log(`vector((${s.origin.x},${s.origin.y},${s.origin.z}),(${s.direction.x * 1000000000000 + s.origin.x}, ${s.direction.y * 1000000000000 + s.origin.y}, ${s.direction.z * 1000000000000 + s.origin.z}))`);
}

function gcd(a, b) {
  while (true) {
    if (b == 0) {
      return a;
    }

    const aOld = a;
    const bOld = b;

    a = bOld;
    b = aOld % bOld;
  }
}

function pointEquals(a, b) {
  return a.x.equals(b.x) && a.y.equals(b.y) && a.z.equals(b.z);
}

/**
 * This code is going to make no sense if you stubble across it.
 * Where did those numbers (2.447, 2.574, etc.) come from?
 * Using the code in findIntersections below, I did a linear
 * regression and took the 95% confidence interval to plug in below.
 * This wouldn't have been necessary if the code was faster,
 * but whatever.
 * 
 * This found the angle to be [201, 202, 79]
 * 
 */
function findAngle() {
  for (let z = 79; z < 10000; z++) {
    for (let y = Math.floor(2.447 * z); y < Math.ceil(2.574 * z); y++) {
      for (let x = Math.floor(2.474 * z); x < Math.ceil(2.551 * z); x++) {
        if (gcd(gcd(Math.abs(x), Math.abs(y)), Math.abs(z)) != 1) {
          continue;
        }
        let normal = { x: new Rational(x, 1), y: new Rational(y, 1), z: new Rational(z, 1) };
        let last = null;
        let success = true;
                
        for (let i = 1; i < stones.length; i++) {
          const stone1 = project(normal, stones[i - 1]);
          const stone2 = project(normal, stones[i]);
          
          if (stone2 == null || stone1 == null) {
            continue;
          }

          if (areTheSame(stone1, stone2)) {
            continue;
          }
          
          let intersection = closestPoints(stone1, stone2);
          if (intersection == null) {
            success = false;
            break;
          }

          const p = intersection[0];
          if (last != null && !pointEquals(last, p)) {
            success = false;
            break;
          }
          last = p;
        }
        if (success) {
          
          return {origin: last, direction: normal};
        }
      }
    }
  }

  throw "Couldn't find it";
}


function getTimes() {
  let angle = findAngle();
  let times = stones.map((s,i) => {
    let intersection = closestPoints(angle, s)[0];
    let time = intersection.x.minus(s.origin.x).dividedBy(s.direction.x);
    return {i:i, time: time, distance: intersection.x, intersection};
  });
  let firstHit = times.sort((a,b) => a.time.numberValue() - b.time.numberValue())[0];  
  let x = firstHit.intersection.x.minus(angle.direction.x.times(firstHit.time))
  let y = firstHit.intersection.y.minus(angle.direction.y.times(firstHit.time))
  let z = firstHit.intersection.z.minus(angle.direction.z.times(firstHit.time))
  return {x,y,z}
}

let startingPoint = getTimes();
console.log(startingPoint.x.plus(startingPoint.y).plus(startingPoint.z).numberValue())


function findIntersections() {
  let out = []
  for (let i = 0; i < stones.length; i++) {
    const s1 = stones[i];
    for (let j = i + 1; j < stones.length; j++) {
      const s2 = stones[j];
      
      let points = closestPoints(s1, s2);
      
      out.push({
        a: i,
        b: j,
        points: points,
        distance: distance(points[0], points[1])
      });
    }
    
  }
  
  let sorted = out.sort((a,b) => a.distance - b.distance);
  
  sorted.slice(0, 20).forEach(it => {
    console.log(`${it.points[0].y.numberValue()}\t${it.points[0].z.numberValue()}`)
    console.log(`${it.points[1].y.numberValue()}\t${it.points[1].z.numberValue()}`)
  })
}

// findIntersections()
