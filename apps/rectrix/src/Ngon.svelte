<script>
    import { clone } from "../../codebase"

    export let transform = "translate(0,0)"
    export let parameter = 0.5

    let hex = [[0.9330, 0.75],[0.9330, 0.25],[0.5, 0],[0.0669, 0.25],[0.0669, 0.75],[0.5, 1]]
    let pt0 = repeat(hex, 7)

    $: ptx  = change(pt0, parameter)


    function repeat(arr, k) {
        let acc = [arr]
        for (let n = 0; n < k-1; n++) {
            acc.push(clone(arr))
        }
        return acc
    }

    function change(mtx, p) {
        for (let n = 1; n < mtx.length; n++) {
             for (let pt = 0; pt < mtx[0].length; pt++) {
                 for (let co = 0; co < mtx[0][0].length; co++) {
                     mtx[n][pt][co] = mtx[n-1][pt][co] * (1 - p) +
                                        mtx[n-1][(pt+1) % mtx[0].length][co] * p;
                 }
             }
        }
        return mtx
    }

</script>

<g {transform} transform-origin="0.5 0.5">
{#each ptx as path}
    <polygon points={path.toString()} fill=none stroke=black stroke-width=0.0035 />
{/each}

<polygon points={ptx[0].toString()} fill=none stroke=black stroke-width=0.006 />

{#each ptx[0] as pnt}
<circle cx={pnt[0]} cy={pnt[1]} r=0.01 fill=#eee stroke=black stroke-width=0.005 />
{/each}

</g>
