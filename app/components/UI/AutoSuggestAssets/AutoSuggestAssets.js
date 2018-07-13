import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import Flexbox from 'flexbox-react'
import Autosuggest from 'react-autosuggest'
import cx from 'classnames'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import { truncateString } from '../../../utils/helpers'

const getSuggestionValue = suggestion => suggestion.asset

@inject('balances')
@observer
class AutoSuggestAssets extends Component {
  static propTypes = {
    asset: PropTypes.string.isRequired,
    balances: PropTypes.shape({
      assets: PropTypes.arrayOf(PropTypes.shape({
        asset: PropTypes.string.isRequired,
      }).isRequired).isRequired,
      filteredBalances: PropTypes.func.isRequired,
      getAssetName: PropTypes.func.isRequired,
    }).isRequired,
    onUpdateParent: PropTypes.func.isRequired,
  }
  state = {
    suggestionInputValue: this.props.asset,
    suggestions: [],
  }
  // used by parent
  reset() {
    this.setState({ suggestionInputValue: '' })
  }
  renderSuggestion = suggestion => (
    <div className="suggestionItem">
      {suggestion.name} ({truncateString(suggestion.asset)})
    </div>
  )

  onSuggestionSelected = (evt, { suggestion }) => {
    this.setState({
      suggestionInputValue: suggestion.asset,
    }, this.updateParent)
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
  updateParent = () => {
    if (!this.isValid()) {
      this.props.onUpdateParent({ asset: '' })
      return
    }
    const { asset } = this.getChosenAsset()
    this.props.onUpdateParent({ asset })
  }
  // TODO refactor to getter
  getChosenAsset() {
    return this.props.balances.assets.find(a => a.asset === this.state.suggestionInputValue)
  }

  getSuggestions = query => {
    const filtered = this.props.balances.filteredBalances(query)
    if (filtered.length === 1 && filtered[0].asset === query) {
      return []
    }
    return filtered
  }

  onSuggestionsFetchRequested = ({ value: query }) => {
    this.setState({ suggestions: this.getSuggestions(query) })
  }

  onSuggestionsClearRequested = () => {
    this.setState({ suggestions: [] })
  }

  shouldRenderSuggestions = () => true

  hasError() {
    const { suggestions, suggestionInputValue } = this.state
    return !this.isValid() && (suggestions.length === 0) && (suggestionInputValue.length > 0)
  }
  isValid() {
    const { suggestionInputValue } = this.state
    return this.props.balances.assets.find(a => a.asset === suggestionInputValue)
  }
  renderErrorMessage() {
    if (!this.hasError()) {
      return null
    }
    return (
      <div className="input-message error">
        <FontAwesomeIcon icon={['far', 'exclamation']} />
        <span>You don&apos;t have such an asset</span>
      </div>
    )
  }

  renderChosenAssetName() {
    // TODO get name directly from chosen asset, no need to go through balances
    const chosenAssetName = this.props.balances.getAssetName(this.state.suggestionInputValue)
    if (chosenAssetName) {
      return (
        <div className="chosenAssetName">{chosenAssetName}</div>
      )
    }
  }

  render() {
    const {
      suggestionInputValue, suggestions,
    } = this.state
    const inputProps = {
      type: 'search',
      placeholder: 'Start typing the asset name',
      value: suggestionInputValue,
      className: cx('full-width', {
        'is-valid': this.isValid(),
        error: this.hasError(),
      }),
      onChange: this.onChange,
    }

    return (
      <Flexbox flexGrow={1} flexDirection="column" className="select-asset">
        <label htmlFor="asset">Asset</label>

        <Autosuggest
          suggestions={suggestions}
          onSuggestionSelected={this.onSuggestionSelected}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={this.renderSuggestion}
          shouldRenderSuggestions={this.shouldRenderSuggestions}
          inputProps={inputProps}
        />
        {this.renderChosenAssetName()}
        {this.renderErrorMessage()}
      </Flexbox>

    )
  }
}

export default AutoSuggestAssets
