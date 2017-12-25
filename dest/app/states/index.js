'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _balanceState = require('./balance-state');

var _balanceState2 = _interopRequireDefault(_balanceState);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    balance: new _balanceState2.default()
};