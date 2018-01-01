import React,{Component} from 'react'
import autobind from 'class-autobind'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import Flexbox from 'flexbox-react'

class Main extends Component {
    constructor() {
        super()
        autobind(this)
    }

    static propTypes = {
        className: PropTypes.string
    }

    render() {
        const className = classnames('main', this.props.className)

        return (
            <Flexbox element="main" flexDirection="column" minHeight="100vh" className={className}>
                {this.props.children}
            </Flexbox>
        )
    }
}

export default Main
