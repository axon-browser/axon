var webviews = require('../webviews.js')


function initialize () {
  
  const goBackButton = document.getElementById('go-back-button');
  const goForwardButton = document.getElementById('go-forward-button');
  const reloadButton = document.getElementById('reload-icon');
  const stopReloadButton = document.getElementById('stop-reload-icon');

  goBackButton.addEventListener('click', async function (e) {
    webviews.goBackIgnoringRedirects(tabs.getSelected()).then(()=>{
      webviews.updateNavigationButtons()
    });
  });

  goForwardButton.addEventListener('click', async function (e) {
    webviews.callAsync(tabs.getSelected(), 'goForward',()=>{
      webviews.updateNavigationButtons()
    });
  });

  reloadButton.addEventListener('click', async function (e) {
    webviews.callAsync(tabs.getSelected(), 'reload',()=>{
      webviews.updateReloadButton()
    });
  });
  stopReloadButton.addEventListener('click', async function (e) {
    webviews.callAsync(tabs.getSelected(), 'stop',()=>{
      webviews.updateReloadButton()
    });
  });
}




module.exports = { initialize }
