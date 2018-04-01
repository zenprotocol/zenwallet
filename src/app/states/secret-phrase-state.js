import {observable, action} from 'mobx'

class SecretPhraseState {
  mnemonicPhrase = observable.array([])
}

export default SecretPhraseState
