import React,{Component} from 'react'
import autobind from 'class-autobind'
import PropTypes from 'prop-types'
import {inject, observer} from 'mobx-react'
import Flexbox from 'flexbox-react'
import Autosuggest from 'react-autosuggest'
import {clipboard} from 'electron'
import bech32 from 'bech32'

import {truncateString} from '../../../../utils/helpers'
import db from '../../../services/store'

const savedContracts = db.get('savedContracts').value()

class AutoSuggestSavedContracts extends Component {
  constructor() {
    super()

    this.state = {
			suggestionValue: '',
			suggestions: [],
			assetError: false
		}

    autobind(this)
  }

  componentDidMount() {
    const {address} = this.props
    if (address) {
      this.setState({suggestionValue: address})
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.status === 'success') { this.setState({suggestionValue: ''}) }
  }

  updateParent = (address) => {
    this.props.sendData(address)
  }

  getSuggestionValue = suggestion => suggestion.address

  renderSuggestion = suggestion => (
    <div className='suggestionItem'>
      {suggestion.name} ({truncateString(suggestion.address)})
    </div>
  )

  onSuggestionSelected = (event, {suggestion}) => {
    const {suggestionValue} = this.state
    this.setState({suggestionValue: suggestion.address})
    this.updateParent(suggestion.address)
  }

  getSuggestions = value => {
    const {balances} = this.props
    const searchQuery = value.trim().toLowerCase()
    const inputLength = searchQuery.length

    if (inputLength === 0) {
      return savedContracts
    } else {
      return savedContracts.filter(contract =>
        (contract.name.toLowerCase().indexOf(searchQuery) > -1) ||
        (contract.address.toLowerCase().indexOf(searchQuery) > -1)
      )
    }
  }

  onChange = (event, { newValue, method }) => {
    console.log('onChange newValue', newValue)
    const val = newValue.trim()

    const userPressedUpOrDown = (method === 'down' || method === 'up')
    if (!userPressedUpOrDown) { this.setState({suggestionValue: val}) }

    const suggestions = this.getSuggestions(val)
    this.setState({assetError: (suggestions.length === 0 && !this.validateAddress(val))})
  }

  onAssetBlur = (e) => {
    const val = e.target.value.trim()
    const suggestions = this.getSuggestions(val)

    if (suggestions.length === 1 && suggestions[0].asset === val) {
      this.updateParent(val)
    }

    if (!this.validateAddress(val)) {
      // this.updateParent('')
      // this.setState({assetError: false, suggestionValue: ''})
    }

  }

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({ suggestions: this.getSuggestions(value) })
  }

  onSuggestionsClearRequested = () => {
    this.setState({suggestions: []})
  }

  shouldRenderSuggestions = (value) => {
    const suggestions = this.getSuggestions(value)
    return !(suggestions.length === 1 && suggestions[0].address === value)
  }

  renderErrorMessage() {
    const {assetError} = this.state
    if (assetError) {
      return (
        <div className='error-message'>
          <i className="fa fa-exclamation-circle"></i>
          <span>Contract address is invalid</span>
        </div>
      )
    }
  }

  onPasteClicked() {
    this.setState({suggestionValue: clipboard.readText()})
  }

  validateAddress(value) {
	  try {
	    const decodedAddress = bech32.decode(value)
	    const pkHash = bech32.fromWords(decodedAddress.words)
      const prefix = decodedAddress.prefix
      return (pkHash.length === 33 && (prefix === 'tc' || prefix === 'zc'))
	  } catch (e) {
      return false
	  }
	}

  render() {
    const {suggestionValue, suggestions, assetError} = this.state
    const classNames = (assetError ? 'full-width error' : 'full-width' )

    const inputProps = {
      type: 'search',
      placeholder: 'Start typing the contract name or address',
      value: suggestionValue,
      className: classNames,
      onChange: this.onChange,
      onBlur: this.onAssetBlur
    }

    return (

      <Flexbox flexDirection="column" className="contract-address form-row">

        <label htmlFor='to'>Contract Address</label>
        <Flexbox flexDirection="row" className='destination-address-input'>

          <Flexbox flexDirection="column" className='full-width'>
            <Autosuggest
              suggestions={suggestions}
              onSuggestionSelected={this.onSuggestionSelected}
              onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
              onSuggestionsClearRequested={this.onSuggestionsClearRequested}
              getSuggestionValue={this.getSuggestionValue}
              renderSuggestion={this.renderSuggestion}
              shouldRenderSuggestions={this.shouldRenderSuggestions}
              inputProps={inputProps}
            />
            {this.renderErrorMessage()}
          </Flexbox>

          <button className="button secondary button-on-right" onClick={this.onPasteClicked}>Paste</button>
        </Flexbox>

      </Flexbox>

    )
  }
}

export default AutoSuggestSavedContracts
