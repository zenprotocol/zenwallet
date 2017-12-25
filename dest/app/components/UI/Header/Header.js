'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _class, _temp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classAutobind = require('class-autobind');

var _classAutobind2 = _interopRequireDefault(_classAutobind);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let Header = (_temp = _class = class Header extends _react.Component {
    constructor() {
        super();
        (0, _classAutobind2.default)(this);
    }

    render() {
        const { title } = this.props;

        const className = (0, _classnames2.default)('header', this.props.className);

        return _react2.default.createElement(
            'header',
            { className: className },
            _react2.default.createElement(
                'h1',
                null,
                title
            )
        );
    }
}, _class.propTypes = {
    className: _propTypes2.default.string,
    title: _propTypes2.default.string
}, _class.defaultProps = {
    title: 'Zen Wallet'
}, _temp);
exports.default = Header;