import React from 'react'
import { mount } from 'enzyme'
import { ipcRenderer } from 'electron'

import WalletModeStore from '../../stores/walletModeStore'
import history from '../../services/history'
import routes from '../../constants/routes'
import { IPC_SHUT_DOWN_ZEN_NODE, IPC_START_ZEN_NODE } from '../../ZenNode'
import { withHistoryAndState } from '../../../test/mountHelpers'

import { ChooseWalletMode } from './ChooseWalletMode'

jest.mock('electron', () => ({
  ipcMain: {
    send: jest.fn(),
  },
  ipcRenderer: {
    send: jest.fn(),
    on: jest.fn(),
  },
}))

const pushSpy = jest.spyOn(history, 'push')

describe('ChooseWalletMode', () => {
  const walletModeStore = new WalletModeStore()
  const ChooseWalletModeWithHistory = withHistoryAndState(ChooseWalletMode)
  let component
  describe('when wallet Full node is clicked', () => {
    beforeEach(() => {
      walletModeStore.mode = 'Light'
      component = mount(<ChooseWalletModeWithHistory walletModeStore={walletModeStore} />)
      pushSpy.mockReset()
      ipcRenderer.send.mockReset()
      component.find('.full-node').simulate('click')
    })

    it('navigates to the import or create route', () => {
      expect(pushSpy).toHaveBeenCalledWith(routes.IMPORT_OR_CREATE_WALLET)
    })

    it('sends Start zen signal to ipcRenderer', () => {
      expect(ipcRenderer.send).toHaveBeenCalledWith(IPC_START_ZEN_NODE)
    })
  })

  describe('when wallet Light wallet is clicked', () => {
    beforeEach(() => {
      walletModeStore.mode = 'Full'
      component = mount(<ChooseWalletModeWithHistory walletModeStore={walletModeStore} />)
      pushSpy.mockReset()
      ipcRenderer.send.mockReset()
      component.find('.light-wallet').simulate('click')
    })

    it('navigates to the import or create route', () => {
      expect(pushSpy).toHaveBeenCalledWith(routes.IMPORT_OR_CREATE_WALLET)
    })

    it('sends Start zen signal to ipcRenderer', () => {
      expect(ipcRenderer.send).toHaveBeenCalledWith(IPC_SHUT_DOWN_ZEN_NODE)
    })
  })
})
