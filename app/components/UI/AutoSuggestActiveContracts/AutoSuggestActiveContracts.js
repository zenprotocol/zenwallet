import React, { Component } from 'react'
import Flexbox from 'flexbox-react'
import ReactAutosuggest from 'react-autosuggest'
import cx from 'classnames'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { clipboard } from 'electron'

import { truncateString } from '../../../utils/helpers'

const getSuggestionValue = suggestion => suggestion.address
const renderSuggestion = suggestion => (
  <div className="suggestionItem" data-test="suggestionItem">
    {suggestion.name} ({truncateString(suggestion.address)})
  </div>
)
const shouldRenderSuggestions = () => true

type Contract = {
  contractId: string,
  address: string,
  code: string,
  name: ?string
};

type Props = {
  initialSuggestionInputValue: ?string,
  activeContracts: Array<Contract>,
  savedContracts: Array<Contract>,
  onUpdateParent: () => {}
};

class AutoSuggestActiveContracts extends Component<Props> {
  static defaultProps = { initialSuggestionInputValue: '' }
  state = {
    suggestionInputValue: this.props.initialSuggestionInputValue,
    suggestions: [],
  }
  onSuggestionSelected = (event, { suggestion }) => {
    this.setState({
      suggestionInputValue: suggestion.address,
    })
  }

  getSuggestions = (value = '') => {
    const { activeContracts } = this.props
    const searchQuery = value.trim().toLowerCase()
    if (this.isValid(searchQuery)) {
      return []
    }
    return activeContracts.filter(contract =>
      (contract.name.toLowerCase().indexOf(searchQuery) > -1) ||
      (contract.address.toLowerCase().indexOf(searchQuery) > -1))
  }

  onChange = (evt, { newValue, method }) => {
    const userPressedUpOrDown = (method === 'down' || method === 'up')
    if (userPressedUpOrDown) {
      return
    }
    this.setState({
      suggestionInputValue: newValue.trim(),
    }, this.updateParent)
  }

  onSuggestionsFetchRequested = ({ value: query }) => {
    this.setState({ suggestions: this.getSuggestions(query) })
  }

  onSuggestionsClearRequested = () => {
    this.setState({ suggestions: [] })
  }

  updateParent = () => {
    if (!this.isValid()) {
      this.props.onUpdateParent({ address: '' })
      return
    }
    const { address } = this.getChosenContract()
    this.props.onUpdateParent({ address })
  }

  getChosenContract(query = this.state.suggestionInputValue) {
    return this.props.activeContracts.find(c => c.address === query)
  }

  getError() {
    const { suggestions, suggestionInputValue } = this.state
    const { savedContracts } = this.props
    if (this.isValid() || (suggestions.length > 0) || (suggestionInputValue.length === 0)) {
      return false
    }
    const matchingSavedContract = savedContracts.find(sc => sc.address === suggestionInputValue)
    if (matchingSavedContract) {
      return 'Contract is not active'
    }
    return 'Contract address doesn\'t exist'
  }

  isValid(query = this.state.suggestionInputValue) {
    return !!this.getChosenContract(query)
  }

  onPaste = () => {
    if (!clipboard.readText()) {
      return
    }
    this.setState({
      suggestionInputValue: clipboard.readText().trim(),
    }, this.updateParent)
  }

  // used by parent
  reset() {
    this.setState({ suggestionInputValue: '' })
  }

  renderErrorMessage() {
    const error = this.getError()
    if (!error) {
      return null
    }
    return (
      <div className="input-message error" data-test="error">
        <FontAwesomeIcon icon={['far', 'exclamation']} />
        <span>{error}</span>
      </div>
    )
  }

  renderChosenContractName() {
    if (!this.isValid()) {
      return null
    }
    const { name } = this.getChosenContract()
    if (name) {
      return (
        <div className="chosenContractName">{name}</div>
      )
    }
  }

  render() {
    const {
      suggestionInputValue, suggestions,
    } = this.state
    const inputProps = {
      type: 'search',
      placeholder: 'Start typing the contract name or address',
      value: suggestionInputValue,
      className: cx('full-width', {
        'is-valid': this.isValid(),
        error: !!this.getError(),
      }),
      onChange: this.onChange,
      'data-test': 'input',
    }
    return (
      <Flexbox flexDirection="column" className="contract-address form-row">
        <label htmlFor="to">Contract Address</label>
        <Flexbox flexDirection="row" className="destination-address-input">
          <Flexbox flexDirection="column" className="full-width select-contract">
            <ReactAutosuggest
              suggestions={suggestions}
              onSuggestionSelected={this.onSuggestionSelected}
              onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
              onSuggestionsClearRequested={this.onSuggestionsClearRequested}
              getSuggestionValue={getSuggestionValue}
              renderSuggestion={renderSuggestion}
              shouldRenderSuggestions={shouldRenderSuggestions}
              inputProps={inputProps}
            />
            {this.renderChosenContractName()}
            {this.renderErrorMessage()}
          </Flexbox>
          <button className="button secondary button-on-right" onClick={this.onPaste}>Paste</button>
        </Flexbox>
      </Flexbox>
    )
  }
}

export default AutoSuggestActiveContracts
