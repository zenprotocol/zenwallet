import {observable, action} from 'mobx'

class SecretPhraseState {
  mnemonicPhrase = observable.array([])
  @observable password = ''
  @observable passwordConfirmation = ''
  
}

export default SecretPhraseState
