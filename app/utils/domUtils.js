export const isAnyInputActive = () => document.activeElement.tagName === 'INPUT'
export const ref = function ref(str) {
  return function refInner(el) {
    if (!this) {
      throw new Error(`this is undefined for ref(${str}), add .bind(this) when calling ref function, i.e. ref('someEl').bind(this)`)
    }
    this[str] = el
  }
}
