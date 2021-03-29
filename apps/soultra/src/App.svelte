<script>
    import { shuffle, vec_add, vec_sub } from "../../codebase"
    import { vec_mul, vec_rot, vec_unit } from "../../codebase"
    import { range, bezier, subcurve } from "../../codebase"

    import { body, points } from "./data"

    import { tweened } from "svelte/motion"
    import { cubicOut } from "svelte/easing"

    import { alea } from "seedrandom"


    let pts1 = points
    let pts2 = shuffle(points.map((pt) => [pt[0] + 0.6, pt[1]]), 1)
    let conn = connect(pts1, pts2, 2)

    let i = 0
    let p = tweened(0, {duration: 2500, easing: cubicOut})
    let r = points.map(() => Math.random() * 0.6)

    // main animated state
    //
    $: state = r.map((x, n) => {
            let w = 0.4
            let u = -1 + x + $p * 2
            let ua = Math.min(Math.max(u, 0), 1)
            let ub = Math.min(Math.max(u + w, 0), 1)
            let ux = 1 - Math.min(Math.max(ub / w, 0), 1)
            let uy = 1 - Math.min(Math.max((1 - ua) / w, 0), 1)
            return [n, subcurve(conn[n], ua, ub), ux, uy]
    })

    // same as wire but random and for multiple points
    //
    function connect(as, bs, seed=0) {
        let ws = new Array()
        let rng = alea(seed)
        for (let n=0; n < as.length; n++) {
            ws.push(wire(as[n], bs[n], 0.5, 0.3, Math.sign(0.5 - rng())))
        }
        return ws
    }


    // connect two points with cubic control polygon
    // kang = spread angle
    // klen = length of tangents
    // nang = normalized angle parameter [-0.5, 0.5]
    //
    function wire(a, b, kang, klen, nang) {
        let da = vec_unit(vec_sub(b, a), klen)
        let ar = kang * Math.PI * 0.5 * nang
        let ta = vec_rot(da, ar)

        let db = vec_unit(vec_sub(a, b), klen)
        let br = kang * Math.PI * 0.5 * nang
        let tb = vec_rot(db, br)

        return [a, vec_add(a, ta), vec_add(b, tb), b]
    }

    function pts_to_svgpath(pts) {
        let s = "M " + pts[0].join(",")
        return s + " C " + pts.slice(1).map(p => p.join(",")).join(" ")
    }

    // switch main parameter on every click
    //
    async function onClick(event) {
        i = Math.round(i + 1) % 2
        if ($p == 0 || $p == 1 ) {
            pts2 = shuffle(points.map((pt) => [pt[0] + 0.6, pt[1]]), Math.floor(Math.random() * 100))
            conn = connect(pts1, pts2, 2)
        }
        p.set(i)
    }

</script>



<svg width=700 height={700/1.5} viewBox="0 0 1.5 1">

{#each state as st}
<path d={pts_to_svgpath(st[1])} fill=none stroke=black stroke-width=0.003 stroke-linecap=round stroke-dasharray="0.01"/>
<circle cx={st[1][3][0]} cy={st[1][3][1]} r={0.007 * i} fill=black />
<circle cx={st[1][0][0]} cy={st[1][0][1]} r={0.007 * (1-i)} fill=black />

<circle cx={pts1[st[0]][0]} cy={pts1[st[0]][1]} r={0.01 * st[2]} fill=black />
<circle cx={pts2[st[0]][0]} cy={pts2[st[0]][1]} r={0.01 * st[3]} fill=black />
{/each}

<path d={body} stroke=black stroke-width=0.003 fill=transparent on:click={onClick}/>
<path d={body} stroke=black stroke-width=0.003 fill=transparent on:click={onClick} transform="translate(0.6, 0)"/>
</svg>
