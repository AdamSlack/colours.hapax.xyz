<script>
    import { onMount } from "svelte"
    import SvelteInfiniteScroll from "svelte-infinite-scroll";

    import ColourChart from '../../Components/ColourChart/ColourChart.svelte'

    let colourCharts = []
    let nextPage
	let displayStyles = ["circle", "lines"]
    let selectedDisplayStyle = "circle"


    const fetchNextPage = async () => {
        const url = new URL('https://api.film-colours.hapax.xyz/charts')
        if(nextPage) {
            const params = new URLSearchParams({
                colourChartId: nextPage.colourChartId,
                createdEpoch: nextPage.createdEpoch,
            })
            url.search = params.toString()
        }
        await fetch(url)
        .then(r => r.json())
        .then(data => {
            nextPage = data.colourCharts.LastEvaluatedKey
            colourCharts = colourCharts.concat(data.colourCharts.Items)
        });
    }

    onMount(async () => {
        await fetchNextPage()
    })
</script>

<div>
    <h2>Recently Generated</h2>
    <p>🚧 This page is still being fleshed out a little, you can see charts that have been made recently, but it's largely useless. 🚧</p>
    <p>When i get round to it imma make it so you can click on one and pick a resolution for it. Then you can save it, print it out, make it a desktop background, or whatever floats your boat.</p>
    
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
    
    <h2>Recently Generated</h2>
    <div class='chart-collection'>
        {#each colourCharts as colourChart }
            <div class='chart-container'>
                <ColourChart colourChart={colourChart} displayStyle={selectedDisplayStyle}/>
            </div>
        {/each}
        <SvelteInfiniteScroll window={true} on:loadMore={fetchNextPage} hasMore={!!nextPage} />
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
