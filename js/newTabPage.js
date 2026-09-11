const path = require('path')
const statistics = require('js/statistics.js')
const webviews = require('webviews.js')
const urlParser = require('util/urlParser.js')

const newTabPage = {
  background: document.getElementById('ntp-background'),
  hasBackground: false,
  picker: document.getElementById('ntp-image-picker'),
  deleteBackground: document.getElementById('ntp-image-remove'),
  imagePath: path.join(window.globalArgs['user-data-path'], 'newTabBackground'),
  blobInstance: null,
  reloadBackground: function () {
    fs.readFile(newTabPage.imagePath, function (err, data) {
      if (newTabPage.blobInstance) {
        URL.revokeObjectURL(newTabPage.blobInstance)
        newTabPage.blobInstance = null
      }
      if (err) {
        newTabPage.background.hidden = true
        newTabPage.hasBackground = false
        document.body.classList.remove('ntp-has-background')
        newTabPage.deleteBackground.hidden = true
      } else {
        const blob = new Blob([data], { type: 'application/octet-binary' })
        const url = URL.createObjectURL(blob)
        newTabPage.blobInstance = url
        newTabPage.background.src = url

        newTabPage.background.hidden = false
        newTabPage.hasBackground = true
        document.body.classList.add('ntp-has-background')
        newTabPage.deleteBackground.hidden = false
      }
    })
  },
  initialize: function () {
    newTabPage.reloadBackground()

    // Live clock & date update
    function updateClock () {
      const clockEl = document.getElementById('liya-clock')
      const dateEl = document.getElementById('liya-date')
      
      if (clockEl) {
        const now = new Date()
        const hrs = String(now.getHours()).padStart(2, '0')
        const mins = String(now.getMinutes()).padStart(2, '0')
        clockEl.textContent = hrs + ':' + mins
        
        if (dateEl) {
          const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
          dateEl.textContent = now.toLocaleDateString(undefined, options)
        }
      }
    }
    updateClock()
    setInterval(updateClock, 1000)

    // Handle NTP Search
    const searchInput = document.getElementById('liya-ntp-input')
    const searchBtn = document.getElementById('liya-ntp-btn')

    function performNtpSearch () {
      if (searchInput && searchInput.value.trim()) {
        const query = searchInput.value.trim()
        const targetUrl = urlParser.parse(query)
        webviews.update(tabs.getSelected(), targetUrl)
      }
    }

    if (searchInput) {
      searchInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          performNtpSearch()
        }
      })
    }
    if (searchBtn) {
      searchBtn.addEventListener('click', performNtpSearch)
    }

    // Handle Dynamic Quick Links Tiles
    const quickLinksContainer = document.getElementById('liya-quick-links')
    const addBtn = document.getElementById('add-shortcut-btn')
    const modal = document.getElementById('add-shortcut-modal')
    const cancelBtn = document.getElementById('shortcut-cancel-btn')
    const saveBtn = document.getElementById('shortcut-save-btn')
    const nameInput = document.getElementById('shortcut-name')
    const urlInput = document.getElementById('shortcut-url')

    const DEFAULT_SHORTCUTS = [
      { name: 'Google', url: 'https://www.google.com' },
      { name: 'YouTube', url: 'https://www.youtube.com' }
    ]

    function getShortcuts () {
      try {
        const saved = localStorage.getItem('liya-custom-shortcuts')
        if (saved) {
          return JSON.parse(saved)
        }
      } catch (e) {
        console.warn('Could not parse shortcuts', e)
      }
      return DEFAULT_SHORTCUTS
    }

    function saveShortcuts (shortcuts) {
      localStorage.setItem('liya-custom-shortcuts', JSON.stringify(shortcuts))
    }

    function renderShortcuts () {
      // Remove existing dynamic tiles (keep the add button)
      const existingTiles = quickLinksContainer.querySelectorAll('.liya-tile:not(.add-shortcut-btn)')
      existingTiles.forEach(tile => tile.remove())

      const shortcuts = getShortcuts()

      shortcuts.forEach((shortcut, index) => {
        const tile = document.createElement('div')
        tile.className = 'liya-tile'
        tile.setAttribute('data-url', shortcut.url)
        tile.title = shortcut.name

        // Construct domain for favicon
        let domain = ''
        try {
          const urlObj = new URL(shortcut.url.startsWith('http') ? shortcut.url : 'http://' + shortcut.url)
          domain = urlObj.hostname
        } catch (e) {
          domain = shortcut.url
        }
        
        const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`

        tile.innerHTML = `
          <button class="remove-shortcut-btn" data-index="${index}" title="Remove"><i class="i carbon:close"></i></button>
          <div class="tile-icon" style="background: #ffffff; padding: 4px; border: 1px solid #e2e8f0;">
            <img src="${faviconUrl}" alt="${shortcut.name} icon" />
          </div>
          <span style="margin-top: 5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; display: inline-block;">${shortcut.name}</span>
        `

        // Click handler for tile navigation
        tile.addEventListener('click', function (e) {
          // If they clicked the remove button, don't navigate
          if (e.target.closest('.remove-shortcut-btn')) return
          
          let targetUrl = shortcut.url
          if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
            targetUrl = 'https://' + targetUrl
          }
          webviews.update(tabs.getSelected(), targetUrl)
        })

        // Click handler for remove button
        const removeBtn = tile.querySelector('.remove-shortcut-btn')
        removeBtn.addEventListener('click', function (e) {
          e.stopPropagation()
          const idx = parseInt(this.getAttribute('data-index'), 10)
          const currentShortcuts = getShortcuts()
          currentShortcuts.splice(idx, 1)
          saveShortcuts(currentShortcuts)
          renderShortcuts()
        })

        quickLinksContainer.insertBefore(tile, addBtn)
      })
    }

    // Initial render
    if (quickLinksContainer) {
      renderShortcuts()
    }

    // Modal handlers
    if (addBtn && modal) {
      addBtn.addEventListener('click', () => {
        nameInput.value = ''
        urlInput.value = ''
        modal.hidden = false
      })

      cancelBtn.addEventListener('click', () => {
        modal.hidden = true
      })

      saveBtn.addEventListener('click', () => {
        const name = nameInput.value.trim()
        let url = urlInput.value.trim()

        if (!name || !url) {
          return
        }

        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url
        }

        const shortcuts = getShortcuts()
        shortcuts.push({ name, url })
        saveShortcuts(shortcuts)

        modal.hidden = true
        renderShortcuts()
      })
    }

    if (newTabPage.picker) {
      newTabPage.picker.addEventListener('click', async function () {
        var filePath = await ipc.invoke('showOpenDialog', {
          filters: [
            { name: 'Image files', extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp'] }
          ]
        })

        if (!filePath) {
          return
        }

        await fs.promises.copyFile(filePath[0], newTabPage.imagePath)
        newTabPage.reloadBackground()
      })
    }

    if (newTabPage.deleteBackground) {
      newTabPage.deleteBackground.addEventListener('click', async function () {
        await fs.promises.unlink(newTabPage.imagePath)
        newTabPage.reloadBackground()
      })
    }

    // Widgets Sidebar Logic
    const widgetsToggle = document.getElementById('ntp-widgets-toggle')
    const widgetsSidebar = document.getElementById('widgets-sidebar')
    const widgetsClose = document.getElementById('widgets-close-btn')

    if (widgetsToggle && widgetsSidebar && widgetsClose) {
      widgetsToggle.addEventListener('click', (e) => {
        e.stopPropagation()
        widgetsSidebar.classList.remove('closed')
      })
      widgetsClose.addEventListener('click', () => {
        widgetsSidebar.classList.add('closed')
      })
      
      document.addEventListener('click', (e) => {
        if (!widgetsSidebar.classList.contains('closed')) {
          if (!widgetsSidebar.contains(e.target) && !widgetsToggle.contains(e.target)) {
            widgetsSidebar.classList.add('closed')
          }
        }
      })
    }

    // Quick Note Logic
    const noteTextarea = document.getElementById('note-textarea')
    if (noteTextarea) {
      const savedNote = localStorage.getItem('liya-quick-note') || ''
      noteTextarea.value = savedNote
      noteTextarea.addEventListener('input', (e) => {
        localStorage.setItem('liya-quick-note', e.target.value)
      })
    }

    // To-Do Logic
    const todoInput = document.getElementById('todo-input')
    const todoAddBtn = document.getElementById('todo-add-btn')
    const todoList = document.getElementById('todo-list')

    if (todoInput && todoAddBtn && todoList) {
      let tasks = []
      try {
        const savedTasks = localStorage.getItem('liya-todos')
        if (savedTasks) tasks = JSON.parse(savedTasks)
      } catch (e) {
        console.warn('Could not parse todos', e)
      }

      function saveTodos() {
        localStorage.setItem('liya-todos', JSON.stringify(tasks))
      }

      function renderTodos() {
        todoList.innerHTML = ''
        tasks.forEach((task, idx) => {
          const li = document.createElement('li')
          li.className = 'todo-item' + (task.done ? ' done' : '')
          li.innerHTML = `
            <input type="checkbox" class="todo-checkbox" ${task.done ? 'checked' : ''} data-index="${idx}">
            <span class="todo-text">${task.text}</span>
            <button class="todo-delete" data-index="${idx}"><i class="i carbon:trash-can"></i></button>
          `
          todoList.appendChild(li)
        })

        // Attach listeners
        todoList.querySelectorAll('.todo-checkbox').forEach(cb => {
          cb.addEventListener('change', (e) => {
            const idx = e.target.getAttribute('data-index')
            tasks[idx].done = e.target.checked
            saveTodos()
            renderTodos()
          })
        })

        todoList.querySelectorAll('.todo-delete').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const idx = e.currentTarget.getAttribute('data-index')
            tasks.splice(idx, 1)
            saveTodos()
            renderTodos()
          })
        })
      }

      function addTodo() {
        const text = todoInput.value.trim()
        if (text) {
          tasks.push({ text, done: false })
          saveTodos()
          todoInput.value = ''
          renderTodos()
        }
      }

      todoAddBtn.addEventListener('click', addTodo)
      todoInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') addTodo()
      })

      renderTodos()
    }

    // Weather Logic
    const weatherContent = document.getElementById('weather-content')
    if (weatherContent) {
      async function loadWeather() {
        try {
          // Get IP based location using ipinfo (more reliable)
          const locRes = await fetch('https://ipinfo.io/json')
          const locData = await locRes.json()
          
          if (!locData.loc) throw new Error('Location not found')
          
          const coords = locData.loc.split(',')
          const lat = coords[0]
          const lon = coords[1]
          const city = locData.city || 'Your Location'
          
          // Get weather from Open-Meteo
          const wRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
          const wData = await wRes.json()
          
          const current = wData.current_weather
          
          // Basic WMO code to emoji/description mapping
          const weatherCodeMap = {
            0: { icon: '☀️', desc: 'Clear sky' },
            1: { icon: '🌤️', desc: 'Mainly clear' },
            2: { icon: '⛅', desc: 'Partly cloudy' },
            3: { icon: '☁️', desc: 'Overcast' },
            45: { icon: '🌫️', desc: 'Fog' },
            48: { icon: '🌫️', desc: 'Depositing rime fog' },
            51: { icon: '🌧️', desc: 'Light drizzle' },
            53: { icon: '🌧️', desc: 'Moderate drizzle' },
            55: { icon: '🌧️', desc: 'Dense drizzle' },
            61: { icon: '🌧️', desc: 'Slight rain' },
            63: { icon: '🌧️', desc: 'Moderate rain' },
            65: { icon: '🌧️', desc: 'Heavy rain' },
            71: { icon: '❄️', desc: 'Slight snow' },
            73: { icon: '❄️', desc: 'Moderate snow' },
            75: { icon: '❄️', desc: 'Heavy snow' },
            95: { icon: '⛈️', desc: 'Thunderstorm' }
          }
          
          const weatherInfo = weatherCodeMap[current.weathercode] || { icon: '🌡️', desc: 'Unknown' }
          
          weatherContent.innerHTML = `
            <div class="weather-icon">${weatherInfo.icon}</div>
            <div class="weather-info">
              <div class="weather-temp">${Math.round(current.temperature)}°C</div>
              <div class="weather-desc">${weatherInfo.desc}</div>
              <div class="weather-city">${city}</div>
            </div>
          `
        } catch (e) {
          console.error('Weather error:', e)
          weatherContent.innerHTML = `<div class="weather-loading" style="color: #ef4444;">Could not load weather.</div>`
        }
      }
      
      loadWeather()
    }

    statistics.registerGetter('ntpHasBackground', function () {
      return newTabPage.hasBackground
    })
  }
}

module.exports = newTabPage
