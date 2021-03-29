<script>
    import { onMount } from "svelte"
	import { tweened } from "svelte/motion"
    import { cubicOut } from "svelte/easing"
    import { uuidv4, range } from "../../codebase"

    export let opened = 0
    export let transform = 'translate(0,0)'
    
	let min_rad = tweened(0.05, {duration: 400, easing: cubicOut})
    let number = 0
    let counter = 0
	let comp_id = uuidv4()
	
	async function onClick(event) {
        event.stopPropagation()
		counter = (counter + 1) % 2
		number = counter ? Math.floor(Math.random() * 9) : number
		min_rad.set(0.05 + counter * 0.25)
	}
    
    onMount(async () => {
        if (opened) {
            setTimeout(() => onClick(), 1000)
        }
    })

</script>

<style>
	.txt1 {
        font-family: "Share Tech Mono";
		fill: white;
		font-size: 0.3px;
        user-select: none;
	}
</style>

<g {transform}>
<circle cx=0.5 cy=0.5 r=0.4 stroke=none fill=lightgrey/>

{#each [...range(0, 1, 8)] as r}
<circle  cx=0.5 cy=0.5 r={$min_rad + r * (0.4 - $min_rad) } fill=none stroke=grey stroke-width="0.005"/>
{/each}

<clipPath id={"clip" + comp_id}>
<circle cx=0.5 cy=0.5 fill=#aaa r={$min_rad-0.05}/>
</clipPath>

<text x=0.43 y=0.59 clip-path={"url(#clip" + comp_id + ")" } class='txt1'>{number}</text>
<circle on:click={onClick}  cx=0.5 cy=0.5 r=0.4 stroke=none fill=transparent/>

</g>