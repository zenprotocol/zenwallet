import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import autobind from 'class-autobind'
import {Link} from 'react-router-dom'
import Flexbox from 'flexbox-react'
import Layout from '../UI/Layout/Layout'
import {truncateString, normalizeTokens} from '../../../utils/helpers'
const {clipboard} = require('electron')

@inject('balances')
@observer
class Balances extends Component {
  constructor() {
    super()
    this.state = {
      copyText: 'Copy'
    }
    autobind(this)
  }

  componentDidMount() {
    const {balances} = this.props
    balances.fetch()
  }

  copyToClipboard = (string) => {
    clipboard.writeText(string)
    this.setState({copyText: 'Copied to Clipboard'})
    setTimeout(() => {
      this.setState({copyText: 'Copy'})
    }, 1250)
  }

  render() {
    const {balances} = this.props
    const {copyText} = this.state

    const balancesRows = balances.assets.map(asset => {
      const assetName = balances.getAssetName(asset.asset)
      let fullBalanceForTitle
      if (assetName == 'ZENP') {
        fullBalanceForTitle = `${asset.balance.toLocaleString()} Kalapas`
      } else {
        fullBalanceForTitle = asset.balance.toLocaleString()
      }
      const truncatedAsset = truncateString(asset.asset)
      return (
        <tr key={asset.asset}>
          <td className='align-left text' title={assetName} >{assetName}</td>
          <td className='align-left copyable' title={asset.asset} >

            <span title={asset.asset} >{truncatedAsset} </span>
            <span
              onClick={()=>{this.copyToClipboard(asset.asset)}}
              data-balloon={copyText}
              data-balloon-pos='up'>
              <i className="fa fa-copy" ></i>
            </span>

          </td>
          <td className='bright-blue' title={fullBalanceForTitle} >{normalizeTokens(asset.balance)}</td>
          <td className='align-right' >
            <Link className='button small' to={`/send-tx/${asset.asset}`} >Send</Link>
          </td>
        </tr>
      )
    })

    return (
      <Layout className="balances">

        <Flexbox className='page-title'>
          <h1>Portfolio</h1>
        </Flexbox>

        <Flexbox className="balance-list">
          <table>
            <thead>
              <tr>
                <th className='align-left'>Asset Name</th>
                <th className='align-left'>Hash</th>
                <th className='align-left'>Balance</th>
                <th className='align-right'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {balancesRows}
            </tbody>
          </table>
        </Flexbox>

    </Layout>
  )
}
}

export default Balances
