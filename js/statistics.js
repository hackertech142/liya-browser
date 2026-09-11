const settings = require('util/settings/settings.js')

const statistics = {
  envGetters: [],
  registerGetter: function (key, fn) {
    statistics.envGetters.push({ key, fn })
  },
  usageDataCache: {},
  getValue: function (key) {
    return statistics.usageDataCache[key]
  },
  setValue: function (key, value) {
    statistics.usageDataCache[key] = value
  },
  incrementValue: function (key, value) {
    if (statistics.usageDataCache[key]) {
      statistics.usageDataCache[key]++
    } else {
      statistics.usageDataCache[key] = 1
    }
  },
  upload: function () {
    // Disabled for 100% Privacy
  },
  initialize: function () {
    // Disabled for 100% Privacy
  }
}

module.exports = statistics
