// @flow

import swal from 'sweetalert'

export default function voteOnceModal() {
  const container = document.createElement('div')
  container.className = 'vote-once-modal-content'
  container.innerHTML = `
    <div class="align-left" style="white-space: nowrap;">
      <p>
        Your vote weight will consist of your total ZP at snapshot block.
      </p>
    </div>
  `

  return swal({
    title: 'You can only vote once in this phase',
    content: container,
    icon: 'warning',
    buttons: {
      cancel: true,
      confirm: 'Vote',
    },
  })
}
