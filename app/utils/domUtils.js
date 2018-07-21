export const getActiveElement = () => document.activeElement
export const isAnyInputActive = () => getActiveElement().tagName === 'INPUT'
