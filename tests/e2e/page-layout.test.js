import { Selector } from 'testcafe'
import path from 'path'

const indexPage = `file://${path.join(__dirname + '../../../index.html')}`

fixture(`page-layout`)
    .page(indexPage)

test('Page has file selector', async (t) => {
    await t.expect(Selector('input[type=file]').id).eql('video-selector')
})

test('Page has a start button', async (t) => {
    await t.expect(Selector('#startButton')).ok()
})

