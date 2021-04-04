<script>

import {closest_u, bezier} from "../../codebase"

let ox = 0
let oy = 0

let cc = [[0, 0], [0, 1], [1, 1], [1, 0]]
$: cu = closest_u(cc, [ox, oy], 10)
$: pt = bezier(cc, cu)


async function on_move(event) {
    ox = event.offsetX / 300
    oy = event.offsetY / 300
}

</script>

<svg width=300 height=300 viewBox="0 0 1 1" on:mousemove={on_move} style="margin-left:50px; margin-top:50px">
<path fill=none stroke=black d="M 0,0 C 0,1 1,1 1,0 " stroke-width=0.003/>
<circle cx={pt[0]} cy={pt[1]} r=0.01 fill=black stroke=none/>
</svg>
{ox}:{oy}
