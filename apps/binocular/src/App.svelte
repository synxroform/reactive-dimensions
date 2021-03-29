<script>
    import Binocular from "./Binocular.svelte"
    import BtnRotate from "./BtnRotate.svelte"
    
    import { tweened } from "svelte/motion"
    import { cubicOut } from "svelte/easing"
    import { circular_pos } from "../../codebase"

    let rot = tweened(0, {duration: 500, easing: cubicOut})    

    function cpos(n, rad, rot, tx, ty) {
        let step = (Math.PI * 2) / 3
        let r    = (rot + 0.5/3) * Math.PI * 2
        return `translate(${Math.sin(step*n + r)*rad + tx}, ${Math.cos(step*n + r)*rad + ty})`
    }

    async function rotate_cw(e) {
        rot.update((x) => {return (x-1.0/3)})
    }

    async function rotate_ccw(e) {
        rot.update((x) => {return (x+1.0/3)})
    }
</script>

<div class="top">
<svg width=400 height=500 viewBox='0 0 2 2.7' version=1.1 xmlns="http://www.w3.org/2000/svg">
{#each [1, 2, 3] as n}
<Binocular opened={0} transform={cpos(n, 0.5, $rot, 0.5, 0.5)}/>
{/each}
<g transform={`rotate(${$rot * -360} 1 1)`} id="spinner">
<path
    d="M 0.96875,0.04101562 C 0.81592633,0.05125479 0.67822269,0.13692986 0.6015625,0.26953125 0.52858621,0.3957605 0.48755082,0.53811189 0.41359919,0.66556522 0.34183011,0.78925699 0.2395237,0.89576046 0.16796875,1.0195312 c -0.17716426,0.3064463 0.044465,0.6894532 0.3984375,0.6894532 0.14572172,0 0.29144343,-0.033929 0.43716515,-0.033929 0.1433408,0 0.2866816,0.033929 0.4300224,0.033929 0.3539724,0 0.5756016,-0.3830069 0.3984374,-0.6894532 C 1.7607745,0.89627631 1.6540864,0.78263429 1.5828296,0.65937939 1.5095551,0.53263432 1.471712,0.39627634 1.3984375,0.26953125 1.3105839,0.11756822 1.1438619,0.02889841 0.96875,0.04101562 Z"
    style="fill:none;stroke:#aaaaaa;stroke-width:0.007"
    id="inner_triangle" />
<path
    d="M 0.98046875,0.015625 A 0.48529402,0.48529402 0 0 0 0.58007812,0.2578125 l -0.43359374,0.75 A 0.48529402,0.48529402 0 0 0 0.56640625,1.734375 H 1.4335938 A 0.48529402,0.48529402 0 0 0 1.8535156,1.0078125 l -0.4335937,-0.75 A 0.48529402,0.48529402 0 0 0 0.98046875,0.015625 Z"
    style="fill:none;stroke:#d5d5d5;stroke-width:0.007"
    id="outer_triangle" />
</g>
<BtnRotate transform="translate(0.1, 1.7)" on:click={rotate_cw}/>
<BtnRotate transform="translate(0.9, 1.7)" on:click={rotate_ccw} ccw={true}/>
</svg>
</div>

<svelte:head>
      <style>
			@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
         body {
            background-color: #eee; 
         }
      </style>
</svelte:head>

<style>
    .top {
        margin: auto;
        display: flex;
        flex-flow: column wrap; 
        max-width: 900px;
        height: 100%;
        justify-content: center;
        align-items: center;
    }
</style>