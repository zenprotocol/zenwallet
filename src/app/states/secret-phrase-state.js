import {observable, action, runInAction} from 'mobx'
import {postImportWallet} from '../services/api-service'

class SecretPhraseState {
  mnemonicPhrase = observable.array([])
  @observable password = ''
  @observable autoLogoutMinutes = 30
  @observable inprogress = ''
  @observable importError = ''
  @observable status = ''

  @action
  async importWallet(contractMessage) {

		const wordsArray = this.mnemonicPhrase.map(word => (word.word))

    try {
      const response = await postImportWallet(wordsArray, this.password)

      runInAction(() => {
        console.log('importWallet response', response)
        this.password = ''
        this.mnemonicPhrase.replace([])
      })

    } catch (error) {
      runInAction(() => {
        try {
          console.log('importWallet error.response', error.response)
        } catch (e) {
          console.log('importWallet catch e', e)
        }
      })
    }

  }

}

export default SecretPhraseState
