const frameCanvas = document.getElementById('c1')
const coloursCanvas = document.getElementById('c2')
let drawStyle = 'lines'

function getDrawStyle () {
    const radios = document.getElementsByName('drawStyle')
    drawStyle = Array.from(radios).find((radio) => radio.checked).value
}

function getAverageColour (data) {
    const length = data.length;
    const rgb = {r:0, g:0, b:0}
    
    let pixelCount = 0
    let pixelIndex = 0

    while (pixelIndex < length) {
        rgb.r += data[pixelIndex];
        rgb.g += data[pixelIndex+1];
        rgb.b += data[pixelIndex+2];
        
        pixelCount++
        pixelIndex+=4;
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

function computeColour(frameNum) {     
    const frameCtx = frameCanvas.getContext('2d')
    frameCtx.drawImage(video, 0, 0, 220, 150)

    const spacing = coloursCanvas.height/video.duration
    const coloursCtx = coloursCanvas.getContext('2d')

    const canvasFrame = frameCtx.getImageData(0,0,frameCanvas.width, frameCanvas.height)
    
    const data = canvasFrame.data;
    const rgb = getAverageColour(data)

    const lineWidth = Math.ceil(coloursCanvas.height / video.duration) + 2
    
    if (drawStyle === 'lines') drawLine(coloursCtx, lineWidth, 0, frameNum*spacing, coloursCanvas.width, frameNum*spacing, rgb)
    if (drawStyle === 'circle') drawCircle(coloursCtx, lineWidth, frameNum*spacing, rgb)
}

function playSelectedFile(event) {
    var file = this.files[0]
    player.src = URL.createObjectURL(file)
}

document.getElementById('video-selector').onchange = playSelectedFile


const player = document.getElementById('video')

let frameNum = 0
video.addEventListener('loadeddata', function() {
    getDrawStyle()
    coloursCanvas.style.display = 'block';
    const coloursCtx = coloursCanvas.getContext('2d')
    coloursCtx.fillStyle = "black";
    coloursCtx.fillRect(0, 0, coloursCanvas.width, coloursCanvas.height);
    
    frameNum = 0
    this.currentTime = frameNum
})

video.addEventListener('seeked', function() {
    computeColour(frameNum);
    frameNum += 2;

    if (frameNum <= this.duration) {
        this.currentTime = frameNum;
    }
});
