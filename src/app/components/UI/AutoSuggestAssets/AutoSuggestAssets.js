import React,{Component} from 'react'
import autobind from 'class-autobind'
import PropTypes from 'prop-types'
import {inject, observer} from 'mobx-react'
import Flexbox from 'flexbox-react'
import Autosuggest from 'react-autosuggest'

import {truncateString} from '../../../../utils/helpers'

@inject('balances')
@observer
class AutoSuggestAssets extends Component {
  constructor() {
    super()

    this.state = {
			suggestionValue: '',
			suggestions: [],
			assetError: ''
		}

    autobind(this)
  }

  static propTypes = {
    className: PropTypes.string
  }

  componentDidMount() {
    const {asset} = this.props
    if (asset) {
      this.setState({suggestionValue: asset})
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.status === 'success') { this.setState({suggestionValue: ''}) }
  }  

  updateParent = (asset) => {
    this.props.sendData(asset)
  }

  getSuggestionValue = suggestion => suggestion.asset

  renderSuggestion = suggestion => (
    <div className='suggestionItem'>
      {suggestion.name} ({truncateString(suggestion.asset)})
    </div>
  )

  onSuggestionSelected = (event, {suggestion}) => {
    const {suggestionValue} = this.state
    this.setState({suggestionValue: suggestion.asset})
    this.updateParent(suggestion.asset)
  }

  onChange = (event, { newValue, method }) => {
    const {suggestionValue} = this.state
    const val = newValue.trim()

    const userPressedUpOrDown = (method === 'down' || method === 'up')
    if (!userPressedUpOrDown) { this.setState({suggestionValue: val})	}

    const suggestions = this.getSuggestions(val)
    this.setState({assetError: (suggestions.length === 0 && val != '')})
  }

  onAssetBlur = () => {
    const {suggestionValue} = this.state
    const val = suggestionValue.trim()
    const suggestions = this.getSuggestions(val)

    if (suggestions.length === 1 && suggestions[0].asset === val) {
      this.updateParent(val)
    }

    if (suggestions.length === 0 && val != '') {
      this.updateParent('')
      this.setState({assetError: false, suggestionValue: ''})
    }
  }

  getSuggestions = value => {
    const {balances} = this.props
    balances.searchQuery = value
    return balances.filtered
  }

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({ suggestions: this.getSuggestions(value) })
  }

  onSuggestionsClearRequested = () => {
    this.setState({suggestions: []})
  }

  shouldRenderSuggestions = (value) => {
    const suggestions = this.getSuggestions(value)
    return !(suggestions.length === 1 && suggestions[0].asset === value)
  }

  renderErrorMessage() {
    const {assetError} = this.state
    if (assetError) {
      return (
        <div className='error-message'>
          <i className="fa fa-exclamation-circle"></i>
          <span>You don't have such an asset</span>
        </div>
      )
    }
  }

  render() {
    const {suggestionValue, suggestions, assetError} = this.state
    const assetClassNames = (assetError ? 'full-width error' : 'full-width' )

    const inputProps = {
      type: 'search',
      placeholder: 'Start typing the asset name',
      value: suggestionValue,
      className: assetClassNames,
      onChange: this.onChange,
      onBlur: this.onAssetBlur
    }

    return (
      <Flexbox flexGrow={1} flexDirection="column" className="select-asset">
        <label htmlFor="asset">Asset</label>

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

    )
  }
}

export default AutoSuggestAssets
