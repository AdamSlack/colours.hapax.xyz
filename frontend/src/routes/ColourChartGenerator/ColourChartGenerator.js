
let player
let frameCanvas
let frameCtx
let coloursCanvas
let coloursCtx

let currentFrameNumber = 0 // filthy tracking of where in the the video the player has seeked to.

let DRAW_STYLE = 'lines'

let radius
let spacing
let angleSpacing
let computedColours

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
    ctx.lineTo(Math.sin(angle) * segmentLength , - Math.cos(angle) * segmentLength)
    ctx.lineTo(Math.sin(nextAngle) * segmentLength, - Math.cos(nextAngle) * segmentLength)
    ctx.fill()
    ctx.stroke()
}

const computeColour = (frameNumber, lineWidth) => {
    const { data: canvasFrameData } = frameCtx.getImageData(0,0,frameCanvas.width, frameCanvas.height)

    const rgb = getAverageColour(canvasFrameData)
    computedColours.push(rgb)
    if (DRAW_STYLE === 'lines') drawLine(coloursCtx, lineWidth, 0, frameNumber*spacing, coloursCanvas.width, frameNumber*spacing, rgb)
    if (DRAW_STYLE === 'circle') drawCircle(coloursCtx, lineWidth, frameNumber*radius, rgb)
    if (DRAW_STYLE === 'radial') drawFanSegment(coloursCtx, lineWidth, frameNumber, rgb)
}

function drawPlayerToCanvas () {
    frameCtx.drawImage(player, 0, 0, 220, 150)
}

function setDrawStyle({drawStyle}) {
    DRAW_STYLE = drawStyle
}

export const startProcessing = (params) => {
    return new Promise((resolve) => {
        const resolver = () => resolve(computedColours)
        player = document.getElementById('video')
        player.addEventListener('loadeddata', () => {
            player.addEventListener('seeked', () => processVideo(resolve))
            
            frameCanvas = document.getElementById('frame-canvas')
            frameCtx = frameCanvas.getContext('2d')
            coloursCanvas = document.getElementById('film-colours-canvas')
            coloursCtx = coloursCanvas.getContext('2d')
            
            computedColours = []
            setCanvasHeight(params)
            setCanvasWidth(params)
            setPollingRate(params)
            setLineWidth(params)
            setDrawStyle(params)
            coloursCanvas.style.display = 'block';
            
            angleSpacing = (Math.PI * 2) / player.duration
            spacing = coloursCanvas.height/player.duration
            radius = Math.sqrt(Math.pow(coloursCanvas.height, 2) + Math.pow(coloursCanvas.width,2))/player.duration
            
            coloursCtx.fillStyle = getBackgroundColour(params.backgroundColour);
            coloursCtx.fillRect(0, 0, coloursCanvas.width, coloursCanvas.height);
            
            if (DRAW_STYLE === 'radial') coloursCtx.translate(coloursCanvas.width / 2, coloursCanvas.height / 2);
            
            currentFrameNumber = 0
            player.currentTime = currentFrameNumber
        
            processVideo(resolver)
        })
        player.src = params.selectedFile
    })
}

const seekVideo = (increment, resolve) => {
    currentFrameNumber += increment;
    if (currentFrameNumber <= player.duration) {
        player.currentTime = currentFrameNumber;
    }
    else {
        resolve(computedColours)
    }
}

let LINE_WIDTH = 12
let POLLING_RATE = 2
export const processVideo = (resolve) => {
    drawPlayerToCanvas()
    computeColour(currentFrameNumber, LINE_WIDTH);
    seekVideo(POLLING_RATE, resolve)
}

function setCanvasHeight ({canvasHeight}) {
    const height = canvasHeight // document.getElementById('canvasHeight').value
    coloursCanvas.height = height
}

function setCanvasWidth ({canvasWidth}) {
    const width = canvasWidth//document.getElementById('canvasWidth').value
    coloursCanvas.width = width
}

function getBackgroundColour ({r, g, b}) {
    return `rgb(${r}, ${g}, ${b})`
}

function setPollingRate ({pollingRate}) {
    POLLING_RATE = pollingRate // parseFloat(document.getElementById('pollingRate').value, 10)
}

function setLineWidth ({lineThickness}) {
    LINE_WIDTH = lineThickness // parseFloat(document.getElementById('lineWidth').value, 10)
}
