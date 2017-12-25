'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _class, _temp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classAutobind = require('class-autobind');

var _classAutobind2 = _interopRequireDefault(_classAutobind);

var _flexboxReact = require('flexbox-react');

var _flexboxReact2 = _interopRequireDefault(_flexboxReact);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let Container = (_temp = _class = class Container extends _react.Component {
    constructor() {
        super();
        (0, _classAutobind2.default)(this);
    }

    render() {
        const className = (0, _classnames2.default)('container', this.props.className);

        return _react2.default.createElement(
            _flexboxReact2.default,
            { className: className,
                flexDirection: 'column' },
            this.props.children
        );
    }
}, _class.propTypes = {
    className: _propTypes2.default.string
}, _temp);
exports.default = Container;