// @flow
import React from 'react'
import Flexbox from 'flexbox-react'
import Autosuggest from 'react-autosuggest'

export const commands = [
  'buy', 'redeem', 'collateralize', 'exercise',
]

type Props = {
  onChange: (string) => void
};

type State = {
  value: string,
  suggestions: string[]
};

class AutoSuggestContractCommands extends React.Component<Props, State> {
  state = {
    value: '',
    suggestions: commands,
  }

  // $FlowFixMe
  onSuggestionSelected = (event, { suggestion }) => {
    this.setState({ value: suggestion })
    this.props.onChange(suggestion)
  }

  // $FlowFixMe
  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({ suggestions: commands.filter(x => x.includes(value.trim())) })
  }

  onSuggestionsClearRequested = () => {
    this.setState({ suggestions: [] })
  }

  // $FlowFixMe
  getSuggestionValue = (value) => value

  // $FlowFixMe
  renderSuggestion = suggestion => (
    <div className="suggestionItem">
      {suggestion}
    </div>
  )

  // $FlowFixMe
  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue,
    })
  };

  render() {
    const { value, suggestions } = this.state
    const inputProps = {
      id: 'command',
      type: 'text',
      className: 'full-width',
      placeholder: 'Enter Command',
      onChange: this.onChange,
      value,
    }
    return (
      <Flexbox flexDirection="row" className="command-input" >
        <Autosuggest
          inputProps={inputProps}
          suggestions={suggestions}
          onSuggestionSelected={this.onSuggestionSelected}
          renderSuggestion={this.renderSuggestion}
          getSuggestionValue={this.getSuggestionValue}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          shouldRenderSuggestions={() => true}
        />
      </Flexbox>
    )
  }
}

export default AutoSuggestContractCommands
