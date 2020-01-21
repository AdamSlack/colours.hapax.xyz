import { Selector } from 'testcafe'
import path from 'path'

const indexPage = `file://${path.join(__dirname + '../../../index.html')}`
const filePath = path.relative(process.cwd(), __dirname + '/../../assets/testVideo.mp4')
console.log(filePath)

fixture(`generating-circles`)
    .page(indexPage)

fixture.before( async (t) => {
    await t
        .setFilesToUpload('#video-selector', [filePath])
        .click('#startButton')
        .wait(5000)
    
})

test('Colour canvas should have been generated', (t) => {
    
})
