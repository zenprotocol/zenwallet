import React,{Component} from 'react'
import autobind from 'class-autobind'
import PropTypes from 'prop-types'
import classnames from 'classnames'

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
            <main className={className}>
                {this.props.children}
            </main>
        )
    }
}

export default Main