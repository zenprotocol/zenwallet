import path from 'path'
import { execSync } from 'child_process'

import arch from 'arch'
import { dialog } from 'electron'

import { getZenNodePath } from '../ZenNode'

import { isOsx, isWindows, isLinux } from './platformUtils'

export default prereqCheck

const ERR_STATUS = 'ERR_STATUS'

function prereqCheck() {
  console.log('\n***** prereq check: start *****')
  validateOs()
  validateZ3()
  validateMono()
  console.log('***** prereq check: passed *****\n')
}

function validateOs() {
  if (arch() !== 'x64') {
    const msg = 'Zen-node can only run on 64 bit OS'
    console.log(msg)
    dialog.showErrorBox(
      'Operating system not supported',
      msg,
    )
    process.exit(1)
  } else {
    console.log('OS .64 version check passed')
  }
}

function validateZ3() {
  try {
    const z3Path = getZ3PathForPlatform()
    execSync(`${z3Path} --help`)
    console.log('Z3 check passed')
  } catch (err) {
    dialog.showErrorBox(
      'Z3 check failed',
      `Failed to run z3\n${err.message}`,
    )
    process.exit(1)
  }
}

function getZ3PathForPlatform() {
  const pathToDir = path.join(getZenNodePath(), 'Release')
  let filename
  if (isWindows()) { filename = 'z3.exe' }
  if (isOsx()) { filename = 'z3-osx' }
  if (isLinux()) { filename = 'z3-linux' }
  return path.join(pathToDir, filename)
}

function validateMono() {
  if (!isOsx()) {
    console.log('mono version check passed (not needed for non OSX)')
    return
  }
  const { status, msg } = getMonoStatus()
  if (status === ERR_STATUS) {
    console.error(msg)
    dialog.showErrorBox(
      'Mono check failed',
      msg,
    )
    process.exit(1)
  } else {
    console.log('mono version check passed')
  }
}

function getMonoStatus() {
  try {
    const monoOutput = execSync(`${monoPath()} --version`, { encoding: 'utf-8' })
    try {
      const [major, minor] = monoOutput.split('version ')[1].split(' ')[0].split('.')
      if (major <= 4 || (major === 5 && minor < 10)) {
        return { status: ERR_STATUS, msg: 'Old version of mono, please upgrade' }
      }
      return { status: 'success' }
    } catch (parsingErr) {
      return { status: ERR_STATUS, msg: 'error parsing mono version, please contact us' }
    }
  } catch (monoOutputErr) {
    var brew = require('fs')
    if (brew.existsSync('/usr/local/bin/mono')) {
      console.error('brew is installed && error executing mono --version from terminal\n', monoOutputErr)
      return { status: ERR_STATUS, msg: `Mono was installed using brew, please install it using tha package. \n Check https://docs.zenprotocol.com/preparation/installers \n${monoOutputErr}` }
    } else{
      console.error('error executing mono --version from terminal\n', monoOutputErr)
      return { status: ERR_STATUS, msg: `please install mono\n${monoOutputErr}` }
    }
  }
}

function monoPath() {
  return !isOsx() ? 'mono' : '/Library/Frameworks/Mono.framework/Versions/Current/Commands/mono'
}
