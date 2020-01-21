const createTestCafe = require('testcafe');

let testcafe = null;
let runner = null;

createTestCafe('localhost', 1337, 1338)
    .then(tc => {
        testcafe = tc;
        runner = testcafe.createRunner();

        return runner
			.src([
                './tests/e2e/page-layout.test.js',
                './tests/e2e/generating-circles.test.js'
            ])
            .browsers(['chrome'])
            .reporter('list')
            .run();
    })
    .then(failedCount => {
        console.log('Tests failed: ' + failedCount);
        testcafe.close();
    })
