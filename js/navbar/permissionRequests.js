const { ipcRenderer } = require('electron')
const webviews = require('webviews.js')

const permissionRequests = {
  requests: [],
  listeners: [],
  grantPermission: function (permissionId) {
    permissionRequests.requests.forEach(function (request) {
      if (request.permissionId && request.permissionId === permissionId) {
        ipcRenderer.send('permissionGranted', permissionId)
      }
    })
  },
  getIcons: function (request) {
    if (request.permission === 'notifications') {
      return ['carbon:chat']
    } else if (request.permission === 'pointerLock') {
      return ['carbon:cursor-1']
    } else if (request.permission === 'media' && request.details.mediaTypes) {
      var mediaIcons = {
        video: 'carbon:video',
        audio: 'carbon:microphone'
      }
      return request.details.mediaTypes.map(t => mediaIcons[t])
    }
    return []
  },
  getButtons: function (tabId) {
    var buttons = []
    permissionRequests.requests.forEach(function (request) {
      const icons = permissionRequests.getIcons(request)
      //don't display buttons for unsupported permission types
      if (icons.length === 0) {
        return
      }
  
      if (request.tabId === tabId) {
        var button = document.createElement('button')
        button.className = 'tab-icon permission-request-icon'
        if (request.granted) {
          button.classList.add('active')
        }
        icons.forEach(function (icon) {
          var el = document.createElement('i')
          el.className = 'i ' + icon
          button.appendChild(el)
        })
        button.addEventListener('click', function (e) {
          e.stopPropagation()
          if (request.granted) {
            webviews.callAsync(tabId, 'reload')
          } else {
            permissionRequests.grantPermission(request.permissionId)
            button.classList.add('active')
          }
        })
        buttons.push(button)
      }
    })
    return buttons
  },
  onChange: function (listener) {
    permissionRequests.listeners.push(listener)
  },
  showPopup: function(request) {
    const popup = document.getElementById('permission-popup');
    const textEl = popup.querySelector('.permission-popup-text');
    const iconEl = popup.querySelector('.permission-popup-icon');
    const allowBtn = popup.querySelector('.permission-allow-btn');
    const blockBtn = popup.querySelector('.permission-block-btn');
    
    let permissionName = request.permission;
    if (request.permission === 'media' && request.details.mediaTypes) {
      permissionName = request.details.mediaTypes.join(' and ');
    }
    
    let domain = request.origin || 'A website';
    try {
      domain = new URL(request.origin).hostname;
    } catch(e) {}
    let wantsToUse = window.l ? window.l('permissionWantsToUse') : '';
    if (!wantsToUse) wantsToUse = '%s1 wants to use your %s2';
    
    textEl.textContent = wantsToUse.replace('%s1', domain).replace('%s2', permissionName);
    
    const icons = permissionRequests.getIcons(request);
    iconEl.className = 'i permission-popup-icon ' + (icons[0] || 'carbon:help');
    
    allowBtn.onclick = function() {
      permissionRequests.grantPermission(request.permissionId);
      popup.classList.remove('show');
      setTimeout(() => {
        popup.setAttribute('hidden', 'true');
        webviews.hidePlaceholder('permissionPopup');
      }, 300);
    };
    
    blockBtn.onclick = function() {
      popup.classList.remove('show');
      setTimeout(() => {
        popup.setAttribute('hidden', 'true');
        webviews.hidePlaceholder('permissionPopup');
      }, 300);
    };
    
    webviews.requestPlaceholder('permissionPopup');
    popup.removeAttribute('hidden');
    setTimeout(() => popup.classList.add('show'), 10);
  },
  initialize: function () {
    ipcRenderer.on('updatePermissions', function (e, data) {
      var oldData = permissionRequests.requests;
      permissionRequests.requests = data;
      
      data.forEach(function (req) {
        if (!req.granted && !oldData.some(oldReq => oldReq.permissionId === req.permissionId)) {
          permissionRequests.showPopup(req);
        }
      });
      
      oldData.forEach(function (req) {
        permissionRequests.listeners.forEach(listener => listener(req.tabId));
      });
      permissionRequests.requests.forEach(function (req) {
        permissionRequests.listeners.forEach(listener => listener(req.tabId));
      });
    });
  }
}

permissionRequests.initialize()

module.exports = permissionRequests
