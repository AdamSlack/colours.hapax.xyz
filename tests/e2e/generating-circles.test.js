import { ClientFunction, Selector } from 'testcafe'
import path from 'path'

import { expectedCanvas } from './test-data'

const indexPage = `file://${path.join(__dirname + '../../../index.html')}`
const filePath = path.join(__dirname + '/../assets/testVideo.mp4')
console.log(filePath)

fixture(`generating-circles`)
    .page(indexPage)

const getCanvaseBase64 = ClientFunction(() => document.getElementById('film-colours-canvas').toDataURL())

test('Colour canvas should have been generated', async (t) => {
    const fileSel = Selector('#video-selector')
    const startButtonSel = Selector('#startButton')
    const widthInputSel = Selector('#canvasWidth')
    const heightInputSel = Selector('#canvasHeight')

    await t
        .expect(fileSel.exists).ok()
        .setFilesToUpload(fileSel, [filePath])
        .expect(fileSel.value).contains('testVideo.mp4')

        .selectText(widthInputSel)
        .pressKey('delete')
        .typeText(widthInputSel, '50')

        .selectText(heightInputSel)
        .pressKey('delete')
        .typeText(heightInputSel, '50')
        
        .click(startButtonSel)
        .wait(2000)

    const canvasBase64 = await getCanvaseBase64()
    await t.expect(canvasBase64).eql(expectedCanvas.circlesBase64)
    
})
