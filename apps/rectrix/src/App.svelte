<script>
    import { fade } from "svelte/transition"

    import Ngon  from "./Ngon.svelte"
    import Wheel from "./Wheel.svelte"

    let p = 1
    $: p_mapped = (1-p) * 0.8 + 0.1

</script>

<div class=top transition:fade="{{duration: 1000}}">
<svg width=500  height=500 viewBox='-100 -100 200 200' version=1.1 xmlns="http://www.w3.org/2000/svg" >
<Ngon transform="scale(100)" bind:parameter={p_mapped}/>
<Wheel xs="0.8" bind:parameter={p}/>
</svg>
</div>

<style>
    .top {
        margin:auto;
        max-width: 700px;
        height: 100%;
        display: flex;
        flex-flow: column wrap;
        justify-content: center;
        align-items: center;
    }
</style>
