import { alea } from "seedrandom"

// generate unique identifier
//
export function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

// generate range of numbers
//
export function* range(start, stop, count) {
    let step = (stop - start) / (count - 1);
    for (let n = 0; n <= stop; n += step) {
        yield n;
    }
}

// shuffle array
//
export function shuffle(a, seed=0) {
    let rng = alea(seed)
    for (let i = a.length - 1; i > 0; i--) {
        let j = Math.floor(rng() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]]
    }
    return a
}

// position elements on the circle of radius rad and tx, ty center
// return css or svg transformation string
//
export function* circular_pos(count, rad, rot, tx, ty) {
    let step = (Math.PI * 2) / count
    let r    = rot * Math.PI * 2
    for (let n = 0; n < count; n++) {
        yield `translate(${Math.sin(step*n + r)*rad + tx}, ${Math.cos(step*n + r)*rad + ty})`
    }
}

// deep copy of arrays
//
export function clone(items) {
    return items.map(item => Array.isArray(item) ? clone(item) : item)
}

// signed precise angle between two vectors
//
export function angle(v1, v2) {
    let dot = v1.x * v2.x + v1.y * v2.y
    let det = v1.x * v2.y - v1.y * v2.x
    return Math.atan2(det, dot)
}

// factorial
//
export function fac(n) {
    let x = 1
    for (let k = 1; k <= n; k++) {
        x *= k
    }
    return x
}

// n / 0 == 0
//
function zero_divide(a, b) {
    if (b != 0) return a / b
    return 0
}

// normalize 2d vector
//
export function vec_unit([x, y], k = 1) {
    let len = Math.sqrt(x**2 + y**2)
    return [zero_divide(x, len) * k, zero_divide(y, len) * k]
}

// equality check
//
export function vec_eq([x1, y1], [x2, y2]) {
    return x1 == x2 && y1 == y2
}

// vector operations
//
export function vec_add([x1, y1], [x2, y2]) {
    return [x1 + x2, y1 + y2]
}

export function vec_sub([x1, y1], [x2, y2]) {
    return [x1 - x2, y1 - y2]
}

export function vec_mul([x, y], k) {
    return [x * k, y * k]
}

export function vec_div([x, y], k) {
    return [x / k, y / k]
}

export function vec_dot([x1, y1], [x2, y2]) {
    return x1*x2 + y1*y2
}

export function vec_rot([x, y], phi) {
  return [x * Math.cos(phi) - y * Math.sin(phi), x * Math.sin(phi) + y * Math.cos(phi)]
}

export function vec_len([x, y]) {
    return Math.sqrt(x**2 + y**2)
}

export function vec_90([x, y], dir=0) {
    if (dir) return [y, -x]
    return [-y, x]
}

export function vec_angle(a, b) {
    return Math.acos(vec_dot(a, b) / (vec_len(a) * vec_len(b)))
}

export function slerp(a, b, p) {
    if (vec_eq(a, b)) {
        return a
    } else {
        let va = vec_angle(a, b)
        let m1 = zero_divide(Math.sin((1-p) * va), Math.sin(va))
        let m2 = zero_divide(Math.sin(p * va), Math.sin(va))
        return vec_add(vec_mul(a, m1), vec_mul(b, m2))
    }
}

export function nlerp(a, b, p) {
    return vec_unit(vec_add(vec_mul(a, (1-p)), vec_mul(b, p)))
}

// intersection of two parametric lines r s - points, a b - directions
//
function llx([rx, ry], [ax, ay], [sx, sy], [bx, by]) {
  if (bx*ay - ax*by != 0) {
    let k = (bx * (sy - ry) - by * (sx - rx)) / (bx * ay - ax * by)
    return [rx + k * ax, ry + k * ay]
  }
  return undefined
}


// Bernstein basis
//


function binom(n, i) {
    return zero_divide(fac(n), fac(i) * fac(n-i))
}

function be_basis(n, i, t) {
    let k1 = fac(n)
    let k2 = fac(i) * fac(n-i)
    return zero_divide(k1, k2) * (t**i) * ((1-t)**(n-i))
}

