<script>
    // firefox bug: https://bugzilla.mozilla.org/show_bug.cgi?id=1685631

    import {tweened} from "svelte/motion"

    export let xt = "0, 0"
    export let xs = "1"

    export let parameter = 0

    let vec1 = {x: 0, y: 0}
    let vec2 = {x: 1, y: 0}

    const tw_opacity = tweened(0, {duration: 100})
    const tw_radius  = tweened(100, {duration: 100})

    function len(v) {
        return Math.sqrt(v.x**2 + v.y**2)
    }

    function angle(v1, v2) {
        let dot = v1.x * v2.x + v1.y * v2.y
        let det = v1.x * v2.y - v1.y * v2.x
        return Math.atan2(det, dot)
    }

    function normalize(v, scale = 1) {
        let l = len(v)
        return {x: (v.x / l) * scale, y: (v.y / l) * scale}
    }

    function pointmap(event) {
        let p0 = event.target.viewportElement.createSVGPoint()
        //p0 = Object.assign(p0, {x: event.offsetX, y: event.offsetY}).matrixTransform(event.target.getCTM().inverse())
        p0 = Object.assign(p0, {x: event.pageX, y: event.pageY}).matrixTransform(event.target.getScreenCTM().inverse())
        return {x: p0.x, y: p0.y}
    }

    function arc(a, b, rad, lf, sf) {
        let deg   = Math.PI / 180
        let start = `M ${Math.cos(a*deg) * rad} ${Math.sin(a*deg) * rad} `
        let body  = `A ${rad} ${rad} 0 ${lf} ${sf} `
        let end   = `${Math.cos(b*deg) * rad} ${Math.sin(b*deg) * rad}`
        return start + body + end
    }

    async function pointerDown(event) {
        vec1 = normalize(pointmap(event))
        event.target.setPointerCapture(event.pointerId)
        tw_opacity.set(1)
        tw_radius.set(120)
    }

    async function pointerMove(event) {
        if (event.buttons == 1) {
            vec2 = normalize(pointmap(event))
            let base = parameter + (angle(vec1, vec2) / Math.PI)
            parameter = Math.max(Math.min(base, 1), 0)
            vec1 = vec2
        }
    }

    async function pointerUp(event) {
        event.target.releasePointerCapture(event.pointerId)
        tw_opacity.set(0)
        tw_radius.set(100)
    }

</script>
<g transform={`translate(${xt})`}>
<g transform={`scale(${xs})`}>
<g id="grip" transform={`rotate(${parameter * 180})`}>
    <path d={arc(-60, 60, 100, 0, 1)} stroke=black stroke-width=1 fill=none stroke-dasharray="1"/>
    <path d={arc(-60, 60, $tw_radius, 0, 1)} stroke=black stroke-width=0.5 stroke-dasharray="1 4" fill=none stroke-opacity={$tw_opacity}/>
    <line x1=100 y1=0 x2=120 y2=0 stroke=black stroke-width=1 fill=none/>
</g>
<use href="#grip" transform="rotate(180)"/>
<circle cx=0 cy=0 r=100 fill=none stroke=transparent stroke-width=40 on:pointerdown={pointerDown} on:mousemove={pointerMove} on:pointerup={pointerUp}/>
</g>
</g>
