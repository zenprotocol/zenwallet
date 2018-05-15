import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import '../app/fontawesome'

Enzyme.configure({ adapter: new Adapter() })

global.sel = sel
global.changeInputValue = changeInputValue
global.flushAllPromises = flushAllPromises

// find labeled elements in the wrapper:
// const tagInput = wrapper.find(sel('tags'))
function sel(id) {
  return `[data-test="${id}"]`
}

// call this on a wrapper of input node, usually by
// calling const input = sel('input')
function changeInputValue(input, value) {
  input.simulate('change', { target: { value } })
}

// wait until the next tick so resolved promises chains will continue
function flushAllPromises() {
  return new Promise(resolve => setImmediate(resolve))
}
