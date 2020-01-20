
const player = document.getElementById('video')


const frameCanvas = document.getElementById('frame-canvas')
const frameCtx = frameCanvas.getContext('2d')

const coloursCanvas = document.getElementById('film-colours-canvas')
const coloursCtx = coloursCanvas.getContext('2d')

let currentFrameNumber = 0 // filthy tracking of where in the the video the player has seeked to.

let drawStyle = 'lines'

let radius
let spacing
let angleSpacing

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

function drawCircle(ctx, lineWidth, radius, colour) {
    ctx.beginPath();

    ctx.lineWidth = lineWidth
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);

    ctx.strokeStyle = `rgb(${colour.r},${colour.g},${colour.b})`
    ctx.stroke();
}

const drawFanSegment = (ctx, lineWidth, frameNumber, colour) => {
    const angle = frameNumber * angleSpacing
    const nextAngle = (frameNumber + POLLING_RATE) * angleSpacing
    const segmentLength = Math.max(coloursCanvas.height, coloursCanvas.width)

    ctx.fillStyle = `rgb(${colour.r},${colour.g},${colour.b})`
    ctx.strokeStyle = `rgb(${colour.r},${colour.g},${colour.b})`
    ctx.lineWidth = lineWidth
    ctx.beginPath()
    ctx.moveTo(0, 0)
    console.log(Math.sin(angle) * segmentLength , - Math.cos(angle) * segmentLength)
    ctx.lineTo(Math.sin(angle) * segmentLength , - Math.cos(angle) * segmentLength)
    ctx.lineTo(Math.sin(nextAngle) * segmentLength, - Math.cos(nextAngle) * segmentLength)
    ctx.fill()
    ctx.stroke()
}

const computeColour = (frameNumber, lineWidth) => {
    const { data: canvasFrameData } = frameCtx.getImageData(0,0,frameCanvas.width, frameCanvas.height)

    const rgb = getAverageColour(canvasFrameData)

    if (drawStyle === 'lines') drawLine(coloursCtx, lineWidth, 0, frameNumber*spacing, coloursCanvas.width, frameNumber*spacing, rgb)
    if (drawStyle === 'circle') drawCircle(coloursCtx, lineWidth, frameNumber*radius, rgb)
    if (drawStyle === 'fan') drawFanSegment(coloursCtx, lineWidth, frameNumber, rgb)
}

function drawPlayerToCanvas () {
    frameCtx.drawImage(player, 0, 0, 220, 150)
}

function initialiseProcessing () {
    setCanvasHeight()
    setCanvasWidth()
    setPollingRate()
    setLineWidth()
    getDrawStyle()
    coloursCanvas.style.display = 'block';

    angleSpacing = (Math.PI * 2) / player.duration
    spacing = coloursCanvas.height/player.duration
    radius = Math.sqrt(Math.pow(coloursCanvas.height, 2) + Math.pow(coloursCanvas.width,2))/player.duration

    coloursCtx.fillStyle = getBackgroundColour();
    coloursCtx.fillRect(0, 0, coloursCanvas.width, coloursCanvas.height);

    if (drawStyle === 'fan') coloursCtx.translate(coloursCanvas.width / 2, coloursCanvas.height / 2);

    currentFrameNumber = 0
    player.currentTime = currentFrameNumber
}

function setStartTrigger () {
    document.getElementById('startButton').addEventListener('click', initialiseProcessing)
}

function seekVideo(increment) {
    currentFrameNumber += increment;
    if (currentFrameNumber <= player.duration) {
        player.currentTime = currentFrameNumber;
    }
}

let LINE_WIDTH = 12
let POLLING_RATE = 2
const processVideo = () => {
    drawPlayerToCanvas()
    computeColour(currentFrameNumber, LINE_WIDTH);
    seekVideo(POLLING_RATE)
}

function playSelectedFile(event) {
    var file = this.files[0]
    player.src = URL.createObjectURL(file)
}

document.getElementById('video-selector').onchange = playSelectedFile
player.addEventListener('loadeddata', setStartTrigger)
player.addEventListener('seeked', processVideo)

document.getElementById('screen-resolution').onclick = () => {
    const resWidth = window.screen.width * window.devicePixelRatio
    const resHeight = window.screen.height * window.devicePixelRatio
    document.getElementById('canvasWidth').value = resWidth
    document.getElementById('canvasHeight').value = resHeight
}


function setCanvasHeight () {
    const height = document.getElementById('canvasHeight').value
    coloursCanvas.height = height
}

function setCanvasWidth () {
    const width = document.getElementById('canvasWidth').value
    coloursCanvas.width = width
}

function getBackgroundColour () {
    const red = document.getElementById('bgRed').value
    const green = document.getElementById('bgGreen').value
    const blue = document.getElementById('bgBlue').value
    return `rgb(${red}, ${green}, ${blue})`
}

function setPollingRate () {
    POLLING_RATE = parseInt(document.getElementById('pollingRate').value, 10)
}

function setLineWidth () {
    LINE_WIDTH = parseInt(document.getElementById('lineWidth').value, 10)
}
