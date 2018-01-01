import React,{Component} from 'react'
import autobind from 'class-autobind'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import Flexbox from 'flexbox-react'

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
            <Flexbox justifyContent='flex-end' element="footer" height="30px" className={className}>
                0 Peers
            </Flexbox>
        )
    }
}

export default Footer
