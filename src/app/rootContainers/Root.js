import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Provider, connect } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import { renderRoutes } from 'react-router-config'

import { message, notification } from 'antd'

import { ShallowEquals, Config, Cookies } from 'uptoo-react-utils'
import { Auth, Template } from 'uptoo-react-redux'
import { Window } from 'uptoo-react-web-elements'

import {history} from './../../config/store/';
import {ROUTES, JWT_TOKEN, AUTHORIZED_USERS, API_DOMAIN} from './../../config/globals';

if (process.env.NODE_ENV !== 'production') {
    var DevTools = require('uptoo-react-web-elements/dist/DevTools').default
}

message.config({
    top: 11,
    duration: 2
})

notification.config({
    placement: 'topRight',
    top: 75,
    right: 15,
    duration: 3
})

class Root extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props)

        Config.set('JWT_TOKEN', JWT_TOKEN)
        Config.set('API_DOMAIN', API_DOMAIN)
        Config.set('AUTHORIZED_USERS', AUTHORIZED_USERS)
    }

    componentWillMount() {
        this.props.init(ROUTES)

        let token = Cookies.get(JWT_TOKEN)

        if (token) {
            this.props.restore(token)
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return ShallowEquals.shouldComponentUpdate(this, nextProps, nextState)
    }

    render() {
        return (
            <Provider store={this.props.store}>
                <div style={{ height: '100%' }}>
                    <Window action={this.props.windowResize} />
                    {DevTools && <DevTools />}
                    <ConnectedRouter history={history}>
                        {renderRoutes(ROUTES)}
                    </ConnectedRouter>
                </div>
            </Provider>
        )
    }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({
    init: routes => {
        dispatch(Template.routesInit(routes))
    },
    windowResize: value => {
        dispatch(Template.windowResize(value))
    },
    restore: token => {
        dispatch(Auth.restore(token))
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(Root)
// const Home = Loadable({
//     loader: () => import('./../containers/home' /* webpackChunkName: 'home' */),
//     loading: Loading
// });

// const PageOne = Loadable({
//     loader: () => import('./../containers/pageOne.js' /* webpackChunkName: 'pageOne' */),
//     loading: Loading
// });

// const PageTwo = Loadable({
//     loader: () => import('./../containers/pageTwo.js' /* webpackChunkName: 'pageTwo' */),
//     loading: Loading
// });


// const routes = [{
//     path: '/',
//     exact: true,
//     component: Home,
//     routes: []
// }, {
//     path: '/pageOne',
//     exact: true,
//     component: PageOne,
//     routes: []
// }, {
//     path: '/pageTwo',
//     exact: true,
//     component: PageTwo,
//     routes: []
// }];
