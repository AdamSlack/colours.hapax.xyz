const frameCanvas = document.getElementById('c1')
const coloursCanvas = document.getElementById('c2')

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

function computeColour(frameNum) {     
    const frameCtx = frameCanvas.getContext('2d')
    frameCtx.drawImage(video, 0, 0, 220, 150)

    const spacing = coloursCanvas.height/video.duration
    const coloursCtx = coloursCanvas.getContext('2d')

    const canvasFrame = frameCtx.getImageData(0,0,frameCanvas.width, frameCanvas.height)
    
    const data = canvasFrame.data;
    const rgb = getAverageColour(data)

    coloursCtx.beginPath();
    coloursCtx.lineWidth = 2;
    
    coloursCtx.moveTo(0, frameNum*spacing);
    coloursCtx.lineTo(coloursCanvas.width, frameNum*spacing);

    coloursCtx.strokeStyle = `rgb(${rgb.r},${rgb.g},${rgb.b})`
    coloursCtx.stroke();
}

function playSelectedFile(event) {
    var file = this.files[0]
    player.src = URL.createObjectURL(file)
}

document.getElementById('video-selector').onchange = playSelectedFile


const player = document.getElementById('video')

let frameNum = 0
video.addEventListener('loadeddata', function() {
    this.currentTime = frameNum
})

video.addEventListener('seeked', function() {
    computeColour(frameNum);
    frameNum += 1;

    if (frameNum <= this.duration) {
        this.currentTime = frameNum;
    }
});
