<script>
    import { HsvPicker } from "svelte-color-picker";
    import { startProcessing } from './ColourChartGenerator'

	let canvasHeight = 800
	let canvasWidth = 600
	let lineThickness = 12
	let pollingRate = 2
	let displayStyles = ["radial", "circle", "lines"]
	let selectedDisplayStyle = "circle"
    let colourValues
    let backgroundColour 
	let selectedFile
	let fileName
	let computedColours

	const selectColour = (rgba) => {
        colourValues = JSON.stringify(rgba.detail, null, 2);
        backgroundColour = rgba.detail
    }

    function selectFile (event) {
		const file = this.files[0]
		fileName = file.name
        selectedFile = URL.createObjectURL(file)
    }

    const beginProcessing = async () => {
        computedColours = await startProcessing({
            canvasHeight,
            canvasWidth,
            pollingRate,
            lineThickness,
            backgroundColour,
            selectedFile,
            drawStyle: selectedDisplayStyle,
		})
		console.log({
			canvasHeight,
			canvasWidth,
			pollingRate,
			lineThickness,
			fileName,
            drawStyle: selectedDisplayStyle,
			computedColours
		})
    }

    const matchScreenResolution = () => {
        const resWidth = window.screen.width * window.devicePixelRatio
        const resHeight = window.screen.height * window.devicePixelRatio
        canvasWidth = resWidth
        canvasHeight = resHeight
    }
    

</script>

	<form on:submit|preventDefault={beginProcessing}>
		<fieldset>
		<legend>Step 1: Select Your Video 📼</legend>
		<p>The bigger the video, the longer this will take to process.</p>
		<div>
			<label>Select Video File</label>
			<input type="file" on:change={selectFile} />
		</div>
	</fieldset>

	<fieldset>
		<legend>Step 2: Configure Your Canvas 🖼</legend>

		<p>
			You could set the values of the canvas height and canvas width to match
			your device - press the 'Match Screen Resolution' button to
			automatically do that. The background colour will be visible if you have
			spaces between drawn lines.
		</p>
		<div>
			<label>Canvas Height (px)</label>
			<input type="number" bind:value={canvasHeight} />

			<label>Canvas width (px)</label>
			<input type="number" bind:value={canvasWidth} />

			<button type="button" on:click={matchScreenResolution}>Match Screen Resolution</button>
			<label>Background Colour</label>
			<div class="HsvPicker">
			<HsvPicker on:colorChange={selectColour} startColor={'#000000'} />
			</div>

		</div>
		</fieldset>

		<fieldset>
		<legend>Step 3: Configure Drawing Style 🎨</legend>
		<p>
			For more lines per second of video, increase the polling rate. For
			thicker lines, increase the line thickness. Longer videos might
			want a lower polling rate. Shorter videos might want a thinner line
		</p>
		<div>
			<label>Line Thickness</label>
			<input type="number" bind:value={lineThickness} />

			<label>Polling Rate</label>
			<input type="number" bind:value={pollingRate} />

			<label>Display Type</label>
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

		</fieldset>

		<fieldset>
		<legend>Step 4: Start Processing ⚙️</legend>
		<div>
			<button type="submit">Start Processing</button>
		</div>
		</fieldset>
	</form>

    <div>
        <video id="video" controls="true" crossorigin="anonymous" style="display:none;"/>
    </div>

    <div>
        <canvas id="frame-canvas" width="160" height="96" style="display:none;"></canvas>
    </div>

    <div>
        <canvas id="film-colours-canvas" width="600" height="800" style="display:none;"></canvas>
    </div>


<style>

	legend {
		color: #ff3e00;
		border: 1px solid lightgray;
		background-color: white;
		padding: 0.5em;
		font-size: 1.5em;
	}

	fieldset {
		margin: 3em 1em;
		background-color: #eeeeee;
		border: lightgray solid 1px;
	}

	fieldset > div {
		background-color: white;
		padding: 1em;
	}

	fieldset > p {
		background-color: white;
		padding: 1em;
	}

	form {
		text-align: left;
	}

	input {
		width: 100%;
	}

	input[type="radio"] {
		width: 1em;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	.HsvPicker {
		margin: 0.5em 0em;
	}

	@media (min-width: 640px) {
		main {
		max-width: none;
		}
	}
</style> 	
