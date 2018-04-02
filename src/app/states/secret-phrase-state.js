import {observable, action} from 'mobx'

class SecretPhraseState {
  mnemonicPhrase = observable.array([])
  @observable password = ''
  @observable autoLogoutMinutes = 30
  
}

export default SecretPhraseState
