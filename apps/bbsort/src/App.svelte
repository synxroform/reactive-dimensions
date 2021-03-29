<script>
	import Bubble from "./Bubble.svelte"

	let p0
	let bbs = new Array()
	let run = false

	function get_local_co(event) {
        let vp = event.target.viewportElement
        let pt = Object.assign(vp.createSVGPoint(), {x: event.offsetX, y: event.offsetY})
        pt = pt.matrixTransform(event.target.getCTM().inverse())
        return [pt.x, pt.y]
	}

	async function pointerDown(event) {
        let co = get_local_co(event)
		p0 = Math.floor(co[0])
	}

	async function pointerMove(event) {
		if (event.buttons == 1) {
			let co = get_local_co(event)
			let p1 = Math.floor(co[0])

			if (p1 != p0 && !run) {
                let [A, B] = [p0, p1]

				if (p1 < p0) {
                    bbs[p0].move(-0.5, 0.3)
				  	bbs[p1].move(0.5, -0.3).then(() => { swap(A, B); run = false })
				} else {
                    bbs[p1].move(-0.5, -0.3)
				  	bbs[p0].move(0.5, 0.3).then(() => { swap(A, B); run = false })
                }
				run = true
            }
            p0 = p1;
		}
	}

	function swap(p0, p1) {
		[bbs[p0], bbs[p1]] = [bbs[p1], bbs[p0]];
	}

</script>

<h3>swap pair of cells by dragging them</h3>
<svg width=400 height=100 viewBox="0 0 4 1">
	{#each [0, 1, 2, 3] as x, n}
		<Bubble bind:this={bbs[n]} pt={{x: x+0.5, y:0.5}} id={n}/>
	{/each}

	<rect x=0 y=0 width=4 height=1 on:pointermove={pointerMove} on:mousedown={pointerDown} fill=transparent/>
</svg>
