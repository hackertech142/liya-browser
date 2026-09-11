const fs = require('fs')
const path = require('path')
const archiver = require('archiver')
const builder = require('electron-builder')
const Arch = builder.Arch

const packageFile = require('./../package.json')
const version = packageFile.version

const createPackage = require('./createPackage.js')

async function afterPackageBuilt (packagePath) {
  /* create output directory if it doesn't exist */
  if (!fs.existsSync('dist/app')) {
    fs.mkdirSync('dist/app')
  }

  let archSuffix

  if (packagePath.includes('ia32')) {
    archSuffix = '-ia32'
  } else if (packagePath.includes('arm64')) {
    archSuffix = '-arm64'
  } else {
    archSuffix = ''
  }

  /* create zip files */
  var output = fs.createWriteStream('dist/app/' + 'Liya-Browser-v' + version + '-windows' + archSuffix + '.zip')
  var archive = archiver('zip', {
    zlib: { level: 9 }
  })
  archive.directory(packagePath, 'Liya-Browser-v' + version)
  archive.pipe(output)
  await archive.finalize()

  // electron-builder with 'nsis' target automatically creates the installer in dist/app
  console.log('NSIS installer and ZIP package created successfully in dist/app')
}

// Build x64 package for Windows
createPackage('win32', { arch: Arch.x64 })
  .then(afterPackageBuilt)
  .then(function () {
    console.log('Liya Browser build completed successfully!')
  })

