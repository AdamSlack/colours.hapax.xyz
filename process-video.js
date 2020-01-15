
const player = document.getElementById('video')


const frameCanvas = document.getElementById('frame-canvas')
const frameCtx = frameCanvas.getContext('2d')

const coloursCanvas = document.getElementById('film-colours-canvas')
const coloursCtx = coloursCanvas.getContext('2d')

let currentFrameNumber = 0 // filthy tracking of where in the the video the player has seeked to.

let drawStyle = 'lines'

function getDrawStyle () {
    const radios = document.getElementsByName('drawStyle')
    drawStyle = Array.from(radios).find((radio) => radio.checked).value
}

function getAverageColour (dataFrame) {
    const length = dataFrame.length;
    const rgb = {r:0, g:0, b:0}
    
    let pixelCount = 0
    let pixelIndex = 0

    while (pixelIndex < length) {
        // dataframe is a 1-d array in order of [r, g, b, a, ..., r, g, b, a, ...]
        rgb.r += dataFrame[pixelIndex];
        rgb.g += dataFrame[pixelIndex+1];
        rgb.b += dataFrame[pixelIndex+2];
        
        pixelCount++
        pixelIndex += 4 // next pixels values are +4 ahead
    }
    
    rgb.r = Math.floor(rgb.r/pixelCount);
    rgb.g = Math.floor(rgb.g/pixelCount);
    rgb.b = Math.floor(rgb.b/pixelCount);
    return rgb
}

function drawLine(ctx, lineWidth, xStart, yStart, xEnd, yEnd, colour) {
    ctx.beginPath();
    ctx.lineWidth = lineWidth

    ctx.moveTo(xStart, yStart)
    ctx.lineTo(xEnd, yEnd);

    ctx.strokeStyle = `rgb(${colour.r},${colour.g},${colour.b})`
    ctx.stroke();
}

// function drawFunky(ctx, lineWidth, xStart, yStart, xEnd, yEnd, colour) {
//     ctx.beginPath();
//     ctx.lineWidth = lineWidth

//     ctx.moveTo(xStart, yStart)
//     ctx.lineTo(xStart + 40, yStart)
//     ctx.lineTo(xStart + 50, yStart + 20)
//     ctx.lineTo(xStart + 60, yStart - 20)
//     ctx.lineTo(xStart + 70, yStart)
//     ctx.lineTo(xStart + 510, yStart)
//     ctx.lineTo(xStart + 520, yStart-20)
//     ctx.lineTo(xStart + 530, yStart+20)
//     ctx.lineTo(xStart + 540, yStart)

//     ctx.lineTo(xEnd, yEnd);

//     ctx.strokeStyle = `rgb(${colour.r},${colour.g},${colour.b})`
//     ctx.stroke();
// }

function drawCircle(ctx, lineWidth, radius, colour) {
    ctx.beginPath();
    
    ctx.lineWidth = lineWidth
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    
    ctx.strokeStyle = `rgb(${colour.r},${colour.g},${colour.b})`
    ctx.stroke();
}

function computeColour(frameNumber) {     

    const spacing = coloursCanvas.height/player.duration
    const radius = Math.sqrt(Math.pow(coloursCanvas.height, 2) + Math.pow(coloursCanvas.width,2))/player.duration
    const { data: canvasFrameData } = frameCtx.getImageData(0,0,frameCanvas.width, frameCanvas.height)
    
    const rgb = getAverageColour(canvasFrameData)

    const lineWidth = Math.ceil(coloursCanvas.height / player.duration) + 2
    
    if (drawStyle === 'lines') drawLine(coloursCtx, lineWidth, 0, frameNumber*spacing, coloursCanvas.width, frameNumber*spacing, rgb)
    if (drawStyle === 'circle') drawCircle(coloursCtx, lineWidth, frameNumber*radius, rgb)
    // if (drawStyle === 'funky') drawFunky(coloursCtx, lineWidth, 0, frameNumber*spacing, coloursCanvas.width, frameNumber*spacing, rgb)
}

function drawPlayerToCanvas () {
    frameCtx.drawImage(player, 0, 0, 220, 150)
}

function initialiseProcessing () {
    setCanvasHeight()
    setCanvasWidth()
    getDrawStyle()
    coloursCanvas.style.display = 'block';

    coloursCtx.fillStyle = "black";
    coloursCtx.fillRect(0, 0, coloursCanvas.width, coloursCanvas.height);
    
    currentFrameNumber = 0
    player.currentTime = currentFrameNumber
}

function seekVideo(increment) {
    currentFrameNumber += increment;
    if (currentFrameNumber <= player.duration) {
        player.currentTime = currentFrameNumber;
    }
}

function processVideo () {
        drawPlayerToCanvas()
        computeColour(currentFrameNumber);
        seekVideo(2)
}

function playSelectedFile(event) {
    var file = this.files[0]
    player.src = URL.createObjectURL(file)
}

document.getElementById('video-selector').onchange = playSelectedFile
player.addEventListener('loadeddata', initialiseProcessing)
player.addEventListener('seeked', processVideo)


function setCanvasHeight () {
    const height = document.getElementById('canvasHeight').value
    coloursCanvas.height = height
}

function setCanvasWidth () {
    const width = document.getElementById('canvasWidth').value
    coloursCanvas.width = width
}
