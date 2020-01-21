const captureWebsite = require('capture-website');

(async () => {
	await captureWebsite.file('index.html', 'ui-screenshot.png', {
    width: 500,
    height: 10, // this needs to be set to auto scroll with 'fullPage'
    fullPage: true,
    overwrite: true,
  });
})();
