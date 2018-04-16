import React from 'react'
import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types'

import ShowPhraseModal from '../Modals/ShowPhraseModal'
import './ModalContainer.scss'

@inject('modalState')
@observer
class ModalContainer extends React.Component {
  static propTypes = {
    modalState: PropTypes.shape({
      activeModal: PropTypes.oneOf([null, 'ShowPhraseModal']),
    }).isRequired,
  }
  modals = {
    ShowPhraseModal,
  }
  render() {
    const { activeModal } = this.props.modalState
    if (!activeModal) {
      return null
    }
    const Modal = this.modals[activeModal]
    return (
      <div className="modal-container">
        <Modal />
      </div>
    )
  }
}

export default ModalContainer
