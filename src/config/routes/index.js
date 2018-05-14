import React from 'react'
import { Redirect } from 'react-router-dom'
import Auth from './Auth'
import Monitoring from './Monitoring'
// import Databases from './Databases'
// import Structure from './Structure'
// import Management from './Management'

// import App from './../app/containers/App.js'
import Loading from './../../app/components/loading.js';
import Loadable from 'react-loadable';

const App = Loadable({
    loader: () => import('./../../app/rootContainers/App.js' /* webpackChunkName: 'Layout' */),
    loading: Loading
});

export default [
    Auth,
    {
        path: '/',
        component: App,
        displayedName: 'Uptoo',
        routes: [
            Monitoring,
            // Databases,
            // Structure,
            // Management,
            {
                path : '*',
                component : () => console.log("should redirect")
                // <Redirect to="/monitoring/dashboard" />
            }
        ]
    }
]