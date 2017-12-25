import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'mobx-react'
import {Router, Route, Switch} from 'react-router-dom'
import {createMemoryHistory} from 'history'
import Home from './components/Home/Home'
import ActivateContract from './components/ActivateContract/ActivateContract'
import states from './states'

const history = createMemoryHistory({
    initialEntries: ['/'],
    initialIndex: 0
})


ReactDOM.render(
    <Provider history={history} {...states}>
        <Router history={history}>
            <Switch>
                <Route exact path="/activate-contract" component={ActivateContract} />
                <Route exact path="/" component={Home} />
            </Switch>
        </Router>
    </Provider>, document.getElementById('app')
)