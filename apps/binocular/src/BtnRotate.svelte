<script>
    import { createEventDispatcher } from "svelte"
    import { tweened } from "svelte/motion"
    import { cubicOut } from "svelte/easing"

    export let ccw = false
    export let transform = 'translate(0,0)'

    const dispatch = createEventDispatcher()

    let blink = tweened(0, {duration: 600, easing: cubicOut})

    async function onClick(event) {
        dispatch('click')
        await blink.set(1)
        blink.set(0, {duration: 0})
    }

</script>

<g {transform}>

{#if ccw}
<g transform="scale(-0.4 0.4)" transform-origin="0.5 0.5" >
    <circle cx=0.5 cy=0.5 r={$blink * 0.4} fill=none stroke=dodgerblue stroke-width=0.02 stroke-opacity={1- $blink**4}/>
    
    {#each [0, 1, 2, 3] as n}
    <g transform={`rotate(${n * 90} 0.5 0.5)`}>
        <path
           id="arch"
           d="M 0.57814168,0.05683652 C 0.72667006,0.08302608 0.85392633,0.19079448 0.91427561,0.32386965"
           style="fill:none;stroke:dodgerblue;stroke-width:0.015;stroke-linecap:round;stroke-miterlimit:10" />
        <path
           id="arrow"
           d="m 0.94862351,0.44822744 -0.0720701,-0.12485015 0.0377222,4.9236e-4 0.0304535,-0.019964 z"
           style="fill:dodgerblue;fill-opacity:1;stroke:none;stroke-miterlimit:10" />
    </g>
    {/each}
    
    <circle cx=0.5 cy=0.5 r=0.5 fill=transparent on:click={onClick}/>
</g>

{:else}
<g transform="scale(0.4)" transform-origin="0.5 0.5" >
    <circle cx=0.5 cy=0.5 r={$blink * 0.4} fill=none stroke=deeppink stroke-width=0.02 stroke-opacity={1- $blink**4}/>
    
    {#each [0, 1, 2, 3] as n}
    <g transform={`rotate(${n * 90} 0.5 0.5)`}>
    <path
       id="arch"
       d="M 0.57814168,0.05683652 C 0.72667006,0.08302608 0.85392633,0.19079448 0.91427561,0.32386965"
       style="fill:none;stroke:deeppink;stroke-width:0.015;stroke-linecap:round;stroke-miterlimit:10" />
    <path
       id="arrow"
       d="m 0.94862351,0.44822744 -0.0720701,-0.12485015 0.0377222,4.9236e-4 0.0304535,-0.019964 z"
       style="fill:deeppink;fill-opacity:1;stroke:none;stroke-miterlimit:10" />
    </g>
    {/each}
    
    <circle cx=0.5 cy=0.5 r=0.5 fill=transparent on:click={onClick}/>
</g>
{/if}
</g>