function be_basis_d1(n, i, t) {
    let k1 = i - n * t
    let k2 = t * (1-t)
    return zero_divide(k1, k2) * be_basis(n, i, t)
}

function be_basis_d2(n, i, t) {
    let k1 = (i- n * t)**2 - n*t**2 - i*(1 - 2 * t)
    let k2 = t**2 * (1-t)**2
    return zero_divide(k1, k2) * be_basis(n, i, t)
}

// bezier curve evaluation
//
export function bezier(pts, t, basis=be_basis) {
    let pt = new Array(pts[0].length).fill(0)
    for (let n = 0; n < pts.length; n++) {
        pt.forEach((x, k, a) => {a[k] += pts[n][k] * basis(pts.length-1, n, t)})
    }
    return pt
}

// first derivative
//
export function bezier_d1(pts, t) {
    return bezier(pts, t, be_basis_d1)
}

// second derivative
//
export function bezier_d2(pts, t) {
    return bezier(pts, t, be_basis_d2)
}

// normal
//
export function bezier_n(pts, t, dir=0) {
    let [x, y] = bezier_d1(pts, t)
    if (dir) return [y, -x]
    return [-y, x]
}


// construct de-Castlejau triangle
//
function DCT(pts, t) {
    let tri = new Array()
    tri.push(pts)
    for (let n = 0; n < pts.length - 1; n++) {
        let w = new Array()
        for (let k = 0; k < tri[n].length-1; k++) {
            w.push(vec_add(vec_mul(tri[n][k], 1-t), vec_mul(tri[n][k+1], t)))
        }
        tri.push(w)
    }
    return tri
}

// subdivide curve at parameter t
//
export function subdivide(pts, t) {
    let dct = DCT(pts, t)
    let a = dct.map((x) => x[0])
    let b = dct.map((x) => x[x.length - 1])
    return [a, b.reverse()]
}


// extract subcurve
//
export function subcurve(pts, a, b) {
    if (a == b) {
        if (a == 0) return pts.map(() => pts[0])
        return pts.map(() => pts[3])
    }
    let x = zero_divide(1, 1-a) * (b-a)
    let c1 = subdivide(pts, a)
    let c2 = subdivide(c1[1], x)
    return c2[0]
}


// same as subcurve, but interpret multiple curves as one
//
export function multi_subcurve(crvs, a, b) {
    let d = 1 / crvs.length
    let s = new Array()
    let n = 0
    for (let k = 0; k < 1; k += d, n++) {
        if (a < k + d && b > k) {
            if (a > k) {
                if (b < k + d) s.push(subcurve(crvs[n], (a - k) / d, (b - k) / d))
                else s.push(subcurve(crvs[n], (a - k) / d, 1))
            }
            else {
                if (b < k + d) s.push(subcurve(crvs[n], 0, (b - k) / d))
                else s.push(crvs[n])
            }
        }
    }
    return s
}

// sample parametric curve : points, number of samples, function
//
export function sample_curve(pts, num, fn) {
    let c = new Array()
    for (let t=0; t <= 1; t += 1/(num-1)) {
        c.push(fn(pts, t))
    }
    return c
}


// transfrom point from one svg element CS to another
//
export function vec_svg_map([x, y], a, b) {
    let bo = a.getBBox
    let pt = a.viewportElement.createSVGPoint()
    pt.x = bo.x + x
    pt.y = bo.y + y
    pt = pt.matrixTransform(a.getCTM()).matrixTransform(b.getCTM().inverse())
    return [pt.x, pt.y]
}


// transform point from svg viewport to element
// use it if you want to translate from [offsetX, offsetY] to target coordinates
//
export function vec_svg_mapview([x, y], target) {
    let vp = target.viewportElement
    let pt = Object.assign(vp.createSVGPoint(), {x: x, y: y})
    pt = pt.matrixTransform(target.getCTM().inverse())
    return [pt.x, pt.y]
}
