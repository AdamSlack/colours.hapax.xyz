<script>
    import { onMount } from "svelte"
    import ColourChart from '../../Components/ColourChart/ColourChart.svelte'
    
    let colourCharts = []
    let nextPage
	let displayStyles = ["circle", "lines"]
    let selectedDisplayStyle = "circle"


    const fetchNextPage = async () => {
        const url = new URL('https://api.film-colours.hapax.xyz/charts')
        const params = new URLSearchParams({
            LastEvaluatedKey: nextPage
        })
        url.search = params.toString()
        await fetch(url)
        .then(r => r.json())
        .then(data => {
            nextPage = data.colourCharts.LastEvaluatedKey
            console.log(nextPage)
            colourCharts = colourCharts.concat(data.colourCharts.Items)
        });
    }

    onMount(async () => {
        await fetchNextPage()
    })
</script>

<div>
    <h2>🚧 In Progress 🚧</h2>
    <p>Still messing about with this page, there might be something you care about here though.</p>
    
    <h3>Display Type</h3>
    <div class="style-input">
    {#each displayStyles as displayStyle}
    <label>
        <input
        type="radio"
        bind:group={selectedDisplayStyle}
        value={displayStyle} />
        {displayStyle}
    </label>
    {/each}
    </div>
    
    <h2>Previously Generated</h2>
    <div class='chart-collection'>
        {#each colourCharts as colourChart }
            <div class='chart-container'>
                <ColourChart colourChart={colourChart} displayStyle={selectedDisplayStyle}/>
            </div>
        {/each}
    </div>
</div>

<style>
    div.style-input {
        display: flex;
        margin: 1em;
        justify-content: center;
    }
    div.style-input input {
        margin-left: 1.5em;
    }
    
    div.colour-chart {
        background: lightgray;
        margin: 1em;
        padding:1em;
    }

    div.chart-collection {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }

    div.chart-container {
        padding: 1em;
        margin: 2em;
    }

</style>
