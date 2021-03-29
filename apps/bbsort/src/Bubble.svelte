<svelte:options accessors />
<script>
	import { tweened } from "svelte/motion"
	import { cubicOut } from "svelte/easing"

	export let pt = {x: 0.5, y: 0.5}
	export let id = "?"

	let an = tweened(0, {duration: 400, easing: cubicOut})

    // animation latch
    //
    let xx = null

    // scale factors for transition radii
    //
    let rr = {x: 0, y: 0}

    // currently we can react to stores only in lambdas
    //
	$: pmv = (() => {
		return xx ? {x: pt.x + (Math.sin($xx) + 1)*rr.x, y: pt.y + (-Math.cos($xx)*rr.y)} : pt
	})()


	export function move(rx, ry) {
		if (!xx) {
			an.set(-Math.PI/2, {duration: 0})
			rr = {x: rx, y: ry}
			xx = an
			return an.set(Math.PI/2).then(() => { pt = pmv; xx = null })
		}
	}

</script>

<circle cx={pmv.x} cy={pmv.y} r=0.2/>
<text x={pmv.x-0.05} y={pmv.y+0.05} font-size=0.2 fill=white >{id}</text>
