export const OSX = 'darwin'
export const WINDOWS = 'win32'
export const LINUX = 'linux'

export const isOsx = () => process.platform === OSX
export const isWindows = () => process.platform === WINDOWS
export const isLinux = () => process.platform === LINUX
