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

var _flexboxReact = require('flexbox-react');

var _flexboxReact2 = _interopRequireDefault(_flexboxReact);

var _Container = require('../UI/Container/Container');

var _Container2 = _interopRequireDefault(_Container);

var _Main = require('../UI/Main/Main');

var _Main2 = _interopRequireDefault(_Main);

var _Header = require('../UI/Header/Header');

var _Header2 = _interopRequireDefault(_Header);

var _Footer = require('../UI/Footer/Footer');

var _Footer2 = _interopRequireDefault(_Footer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let Home = (_dec = (0, _mobxReact.inject)('balance'), _dec(_class = (0, _mobxReact.observer)(_class = class Home extends _react.Component {
    constructor() {
        super();
        (0, _classAutobind2.default)(this);
    }

    componentDidMount() {
        const { balance } = this.props;

        balance.fetch();
    }

    render() {
        const { balance } = this.props;

        const balances = balance.assets.map(asset => {
            return _react2.default.createElement(
                _flexboxReact2.default,
                { key: asset.asset },
                _react2.default.createElement(
                    'div',
                    null,
                    asset.asset
                ),
                _react2.default.createElement(
                    'div',
                    null,
                    '|'
                ),
                _react2.default.createElement(
                    'div',
                    null,
                    asset.balance
                )
            );
        });

        return _react2.default.createElement(
            _Container2.default,
            { className: 'home' },
            _react2.default.createElement(_Header2.default, { title: 'Home' }),
            _react2.default.createElement(
                _Main2.default,
                null,
                balances,
                _react2.default.createElement(
                    _reactRouterDom.Link,
                    { to: '/activate-contract' },
                    'Activate Contract'
                )
            ),
            _react2.default.createElement(_Footer2.default, null)
        );
    }
}) || _class) || _class);
exports.default = Home;