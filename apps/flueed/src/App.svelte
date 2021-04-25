<script>

import { multi_subcurve } from "../../codebase"
import { curves } from "./data"

import { tweened } from "svelte/motion"
import { cubicOut } from "svelte/easing"

let p = 0
let colors = ["dodgerblue", "dodgerblue", "black", "deeppink", "deeppink"]

let pp = tweened(0, {duration: 200, easing: cubicOut})

function pts_to_multipath(pts) {
    let s = "M " + pts[0][0].join(",")
    for (let n = 0; n < pts.length; n++) {
        s += pts[n].length > 2 ? " C " : " L "
        s += pts[n].slice(1).map(p => p.join(",")).join(" ")
    }
    return s
}

async function pointerDown(event) {
    event.target.setPointerCapture(event.pointerId)
    pp.set(0.1)
}

async function pointerMove(event) {
    if (event.buttons == 1) {
        p += -event.movementX * 0.02
    }
}

async function pointerUp(event) {
    event.target.releasePointerCapture(event.pointerId)
    pp.set(0)
}

</script>

<svg width=600 height=300 viewBox="0 0 20 10" transform="scale(1, -1)">

{#each curves.slice(1, -1) as msc, n}
{#if n != 2}
    <path d={pts_to_multipath(msc)} fill=none stroke-width={$pp * 4} stroke={colors[n]} stroke-opacity={$pp}/>

    <path d={pts_to_multipath(msc)} fill=none stroke-width={$pp} stroke={colors[n]} stroke-linecap=round stroke-dasharray="0.2, 1.8" stroke-dashoffset={p + n - 0.07} />
    <path d={pts_to_multipath(msc)} fill=none stroke-width=0.05 stroke={colors[n]} stroke-dasharray={`${2 - $pp*5}, ${$pp*5}`} stroke-dashoffset={p + n} />
{:else}
    <path d={pts_to_multipath(msc)} fill=none stroke-width=0.04 stroke={colors[n]}  stroke-dashoffset={p + n} />
{/if}
{/each}

<path d={pts_to_multipath(curves[0])} fill=none stroke-width=0.05 stroke=black/>
<path d={pts_to_multipath(curves[6])} fill=none stroke-width=0.05 stroke=black/>

<rect x=0 y=0 width=20 height=20 fill=transparent on:pointerdown={pointerDown} on:pointerup={pointerUp} on:mousemove={pointerMove}/>

</svg>
