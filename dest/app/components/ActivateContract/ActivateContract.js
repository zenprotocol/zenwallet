'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _dec, _class;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _mobxReact = require('mobx-react');

var _classAutobind = require('class-autobind');

var _classAutobind2 = _interopRequireDefault(_classAutobind);

var _reactRouterDom = require('react-router-dom');

var _Container = require('../UI/Container/Container');

var _Container2 = _interopRequireDefault(_Container);

var _Main = require('../UI/Main/Main');

var _Main2 = _interopRequireDefault(_Main);

var _Header = require('../UI/Header/Header');

var _Header2 = _interopRequireDefault(_Header);

var _Footer = require('../UI/Footer/Footer');

var _Footer2 = _interopRequireDefault(_Footer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let ActivateContract = (_dec = (0, _mobxReact.inject)('history'), _dec(_class = (0, _mobxReact.observer)(_class = class ActivateContract extends _react.Component {
    constructor() {
        super();
        (0, _classAutobind2.default)(this);
    }

    onBackClicked(event) {
        this.props.history.goBack();
        event.preventDefault();
    }

    render() {
        return _react2.default.createElement(
            _Container2.default,
            { className: 'activate-contract' },
            _react2.default.createElement(_Header2.default, null),
            _react2.default.createElement(
                _Main2.default,
                null,
                _react2.default.createElement(
                    'h2',
                    null,
                    'Activate Contract'
                ),
                _react2.default.createElement(
                    'a',
                    { href: '#', onClick: this.onBackClicked },
                    'Back'
                )
            ),
            _react2.default.createElement(_Footer2.default, null)
        );
    }
}) || _class) || _class);
exports.default = ActivateContract;