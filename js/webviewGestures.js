var webviews = require('webviews.js')

var webviewGestures = {
  showBackArrow: function () {
    var backArrow = document.getElementById('leftArrowContainer')
    if (!backArrow) return
    backArrow.classList.add('shown')
    backArrow.classList.add('animating')
    setTimeout(function () {
      backArrow.classList.remove('shown')
    }, 400)
    setTimeout(function () {
      backArrow.classList.remove('animating')
    }, 700)
  },
  showForwardArrow: function () {
    var forwardArrow = document.getElementById('rightArrowContainer')
    if (!forwardArrow) return
    forwardArrow.classList.add('shown')
    forwardArrow.classList.add('animating')
    setTimeout(function () {
      forwardArrow.classList.remove('shown')
    }, 400)
    setTimeout(function () {
      forwardArrow.classList.remove('animating')
    }, 700)
  },
  zoomWebviewBy: function (tabId, amt) {
    webviews.callAsync(tabId, 'zoomFactor', function (err, oldFactor) {
      webviews.callAsync(tabId, 'zoomFactor', Math.min(webviewMaxZoom, Math.max(webviewMinZoom, oldFactor + amt)))
    })
  },
  zoomWebviewIn: function (tabId) {
    return this.zoomWebviewBy(tabId, 0.2)
  },
  zoomWebviewOut: function (tabId) {
    return this.zoomWebviewBy(tabId, -0.2)
  },
  resetWebviewZoom: function (tabId) {
    webviews.callAsync(tabId, 'zoomFactor', 1.0)
  }
}

var swipeGestureDistanceResetTimeout = -1
var swipeGestureScrollResetTimeout = -1;
var swipeGestureLowVelocityTimeout = -1
var swipeGestureDelay = 100 // delay before gesture is complete
var swipeGestureScrollDelay = 750;
var swipeGestureVelocityDelay = 70 // the time (in ms) that can elapse without a minimum amount of movement before the gesture is considered almost completed

var horizontalMouseMove = 0
var verticalMouseMove = 0

var leftMouseMove = 0;
var rightMouseMove = 0;

var beginningScrollLeft = null
var beginningScrollRight = null
var isInFrame = false

var hasShownSwipeArrow = false

var initialZoomKeyState = null
var initialSecondaryKeyState = null

var webviewMinZoom = 0.5
var webviewMaxZoom = 3.0

function resetDistanceCounters () {
  horizontalMouseMove = 0
  verticalMouseMove = 0
  leftMouseMove = 0
  rightMouseMove = 0

  hasShownSwipeArrow = false

  initialZoomKeyState = null
  initialSecondaryKeyState = null
}

function resetScrollCounters () {
  beginningScrollLeft = null
  beginningScrollRight = null
  isInFrame = false
}

function onSwipeGestureLowVelocity () {
  if (isInFrame) {
    return
  }

  const selectedTab = tabs.getSelected()
  if (!selectedTab) return

  const ratio = Math.abs(horizontalMouseMove / (verticalMouseMove || 1))
  if (ratio > 0.8) {
    // swipe right (rightMouseMove, finger moves right) to go back or switch to previous tab
    if (rightMouseMove > 25) {
      webviews.callAsync(selectedTab, 'canGoBack', function (err, canGoBack) {
        if (canGoBack) {
          resetDistanceCounters()
          resetScrollCounters()
          webviewGestures.showBackArrow()
          webviews.goBackIgnoringRedirects(selectedTab)
        } else {
          var allTabs = tabs.get()
          var selectedIndex = tabs.getIndex(selectedTab)
          if (selectedIndex > 0) {
            resetDistanceCounters()
            resetScrollCounters()
            webviewGestures.showBackArrow()
            var prevTabId = allTabs[selectedIndex - 1].id
            require('browserUI.js').switchToTab(prevTabId)
          }
        }
      })
      return
    }

    // swipe left (leftMouseMove, finger moves left) to go forward or switch to next tab
    if (leftMouseMove > 25) {
      webviews.callAsync(selectedTab, 'canGoForward', function (err, canGoForward) {
        if (canGoForward) {
          resetDistanceCounters()
          resetScrollCounters()
          webviewGestures.showForwardArrow()
          webviews.callAsync(selectedTab, 'goForward')
        } else {
          var allTabs = tabs.get()
          var selectedIndex = tabs.getIndex(selectedTab)
          if (selectedIndex >= 0 && selectedIndex < allTabs.length - 1) {
            resetDistanceCounters()
            resetScrollCounters()
            webviewGestures.showForwardArrow()
            var nextTabId = allTabs[selectedIndex + 1].id
            require('browserUI.js').switchToTab(nextTabId)
          }
        }
      })
      return
    }
  }
}

