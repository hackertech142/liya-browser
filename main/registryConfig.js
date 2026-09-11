var regedit = require('regedit')

var installPath = process.execPath

var keysToCreate = [
  'HKCU\\Software\\Classes\\Liya',
  'HKCU\\Software\\Classes\\Liya\\Application',
  'HKCU\\Software\\Classes\\Liya\\DefaulIcon',
  'HKCU\\Software\\Classes\\Liya\\shell\\open\\command',
  'HKCU\\Software\\Clients\\StartMenuInternet\\Liya\\Capabilities\\FileAssociations',
  'HKCU\\Software\\Clients\\StartMenuInternet\\Liya\\Capabilities\\StartMenu',
  'HKCU\\Software\\Clients\\StartMenuInternet\\Liya\\Capabilities\\URLAssociations',
  'HKCU\\Software\\Clients\\StartMenuInternet\\Liya\\DefaultIcon',
  'HKCU\\Software\\Clients\\StartMenuInternet\\Liya\\InstallInfo',
  'HKCU\\Software\\Clients\\StartMenuInternet\\Liya\\shell\\open\\command'
]

var registryConfig = {
  'HKCU\\Software\\RegisteredApplications': {
    Liya: {
      value: 'Software\\Clients\\StartMenuInternet\\Liya\\Capabilities',
      type: 'REG_SZ'
    }
  },
  'HKCU\\Software\\Classes\\Liya': {
    default: {
      value: 'Liya Browser Document',
      type: 'REG_DEFAULT'
    }
  },
  'HKCU\\Software\\Classes\\Liya\\Application': {
    ApplicationIcon: {
      value: installPath + ',0',
      type: 'REG_SZ'
    },
    ApplicationName: {
      value: 'Liya',
      type: 'REG_SZ'
    },
    AppUserModelId: {
      value: 'Liya',
      type: 'REG_SZ'
    }
  },
  'HKCU\\Software\\Classes\\Liya\\DefaulIcon': {
    ApplicationIcon: {
      value: installPath + ',0',
      type: 'REG_SZ'
    }
  },
  'HKCU\\Software\\Classes\\Liya\\shell\\open\\command': {
    default: {
      value: '"' + installPath + '" "%1"',
      type: 'REG_DEFAULT'
    }
  },
  'HKCU\\Software\\Classes\\.htm\\OpenWithProgIds': {
    Liya: {
      value: 'Empty',
      type: 'REG_SZ'
    }
  },
  'HKCU\\Software\\Classes\\.html\\OpenWithProgIds': {
    Liya: {
      value: 'Empty',
      type: 'REG_SZ'
    }
  },
  'HKCU\\Software\\Clients\\StartMenuInternet\\Liya\\Capabilities\\FileAssociations': {
    '.htm': {
      value: 'Liya',
      type: 'REG_SZ'
    },
    '.html': {
      value: 'Liya',
      type: 'REG_SZ'
    }
  },
  'HKCU\\Software\\Clients\\StartMenuInternet\\Liya\\Capabilities\\StartMenu': {
    StartMenuInternet: {
      value: 'Liya',
      type: 'REG_SZ'
    }
  },
  'HKCU\\Software\\Clients\\StartMenuInternet\\Liya\\Capabilities\\URLAssociations': {
    http: {
      value: 'Liya',
      type: 'REG_SZ'
    },
    https: {
      value: 'Liya',
      type: 'REG_SZ'
    }
  },
  'HKCU\\Software\\Clients\\StartMenuInternet\\Liya\\DefaultIcon': {
    default: {
      value: installPath + ',0',
      type: 'REG_DEFAULT'
    }
  },
  'HKCU\\Software\\Clients\\StartMenuInternet\\Liya\\InstallInfo': {
    IconsVisible: {
      value: 1,
      type: 'REG_DWORD'
    }
  },
  'HKCU\\Software\\Clients\\StartMenuInternet\\Liya\\shell\\open\\command': {
    default: {
      value: installPath,
      type: 'REG_DEFAULT'
    }
  }
}

var registryInstaller = {
  install: function () {
    return new Promise(function (resolve, reject) {
      regedit.createKey(keysToCreate, function (err) {
        regedit.putValue(registryConfig, function (err) {
          if (err) {
            reject()
          } else {
            resolve()
          }
        })
      })
    })
  },
  uninstall: function () {
    return new Promise(function (resolve, reject) {
      regedit.deleteKey(keysToCreate, function (err) {
        if (err) {
          reject()
        } else {
          resolve()
        }
      })
    })
  }
}
