// @flow

import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import Flexbox from 'flexbox-react'
import Autosuggest from 'react-autosuggest'
import cx from 'classnames'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import { truncateString } from '../../utils/helpers'
import PortfolioStore from '../../stores/portfolioStore'

const getSuggestionValue = suggestion => suggestion.asset

type Asset = {
  asset: string,
  name: string
};

type Props = {
  asset: string,
  portfolioStore: PortfolioStore,
  onUpdateParent: ({ asset: string }) => void
};

type State = {
  suggestionInputValue: string,
  suggestions: Array<Asset>
};

@inject('portfolioStore')
@observer
class AutoSuggestAssets extends Component<Props, State> {
  state = {
    suggestionInputValue: this.props.asset,
    suggestions: [],
  }
  // used by parent
  reset() {
    this.setState({ suggestionInputValue: '' })
  }
  renderSuggestion = (suggestion: Asset) => (
    <div className="suggestionItem">
      {suggestion.name} ({truncateString(suggestion.asset)})
    </div>
  )

  onSuggestionSelected = (
    evt: SyntheticMouseEvent<HTMLInputElement>,
    { suggestion }: { suggestion: Asset },
  ) => {
    this.setState({
      suggestionInputValue: suggestion.asset,
    }, this.updateParent)
  }

  onChange = (
    evt: SyntheticEvent<HTMLInputElement>,
    { newValue, method }: { newValue: string, method: string },
  ) => {
    const userPressedUpOrDown = (method === 'down' || method === 'up')
    if (userPressedUpOrDown) {
      return
    }
    this.setState({
      suggestionInputValue: newValue.trim(),
    }, this.updateParent)
  }
  updateParent = () => {
    if (!this.isValid) {
      this.props.onUpdateParent({ asset: '' })
      return
    }
    const { asset } = this.getChosenAsset
    this.props.onUpdateParent({ asset })
  }
  get getChosenAsset() {
    return this.props.portfolioStore.assets.find(a => a.asset === this.state.suggestionInputValue)
  }

  getSuggestions = (value: string) => {
    const filtered = this.props.portfolioStore.filteredBalances(value)
    return this.valueIsExactMatch(value) ? [] : filtered
  }

  valueIsExactMatch(value: string) {
    const filtered = this.props.portfolioStore.filteredBalances(value)
    return filtered.length === 1 && filtered[0].asset === value
  }

  // eslint-disable-next-line react/no-unused-prop-types
  onSuggestionsFetchRequested = ({ value }: { value: string }) => {
    this.setState({ suggestions: this.getSuggestions(value) })
  }

  onSuggestionsClearRequested = () => {
    this.setState({ suggestions: [] })
  }

  shouldRenderSuggestions = () => true

  get hasError() {
    const { suggestions, suggestionInputValue } = this.state
    return !this.isValid && (suggestions.length === 0) && (suggestionInputValue.length > 0)
  }
  get isValid() {
    return !!this.getChosenAsset
  }
  renderErrorMessage() {
    if (!this.hasError) {
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
    const chosenAssetName = this.props.portfolioStore.getAssetName(this.state.suggestionInputValue)
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
        'is-valid': this.isValid,
        error: this.hasError,
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
