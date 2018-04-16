import { observable, action } from 'mobx'

class ModalState {
  @observable activeModal = null

  @action
  close() {
    this.activeModal = null
  }

  @action
  open(modal) {
    this.activeModal = modal
  }
}

export default ModalState
