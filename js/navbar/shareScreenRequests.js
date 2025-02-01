const { ipcRenderer } = require('electron');
const webviews = require('webviews.js');

const shareScreenRequests = {
  tabsData: [
    {
      id: 'window',
      label: 'Window',
      filter: 'Entire screen'
    },
    {
      id: 'screen',
      label: 'Entire Screen',
      filter: 'Entire screen'
    }
  ],
  selectedSourceId: null,
  createScreenShareModal: function (sources) {
    const screenShareDialog = document.getElementById('screen-share-dialog');
    const shareCancelBtn = document.querySelector('.share-cancel-button');
    const shareBtn = document.querySelector('.share-button');
    shareBtn.disabled = true;

    shareCancelBtn.onclick = () => {
     ipcRenderer.send('source-modal-closed', shareScreenRequests.selectedSourceId);
      screenShareDialog.hidden = true;
      webviews.hidePlaceholder('screenShareMode')
    };

    shareBtn.onclick = () => {
       ipcRenderer.send('source-selected', shareScreenRequests.selectedSourceId);
       screenShareDialog.hidden = true;
       webviews.hidePlaceholder('screenShareMode')
   };

    const modal = document.querySelector('.screen-box');
    // Generate tab container
    const tabContainer = document.createElement('div');
    tabContainer.className = 'tab-container';

    // Generate tab content container
    const tabContent = document.createElement('div');
    tabContent.className = 'tab-content';

    // Generate both tabs and panels
    shareScreenRequests.tabsData.forEach((tab, index) => {
      // Create tab button
      const tabButton = document.createElement('div');
      tabButton.className = `tab ${index === 0 ? 'active' : ''}`;
      tabButton.textContent = tab.label;
      tabButton.onclick = () => shareScreenRequests.switchModalTab(index);
      tabContainer.appendChild(tabButton);
      
      // Create tab panel
      const tabPanel = document.createElement('div');
      tabPanel.className = `tab-panel ${index === 0 ? 'active' : ''}`;
      
      // Create grid for items
      const grid = document.createElement('div');
      grid.className = 'content-grid';
      
      // Generate items for this tab
      sources.forEach((source, index) => {
        const item = document.createElement('div');
        item.className = 'source-item';
        item.innerHTML = `
          <img src="${source.thumbnail.toDataURL()}" />
          <p>${source.name}</p>
        `;
        item.onclick = () => {
          document.querySelectorAll('.source-item').forEach(i => 
            i.style.borderColor = 'transparent'
          );
          shareScreenRequests.selectedSourceId =  index;
          item.style.borderColor = '#2196F3';
          shareBtn.disabled = false;
        };
        if(tab.id ==="screen" && source.name===tab.filter){
          grid.appendChild(item);
        } else if(tab.id ==="window" && source.name!==tab.filter){
          grid.appendChild(item);
        }
      });
      
      tabPanel.appendChild(grid);
      tabContent.appendChild(tabPanel);
    });
    modal.appendChild(tabContainer);
    modal.appendChild(tabContent);
    screenShareDialog.hidden = false;
  },
  clearScreenShareModalContents: function () {
    const screenShareDialog = document.getElementById('screen-share-dialog');
    screenShareDialog.hidden = true;
    webviews.hidePlaceholder('screenShareMode');
    document.querySelector(".screen-box").innerHTML = ""; 
  },
  switchModalTab: function (index) {
    // Remove active class from all tabs and panels
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
    
    // Add active class to selected tab and panel
    document.querySelectorAll('.tab')[index].classList.add('active');
    document.querySelectorAll('.tab-panel')[index].classList.add('active');
  },
  update: function (tabId) {
    shareScreenRequests.clearScreenShareModalContents();
    ipcRenderer.send('source-modal-closed', shareScreenRequests?.selectedSourceId);
  },
  initialize: function () {
    ipcRenderer.on('screen-share-sources', function (e, data) {
       const { sources } = data;
       shareScreenRequests.clearScreenShareModalContents();
       shareScreenRequests.createScreenShareModal(sources);
       const screenShareDialog = document.getElementById('screen-share-dialog');
       screenShareDialog.hidden = false;
       webviews.requestPlaceholder('screenShareMode');
    })
  }
}


shareScreenRequests.initialize()

module.exports = shareScreenRequests
