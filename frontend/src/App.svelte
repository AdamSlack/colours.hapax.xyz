<script>
	import Router, { link } from 'svelte-spa-router'
	import ColourChartGenerator from './routes/ColourChartGenerator/ColourChartGenerator.svelte'
	import ColourCharts from './routes/ColourCharts/ColourCharts.svelte'
	import Home from './routes/Home/Home.svelte'

	const routes = {
		'/': Home,
		'/ColourChartGenerator': ColourChartGenerator,
		'/ColourCharts': ColourCharts
	}
</script>

<main>
	<h1><a href="/" use:link>🎨 Colour Charts 🖼</a></h1>
	<Router {routes}/>
</main>


<style>
	main {
		text-align: center;
		margin: 0 auto;
	}
	h1 {
		padding: 1em;
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	h1 a {
		text-decoration: none;
		color: #ff3e00;
	}

	@media (min-width: 640px) {
		main {
		max-width: none;
		}
	}
</style> 	
