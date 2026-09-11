const { ipcRenderer } = require('electron')
const modalMode = require('modalMode.js')
const places = require('places/places.js')

const clearDataModal = {
  element: null,
  initialize: function () {
    if (this.element) return

    this.element = document.createElement('div')
    this.element.id = 'clear-data-modal'
    this.element.className = 'modal'
    this.element.hidden = true

    this.element.innerHTML = `
      <h2 class="modal-title">Clear Browsing Data</h2>
      <button class="modal-close-button i carbon:close"></button>
      <div class="clear-data-options">
        <label><input type="checkbox" id="clear-history-cb" checked /> Browsing History</label>
        <label><input type="checkbox" id="clear-cookies-cb" checked /> Cookies and Site Data</label>
        <label><input type="checkbox" id="clear-tasks-cb" /> Open Tabs (Tasks)</label>
      </div>
      <div class="clear-data-actions">
        <button id="clear-data-cancel">Cancel</button>
        <button id="clear-data-confirm" class="primary-button">Clear Data</button>
      </div>
    `

    document.body.appendChild(this.element)

    this.element.querySelector('.modal-close-button').addEventListener('click', () => this.hide())
    this.element.querySelector('#clear-data-cancel').addEventListener('click', () => this.hide())
    
    this.element.querySelector('#clear-data-confirm').addEventListener('click', () => {
      const clearHistory = this.element.querySelector('#clear-history-cb').checked
      const clearCookies = this.element.querySelector('#clear-cookies-cb').checked
      const clearTasks = this.element.querySelector('#clear-tasks-cb').checked

      if (clearHistory) {
        places.deleteAllHistory()
      }
      
      if (clearCookies) {
        ipcRenderer.invoke('clearStorageData')
      }
      
      if (clearTasks) {
        // Destroy all tasks
        const browserUI = require('browserUI.js')
        const allTaskIds = tasks.map(t => t.id)
        allTaskIds.forEach(id => {
          browserUI.closeTask(id)
        })
      }

      this.hide()
    })
  },
  show: function () {
    this.initialize()
    this.element.hidden = false
    modalMode.toggle(true, {
      onDismiss: () => this.hide()
    })
  },
  hide: function () {
    if (this.element) {
      this.element.hidden = true
    }
    modalMode.toggle(false)
  }
}

module.exports = clearDataModal
