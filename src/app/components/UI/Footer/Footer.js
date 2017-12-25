import React,{Component} from 'react'
import autobind from 'class-autobind'
import PropTypes from 'prop-types'
import classnames from 'classnames'

class Footer extends Component {
    constructor() {
        super()
        autobind(this)
    }

    static propTypes = {
        className: PropTypes.string
    }

    render() {
        const className = classnames('footer', this.props.className)

        return (
            <footer className={className}>
                0 Peers
            </footer>
        )
    }
}

export default Footer