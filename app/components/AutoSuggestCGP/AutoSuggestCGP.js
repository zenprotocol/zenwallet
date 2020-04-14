import React, { Component } from 'react'
import Flexbox from 'flexbox-react'
import ReactAutosuggest from 'react-autosuggest'
import cx from 'classnames'
import { observer } from 'mobx-react'

import PasteButton from '../PasteButton'
import FontAwesomeIcon from '../../vendor/@fortawesome/react-fontawesome'
import { truncateString } from '../../utils/helpers'

const getSuggestionValue = suggestion => suggestion.address
const renderSuggestion = suggestion => (
  <div className="suggestionItem" data-test="suggestionItem">
    {truncateString(suggestion.ballot, 10, 10)}
  </div>
)
const shouldRenderSuggestions = () => true


type Props = {
  initialSuggestionInputValue: ?string,
  currentBallot: ?string,
  suggestionArray: [],
  onUpdateParent: () => {},
  title: ?string
};

@observer
class AutoSuggestCGP extends Component<Props> {
  // eslint-disable-next-line react/default-props-match-prop-types
  static defaultProps = { initialSuggestionInputValue: '' }
  state = {
    suggestionInputValue: this.props.initialSuggestionInputValue,
    suggestions: [],
  }
  onSuggestionSelected = (event, { suggestion }) => {
    this.setState({
      suggestionInputValue: suggestion.ballot,
    })
  }

  getSuggestions = (value = '') => {
    const { suggestionArray } = this.props
    const searchQuery = value.trim().toLowerCase()
    if (this.isValid(searchQuery)) {
      return []
    }
    return suggestionArray.filter(contract =>
      (contract.ballot.toLowerCase().indexOf(searchQuery) > -1))
  }

  onChange = (evt, { newValue, method }) => {
    const userPressedUpOrDown = (method === 'down' || method === 'up')
    if (userPressedUpOrDown) {
      return
    }
    this.setState({
      suggestionInputValue: newValue,
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
      this.props.onUpdateParent('')
      return
    }
    const { ballot } = this.getChosen()
    this.props.onUpdateParent(ballot)
  }

  getChosen(query = this.state.suggestionInputValue) {
    return this.props.suggestionArray.find(c => c.ballot === query)
  }

  getError() {
    const { suggestions, suggestionInputValue } = this.state
    if (this.isValid() || (suggestions.length > 0) || (suggestionInputValue.length === 0)) {
      return false
    }
    if (this.props.currentBallot) return false
    return 'Suggestion not found'
  }

  isValid(query = this.state.suggestionInputValue) {
    return !!this.getChosen(query)
  }

  onPaste = (clipboardContents) => {
    if (!clipboardContents) {
      return
    }
    this.setState({
      suggestionInputValue: clipboardContents,
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

  render() {
    const {
      suggestionInputValue, suggestions,
    } = this.state
    const { currentBallot } = this.props
    const inputProps = {
      type: 'search',
      placeholder: 'Select one of the candidates payout ballot ID',
      value: currentBallot || suggestionInputValue,
      className: cx('full-width', {
        'is-valid': this.isValid(),
        error: !!this.getError(),
      }),
      onChange: this.onChange,
      'data-test': 'input',
    }
    return (
      <Flexbox flexDirection="column" className="contract-address form-row">
        <label htmlFor="commit">{this.props.title}</label>
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
            <FontAwesomeIcon
              className="chosenCGP"
              icon={['fal', 'angle-down']}
            />
            {this.renderErrorMessage()}
          </Flexbox>
          <PasteButton className="button-on-right" onClick={this.onPaste} />
        </Flexbox>
      </Flexbox>
    )
  }
}

export default AutoSuggestCGP
