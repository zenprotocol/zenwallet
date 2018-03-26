import {createMemoryHistory} from 'history'

const history = createMemoryHistory({
  initialEntries: ['/'],
  initialIndex: 0
})

export default history
