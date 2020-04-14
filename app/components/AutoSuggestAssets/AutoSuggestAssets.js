// @flow

import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import Flexbox from 'flexbox-react'
import Autosuggest from 'react-autosuggest'
import cx from 'classnames'

import FontAwesomeIcon from '../../vendor/@fortawesome/react-fontawesome'
import { truncateString } from '../../utils/helpers'
import PortfolioStore from '../../stores/portfolioStore'
import CgpStore from '../../stores/cgpStore'

const getSuggestionValue = suggestion => suggestion.asset

type Asset = {
  asset: string,
  name: string
};

type Props = {
  asset: string,
  portfolioStore: PortfolioStore,
  cgpStore: CgpStore,
  onUpdateParent: ({ asset: string }) => void,
  showLabel: boolean,
  cgp: boolean,
  disable: boolean,
  cgpAssetAmountsIndex: number,
  className: string,
  title: string
};

type State = {
  suggestionInputValue: string,
  suggestions: Array<Asset>
};

@inject('portfolioStore', 'cgpStore')
@observer
class AutoSuggestAssets extends Component<Props, State> {
  state = {
    suggestionInputValue: this.props.asset,
    suggestions: [],
  }

  componentDidUpdate() {
    if (this.props.cgp && this.isCGPValid) {
      // for cgp - if one of the other selected assets change, and this asset had the same
      this.updateParent()
    }
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
    this.setState(
      {
        suggestionInputValue: suggestion.asset,
      },
      this.updateParent,
    )
  }

  onChange = (
    evt: SyntheticEvent<HTMLInputElement>,
    { newValue, method }: { newValue: string, method: string },
  ) => {
    const userPressedUpOrDown = method === 'down' || method === 'up'
    if (userPressedUpOrDown) {
      return
    }
    this.setState(
      {
        suggestionInputValue: newValue.trim(),
      },
      this.updateParent,
    )
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
    if (this.props.cgp) {
      return this.props.cgpStore.assets.find(a => a.asset === this.state.suggestionInputValue)
    }
    return this.props.portfolioStore.assets.find(a => a.asset === this.state.suggestionInputValue)
  }

  filterOutCGPSelectedSpends = (items: Array) =>
    items.filter(item =>
      this.props.cgpStore.assetAmountsPure.every(spend => spend.asset !== item.asset))

  getSuggestions = (value: string) => {
    const filtered = this.props.cgp
      ? this.filterOutCGPSelectedSpends(this.props.cgpStore.filteredBalances(value))
      : this.props.portfolioStore.filteredBalances(value)
    return this.valueIsExactMatch(value) ? [] : filtered
  }

  valueIsExactMatch(value: string) {
    const filtered = this.props.cgp
      ? this.props.cgpStore.filteredBalances(value)
      : this.props.portfolioStore.filteredBalances(value)
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
    return !this.isValid && suggestions.length === 0 && suggestionInputValue.length > 0
  }
  get isValid() {
    return this.props.cgp ? this.isCGPValid : !!this.getChosenAsset
  }
  get isCGPValid() {
    const {
      cgpStore: { assetAmountsPure },
      cgpAssetAmountsIndex,
    } = this.props
    const chosenAsset = this.getChosenAsset

    return (
      chosenAsset &&
      ((cgpAssetAmountsIndex < assetAmountsPure.length &&
        chosenAsset.asset &&
        assetAmountsPure[cgpAssetAmountsIndex].asset === chosenAsset.asset) ||
        assetAmountsPure.every(spend => spend.asset !== chosenAsset.asset))
    )
  }
  renderErrorMessage() {
    if (!this.hasError) {
      return null
    }
    const { cgp, cgpStore: { assetAmountsPure } } = this.props
    const chosenAsset = this.getChosenAsset
    const cgpAssetAlreadyUsed = cgp &&
      chosenAsset &&
      chosenAsset.asset &&
      assetAmountsPure.some(item => item.asset === chosenAsset.asset)

    const cgpMessage = cgpAssetAlreadyUsed ? (
      <span>This asset has already been selected</span>
    ) : (
      <span>The cgp doesn&apos;t hold this asset</span>
    )

    return (
      <div className="input-message error">
        <FontAwesomeIcon icon={['far', 'exclamation']} />
        {cgp ? cgpMessage : (
          <span>You don&apos;t have such an asset</span>
        )}
      </div>
    )
  }

  renderChosenAssetName() {
    const chosenAssetName =
      this.props.portfolioStore.getAssetName(this.state.suggestionInputValue)
    const { showLabel } = this.props
    if (chosenAssetName) {
      return (
        <div className={showLabel ? 'chosenAssetName' : 'chosenAssetNameNoLabel'}>
          {chosenAssetName}
        </div>
      )
    }
  }

  getPlaceHolder() {
    const { title } = this.props
    if (title === undefined) return 'Start typing the asset name'
    else if (title === '') return ''
    return title
  }

  render() {
    const { suggestionInputValue, suggestions } = this.state
    const inputProps = {
      type: 'search',
      placeholder: this.getPlaceHolder(),
      value: suggestionInputValue,
      className: cx('full-width', {
        'is-valid': this.isValid,
        error: this.hasError,
      }, this.props.className),
      onChange: this.onChange,
      disabled: this.props.disable,
    }

    return (
      <Flexbox flexGrow={1} flexDirection="column" className="select-asset">
        {this.props.showLabel && <label htmlFor="asset">Asset</label>}

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

AutoSuggestAssets.defaultProps = {
  // eslint-disable-next-line react/default-props-match-prop-types
  showLabel: true,
  // eslint-disable-next-line react/default-props-match-prop-types
  disable: false,
  // eslint-disable-next-line react/default-props-match-prop-types
  className: '',
  // eslint-disable-next-line react/default-props-match-prop-types
  title: undefined,
}

export default AutoSuggestAssets