function handleWheel (e) {
  if (e.defaultPrevented) {
    return
  }

  verticalMouseMove += e.deltaY
  horizontalMouseMove += e.deltaX
  if (e.deltaX > 0) {
    leftMouseMove += e.deltaX
  } else {
    rightMouseMove += e.deltaX * -1
  }

  var platformZoomKey = ((navigator.platform === 'MacIntel') ? e.metaKey : e.ctrlKey)
  var platformSecondaryKey = ((navigator.platform === 'MacIntel') ? e.ctrlKey : false)

  if (initialZoomKeyState === null) {
    initialZoomKeyState = platformZoomKey
  }

  if (initialSecondaryKeyState === null) {
    initialSecondaryKeyState = platformSecondaryKey
  }

  if (Math.abs(e.deltaX) >= 10 || Math.abs(e.deltaY) >= 10) {
    clearTimeout(swipeGestureLowVelocityTimeout)
    swipeGestureLowVelocityTimeout = setTimeout(onSwipeGestureLowVelocity, swipeGestureVelocityDelay)

    const absRatio = Math.abs(horizontalMouseMove / (verticalMouseMove || 1))
    if (horizontalMouseMove < -40 && absRatio > 1.0 && !hasShownSwipeArrow) {
      webviews.callAsync(tabs.getSelected(), 'canGoBack', function (err, canGoBack) {
        var selectedIndex = tabs.getIndex(tabs.getSelected())
        if (canGoBack || selectedIndex > 0) {
          hasShownSwipeArrow = true
          webviewGestures.showBackArrow()
        }
      })
    } else if (horizontalMouseMove > 40 && absRatio > 1.0 && !hasShownSwipeArrow) {
      webviews.callAsync(tabs.getSelected(), 'canGoForward', function (err, canGoForward) {
        var allTabs = tabs.get()
        var selectedIndex = tabs.getIndex(tabs.getSelected())
        if (canGoForward || (selectedIndex >= 0 && selectedIndex < allTabs.length - 1)) {
          hasShownSwipeArrow = true
          webviewGestures.showForwardArrow()
        }
      })
    }
  }

  clearTimeout(swipeGestureDistanceResetTimeout)
  clearTimeout(swipeGestureScrollResetTimeout)
  swipeGestureDistanceResetTimeout = setTimeout(resetDistanceCounters, swipeGestureDelay)
  swipeGestureScrollResetTimeout = setTimeout(resetScrollCounters, swipeGestureScrollDelay)

  /* cmd-key while scrolling should zoom in and out */
  if (platformZoomKey && initialZoomKeyState) {
    if (verticalMouseMove > 50) {
      verticalMouseMove = -10
      webviewGestures.zoomWebviewOut(tabs.getSelected())
    }

    if (verticalMouseMove < -50) {
      verticalMouseMove = -10
      webviewGestures.zoomWebviewIn(tabs.getSelected())
    }
  }
}

webviews.bindIPC('wheel-event', function (tabId, e) {
  handleWheel(JSON.parse(e))
})

window.addEventListener('wheel', function (e) {
  // Catch wheel events directly on the main window DOM (e.g. New Tab Page)
  if (document.body.classList.contains('is-ntp') || e.target.closest('#webviews') || e.target.closest('#navbar')) {
    handleWheel(e)
  }
}, { passive: true })

module.exports = webviewGestures
