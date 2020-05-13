<script>
    import { link } from 'svelte-spa-router'
</script>
<section>
    <p>This site will let you generate colour charts from video files as well as browse charts produced by others.</p>
</section>
<section>
    <a href="/ColourChartGenerator" use:link>Create Colour Chart</a>
    <a href="/ColourCharts" use:link>View Colour Charts</a>
</section>

<style>
    section > a {
        display: inline-block;
        padding: 5em;
        margin: 1em;
        background: white;
        border: solid 1px #ff3e00;
        color: black;
		text-decoration: none;
    }
    section > a:hover {
        background: #d7937d;
        cursor: pointer;
		text-decoration: none;
    }
</style>
