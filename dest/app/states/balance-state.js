'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mobx = require('mobx');

var _axios = require('axios');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

let BalanceState = class BalanceState {
    constructor() {
        this.assets = _mobx.observable.array([]);
    }

    fetch() {
        var _this = this;

        return _asyncToGenerator(function* () {
            let result = yield (0, _axios.get)('http://127.0.0.1:31567/wallet/balance');

            _this.assets.replace(result.data);
        })();
    }
};
exports.default = BalanceState;