// @flow

import swal from 'sweetalert'

export default function voteOnceModal() {
  const container = document.createElement('div')
  container.className = 'vote-once-modal-content'
  container.innerHTML = `
    <div class="align-left" style="white-space: nowrap;">
      <p>
        <span>Each month the community may vote for:</span><br />
        <ul>
          <li>The amount of ZP allocated to the CGP</li>
          <li>The recipient of the PayoutTx</li>
        </ul>
        <br />
        You vote separately for each, only the first vote counts.
      </p>
      <br />
      <p>
        The weight of your vote is a function of: <br />
        <ul>
          <li>Your ZP balance at the snapshot block</li>
          <li>The total amount of ZP which participated in the vote</li>
        </ul>
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
