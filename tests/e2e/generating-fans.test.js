import { ClientFunction } from 'testcafe'
import path from 'path'

import { expectedCanvas } from './test-data'

const indexPage = `file://${path.join(__dirname + '../../../index.html')}`
const filePath = path.join(__dirname + '/../assets/testVideo.mp4')
console.log(filePath)

fixture(`generating-fans`)
    .page(indexPage)

const getCanvaseBase64 = ClientFunction(() => document.getElementById('film-colours-canvas').toDataURL())

test('Colour canvas should have been generated', async (t) => {
    await t.setFilesToUpload('#video-selector', [filePath])
        .click('input[value=fan]')
        .click('#startButton')
        .wait(2000)

    const canvasBase64 = await getCanvaseBase64()
    await t.expect(canvasBase64).eql(expectedCanvas.fansBase64)
    
})
