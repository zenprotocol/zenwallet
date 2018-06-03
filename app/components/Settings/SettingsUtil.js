import swal from 'sweetalert'

import { postWalletMnemonicphrase } from '../../services/api-service'


// eslint-disable-next-line import/prefer-default-export
export const showSeed = async (password: string) => {
  const seedString = await postWalletMnemonicphrase(password)
  const submittedPassword = await swal({
    content: {
      element: 'input',
      attributes: {
        placeholder: 'Type your password',
        type: 'password',
      },
    },
  })
  if (submittedPassword !== password) {
    swal('wrong password!')
  } else {
    swal({
      title: 'Your Mnemonic Passphrase (seed)',
      text: 'Write down the following words in chronological order and save it in a secure place.',
      content: getShowSeedNode(seedString.split(' ')),
      className: 'secret-phrase-container',
    })
  }
}


function getShowSeedNode(seedWords) {
  const wrapper = document.createElement('ol')
  wrapper.className = 'passphrase'
  const listItemsNodes = [...Array(seedWords.length).keys()]
    .map(idx => getListItem(seedWords[idx]))
  listItemsNodes.forEach(el => wrapper.appendChild(el))
  return wrapper
}

function getListItem(seedWord) {
  const li = document.createElement('li')
  li.innerHTML = seedWord
  return li
}

