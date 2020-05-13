<script>
	import { HsvPicker } from 'svelte-color-picker' 
	let selectedFile;
	let canvasHeight = 800;
	let canvasWidth = 800;
	let lineThickness = 10;
	let pollingRate = 10;

	let displayStyles = [
		'radial',
		'circle',
		'lines'
	]
	let selectedDisplayStyle = 'radial'

	let colourValues;
	function selectColour(rgba) {
		colourValues = JSON.stringify(rgba.detail, null, 2);
	}
</script>

<main>
	<h1>Colour Charts</h1>
	<p>{name}</p>
	<form on:submit|preventDefault={()=> console.log('Form Submitted') }>
		<fieldset>
			<legend>Step 1: Select Your Video</legend>
			<label>Select Video File</label>
			<input type="file" bind:value={selectedFile}>
		</fieldset>

		<fieldset>
			<legend>Step 2: Configure Your Canvas</legend>
			<label>Canvas Height (px)</label>
			<input type="number" bind:value={canvasHeight}>

			<label>Canvas width (px)</label>
			<input type="number" bind:value={canvasWidth}>

			
			<label>Background Colour</label>			
			<div class="HsvPicker">
				<HsvPicker on:colorChange={selectColour} startColor={"#ffffff"}/>
			</div>
			

		</fieldset>

		<fieldset>
			<legend>Step 3: Configure Drawing Style</legend>
			<label>Line Thickness</label>
			<input type="number" bind:value={lineThickness}>

			<label>Polling Rate</label>
			<input type="number" bind:value={pollingRate}>

			<label>Display Type</label>
			{#each displayStyles as displayStyle}
				<label>
					<input type=radio bind:group={selectedDisplayStyle} value={displayStyle}>
						{displayStyle}
				</label>
			{/each}

			
		</fieldset>

		<fieldset>
		<legend>Step 4: Start Processing</legend>
		<button type="submit">Start Processing</button>
		</fieldset>
	</form>

	<section>
		<h2>Configuration</h2>
		<p>{selectedFile || "No file Selected"}</p>
			<p>Width: {canvasWidth || 0} Height: {canvasHeight || 0}</p>
			<p>Selected Colour Values: {colourValues || ''}</p>
			<p>Line Thickness: {lineThickness || 0}</p>
			<p>Polling Rate: {pollingRate || 0}</p>
			<p>Display Style: { selectedDisplayStyle || 'No Style Selected'}</p>
	</section>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	legend {
		color: #ff3e00;
		border: 1px solid lightgray;
		padding: 0.5em;
	}

	fieldset {
		margin: 2em 0.5em;
	}

	form {
		text-align: left;
	}

	input {
		width: 100%;		
	}

	input[type=radio] {
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
