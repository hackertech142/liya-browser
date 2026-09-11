const { ipcRenderer } = require('electron')
var searchbar = require('searchbar/searchbar.js')
var searchbarPlugins = require('searchbar/searchbarPlugins.js')
var searchbarUtils = require('searchbar/searchbarUtils.js')
var bangsPlugin = require('searchbar/bangsPlugin.js')
var places = require('places/places.js')
var urlParser = require('util/urlParser.js')
var formatRelativeDate = require('util/relativeDate.js')
var clearDataModal = require('clearDataModal.js')

module.exports = {
  initialize: function () {
    bangsPlugin.registerCustomBang({
      phrase: '!history',
      snippet: l('searchHistory'),
      icon: 'carbon:recently-viewed',
      isAction: false,
      showSuggestions: async function (text, input, event) {
        const results = await places.searchPlaces(text, { limit: Infinity })

        searchbarPlugins.reset('bangs')

        var container = searchbarPlugins.getContainer('bangs')

        // show clear button

        if (text === '') {
          var clearButton = document.createElement('button')
          clearButton.className = 'searchbar-floating-button'
          clearButton.textContent = 'Clear Browsing Data'
          container.appendChild(clearButton)

          clearButton.addEventListener('click', function () {
            clearDataModal.show()
          })
        }

        // show results

        var lazyList = searchbarUtils.createLazyList(container.parentNode)

        var lastRelativeDate = '' // used to generate headings

        results.sort(function (a, b) {
          // order by last visit
          return b.lastVisit - a.lastVisit
        })

        if (results.length === 0) {
          var emptyState = document.createElement('div')
          emptyState.className = 'searchbar-item'
          emptyState.innerHTML = '<span class="title">No browsing history found</span>'
          emptyState.style.opacity = '0.5'
          emptyState.style.pointerEvents = 'none'
          container.appendChild(emptyState)
        }

        results.slice(0, 1000).forEach(function (result, index) {
          var thisRelativeDate = formatRelativeDate(result.lastVisit)
          if (thisRelativeDate !== lastRelativeDate) {
            searchbarPlugins.addHeading('bangs', { text: thisRelativeDate })
            lastRelativeDate = thisRelativeDate
          }
          var data = {
            title: result.title,
            secondaryText: urlParser.basicURL(urlParser.getSourceURL(result.url)),
            fakeFocus: index === 0 && text,
            icon: (result.isBookmarked ? 'carbon:star' : ''),
            click: function (e) {
              searchbar.openURL(result.url, e)
            },
            delete: function () {
              places.deleteHistory(result.url)
            },
            showDeleteButton: true
          }
          var placeholder = lazyList.createPlaceholder()
          container.appendChild(placeholder)
          lazyList.lazyRenderItem(placeholder, data)
        })
      },
      fn: function (text) {
        if (!text) {
          return
        }
        places.searchPlaces(text, { limit: Infinity })
          .then(function (results) {
            if (results.length !== 0) {
              results = results.sort(function (a, b) {
                return b.lastVisit - a.lastVisit
              })
              searchbar.openURL(results[0].url, null)
            }
          })
      }
    })
  }
}
