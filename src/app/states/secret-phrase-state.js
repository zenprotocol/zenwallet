import {observable, action} from 'mobx'

class SecretPhraseState {
  mnemonicPhrase = observable.array([])
  @observable password = ''
  
}

export default SecretPhraseState
