<script>
    import { link } from 'svelte-spa-router'
</script>
<section>
    <p>This site will let you generate colour charts from video files as well as browse charts produced by others.</p>
    <p>Oh, and it doesn't really work on mobile, especially not iOS. I'd quite like to fix that at somepoint though.</p>
</section>
<section>
    <a href="/ColourChartGenerator" use:link>Create Colour Chart</a>
    <a href="/ColourCharts" use:link>View Colour Charts</a>
</section>
<div class="footer">
		<a href="https://github.com/AdamSlack/video-colour-slices/" target="_blank">
			<img src="https://octodex.github.com/images/constructocat2.jpg" alt="octocat">
		</a>
		<a href="https://github.com/AdamSlack/video-colour-slices/" target="_blank">
			View On GitHub
		</a>
	</div>

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

    @media (min-width: 640px) {
		main {
			max-width: none;
		}
		.footer {
            padding: 1em;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			position: fixed;
			left: 0;
			bottom: 0;
			width: 100%;
			color: white;
		}

		.footer a {
			vertical-align: middle;
		}
	}
	.footer img {
		width: 3em;
	}
</style>
