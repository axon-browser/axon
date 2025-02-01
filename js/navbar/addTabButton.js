var browserUI = require('browserUI.js')

var addTabButton = document.getElementById('add-tab-button')

function initialize () {
  addTabButton.addEventListener('click', function (e) {
    browserUI.addTab(tabs.add(), { isAddNewTabButton: true })
  })
}

module.exports = { initialize }
