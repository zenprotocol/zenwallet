'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _mobxReact = require('mobx-react');

var _reactRouterDom = require('react-router-dom');

var _history = require('history');

var _Home = require('./components/Home/Home');

var _Home2 = _interopRequireDefault(_Home);

var _ActivateContract = require('./components/ActivateContract/ActivateContract');

var _ActivateContract2 = _interopRequireDefault(_ActivateContract);

var _states = require('./states');

var _states2 = _interopRequireDefault(_states);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const history = (0, _history.createMemoryHistory)({
    initialEntries: ['/'],
    initialIndex: 0
});

_reactDom2.default.render(_react2.default.createElement(
    _mobxReact.Provider,
    _extends({ history: history }, _states2.default),
    _react2.default.createElement(
        _reactRouterDom.Router,
        { history: history },
        _react2.default.createElement(
            _reactRouterDom.Switch,
            null,
            _react2.default.createElement(_reactRouterDom.Route, { exact: true, path: '/activate-contract', component: _ActivateContract2.default }),
            _react2.default.createElement(_reactRouterDom.Route, { exact: true, path: '/', component: _Home2.default })
        )
    )
), document.getElementById('app'));