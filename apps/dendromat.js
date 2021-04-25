
///////////////////////////////////////////////////////////
///////// github.com/synxroform/dendromat.js //////////////
///////////////////////////////////////////////////////////

function* range(start, stop, count) {
    let step = (stop - start) / (count - 1);
    for (let n = 0; n <= stop; n += step) {
        yield n;
    }
}


function fac(n) {
    let x = 1
    for (let k = 1; k <= n; k++) {
        x *= k
    }
    return x
}


function zero_divide(a, b) {
    if (b != 0) return a / b
    return 0
}


function vec_add(a, b) {
    return a.map((x, i) => {return x + b[i]})
}

function vec_mul(a, b) {
    return a.map((x, i) => {return x * b[i]})
}

function vec_scale(a, k) {
    return a.map(x => {return x + k})
}

function vec_dist(a, b) {
    return Math.sqrt(a.map((x, i) => {return (x - b[i]) ** 2}).reduce((a, b) => {return a + b}, 0))
}


function be_basis(n, i, t) {
    let k1 = fac(n)
    let k2 = fac(i) * fac(n-i)
    return zero_divide(k1, k2) * (t**i) * ((1-t)**(n-i))
}


function bezier(pts, t, basis=be_basis) {
    let pt = new Array(pts[0].length).fill(0)
    for (let n = 0; n < pts.length; n++) {
        pt.forEach((x, k, a) => {a[k] += pts[n][k] * basis(pts.length-1, n, t)})
    }
    return pt
}


function DCT(pts, t) {
    let tri = new Array()
    tri.push(pts)
    for (let n = 0; n < pts.length - 1; n++) {
        let w = new Array()
        for (let k = 0; k < tri[n].length-1; k++) {
            w.push(vec_add(vec_scale(tri[n][k], 1-t), vec_scale(tri[n][k+1], t)))
        }
        tri.push(w)
    }
    return tri
}


function subdivide(pts, t) {
    let dct = DCT(pts, t)
    let a = dct.map((x) => x[0])
    let b = dct.map((x) => x[x.length - 1])
    return [a, b.reverse()]
}


function closest_u(c_pts, pt, z = 10, a = 0, b = 1) {
    if (z == 0) return a + (b-a)/2
    let sx = [...range(a, b, 5)].map(t => [bezier(c_pts, t), t])
    let ss = sx.slice(1, -1)
    let d = Number.MAX_VALUE
    let n = 0
    for (let i = 0; i < ss.length; i++) {
        let q = vec_dist(ss[i][0], pt)
        if (q < d) {
            d = q
            n = i + 1
        }
    }
    return closest_u(c_pts, pt, z-1, sx[n-1][1], sx[n+1][1])
}


// this is for animation.
// tree: prepared by build_tree
// p: parameter in range [0..1]
//
export function grow_tree(tree, p) {
    let mp = p * (Math.max(...tree.map(b => b.len)) + 1)
    let acc = []
    for (const b of tree) {
        if (mp - b.len > 0) {
            acc.push(subdivide(b.pts, Math.min(mp-b.len, 1))[0])
        }
    }
    return acc
}


// this converts unstructured curves to tree suitable for animation.
// root: main bezier curve
// branches: list of bezier curves (degree of curves doesn't matter can be 1 for lines)
// each curve is a list of control points.
//
export function build_tree(root, branches, acc, l0 = 0, tol = 0.01) {

    if (!acc) {
        let acc = []
        build_tree(root, branches, acc)
        return acc
    }

    let layers = [[], []]

    for (const b of branches) {
        let u = closest_u(root, b[0])
        let p = bezier(root, u)

        if (vec_dist(p, b[0]) < tol) {
            layers[0].push([b, u])
        } else {
            layers[1].push(b)
        }
    }
    if (layers[0].length > 0) {
        for (const bu of layers[0]) {
            build_tree(bu[0], layers[1], acc, l0 + bu[1], tol)
        }
    }
    acc.push({ pts: root, len: l0 })
}


// this can be used to convert svg paths string to list of curves
// only lines and bezier curves acceptable = LCQ
//
export function path_to_pts(path) {
    let pts = path.split(/[MLCQ]/i).map(x => x.trim().split(" ")).slice(1)
    return pts.slice(0, -1).map(x => x.slice(-1)).map((x, n) => x.concat(pts[n+1]).map(s => s.split(",").map(n => Number(n))))
}

// this is opposite to the previous function
//
export function pts_to_path(pts) {
    let ps = pts.map(x => x.join(","))

    switch (ps.length) {
        case 2:
            return "M " + ps[0] + "L " + ps[1]
        case 3:
            return "M " + ps[0] + "Q " + ps.slice(1).join(" ")
        case 4:
            return "M " + ps[0] + "C " + ps.slice(1).join(" ")
    }
}
