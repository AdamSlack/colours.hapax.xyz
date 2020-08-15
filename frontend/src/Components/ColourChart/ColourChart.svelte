<script>
    import { onMount } from "svelte"

    export let colourChart
    export let displayStyle
    let canvas
    let ctx

    const drawLine = (lineWidth, xStart, yStart, xEnd, yEnd, colour) => {
        ctx.beginPath();
        ctx.lineWidth = lineWidth

        ctx.moveTo(xStart, yStart)
        ctx.lineTo(xEnd, yEnd);

        ctx.strokeStyle = `rgb(${colour.r},${colour.g},${colour.b})`
        ctx.stroke();
    }

    function drawCircle(lineWidth, radius, colour) {
        ctx.beginPath();

        ctx.lineWidth = lineWidth
        ctx.arc(0, 0, radius, 0, 2 * Math.PI);

        ctx.strokeStyle = `rgb(${colour.r},${colour.g},${colour.b})`
        ctx.stroke();
    }


    const fillCanvas = (colour) => {
        ctx.fillStyle = `rgb(0,0,0)`
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } 

    const drawColourChart = () => {
        ctx = canvas.getContext('2d')
        fillCanvas()
        const thickness = canvas.height / colourChart.computedColours.length
        const radius = Math.sqrt(Math.pow(canvas.height, 2) + Math.pow(canvas.width,2)) / colourChart.computedColours.length

        colourChart.computedColours.forEach((colour, idx) => {
            if(displayStyle === 'lines') drawLine(thickness, 0, thickness*idx, canvas.width, thickness*idx, colour)
            if(displayStyle === 'circle') drawCircle(thickness, idx*radius, colour)
        })
    }

    $: {
        displayStyle
        if(ctx) {
            drawColourChart()
        }
    }

    onMount(() => {
        drawColourChart()
    })

</script>

<div class="colour-chart">
    <canvas bind:this={canvas} height="500" width="300"></canvas>
    <h3>{colourChart.displayName || colourChart.fileName}</h3>
</div>


<style>
    div.colour-chart {
        width: 25em;
        padding: 1em;
        background: white;
        word-break: break-all;
        border: 0.1em solid black
    }
</style>
