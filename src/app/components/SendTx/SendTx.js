import React, {Component} from 'react'
import autobind from 'class-autobind'
import {Link} from 'react-router-dom'
import Flexbox from 'flexbox-react'
import DevTools from 'mobx-react-devtools'
import {inject, observer} from 'mobx-react'

import {toInteger} from 'lodash'

import Layout from '../UI/Layout/Layout'

@inject('transaction')
@observer
class SendTx extends Component {

    constructor() {
        super()
        autobind(this)
    }

    onRecipientAddressChanged(event) {
        const {transaction} = this.props

        transaction.to = event.target.value
    }

    onAmountChanged(event) {
        const {transaction} = this.props

        if (event.target.value)
            transaction.amount = toInteger(event.target.value)
        else
            transaction.amount = undefined
    }

    onCreateTransactionClicked() {
        const {transaction} = this.props
        transaction.createTransaction(transaction)
    }

    render() {
      const {transaction} = this.props

        return (
            <Layout>
                <div>
                  <span>Recipient Address: </span>
                  <input name="to"
                         type="text"
                         onChange={this.onRecipientAddressChanged}
                         value={transaction.to}/>
                </div>

                <div>
                  <span>Amount: </span>
                  <input name="amount"
                         type="number"
                         placeholder="Enter amount of Zens"
                         value={transaction.amount}
                         onChange={this.onAmountChanged}/>
                </div>
                <a onClick={this.onCreateTransactionClicked}>Send Transaction</a>
            </Layout>
        )

    }
}

export default SendTx
