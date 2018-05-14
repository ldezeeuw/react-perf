import React from 'react'
import {Redirect} from 'react-router-dom'
// import SubRoute from './../../app/core/structure/SubRoute'
import {SubRoute} from 'uptoo-react-web-elements';
import Loading from './../../app/components/loading.js';
import Loadable from 'react-loadable';

import Logs from './../../app/containers/app/monitoring/logs'
import Tasks from './../../app/containers/app/monitoring/task'

const Dashboard = Loadable({
    loader: () => import('./../../app/containers/app/monitoring/Dashboard' /* webpackChunkName: 'Dashboard' */),
    loading: Loading
});

export default {
    path : '/monitoring',
    component: SubRoute,
    level: 1,
    displayedName: 'Monitoring',
    routes: [{
        path : '/monitoring/dashboard',
        level: 2,
        component: Dashboard,
        displayedIcon: 'home',
        displayedName: 'Tableau de bord'
    }, {
        path : '/monitoring/logs',
        level: 2,
        component: Logs.List,
        displayedIcon: 'bars',
        displayedName: 'Logs',
        nested: false,
        routes: [{
            path: '/monitoring/logs/filter',
            level: 3,
            component: Logs.Filter
        }, {
            path: '/monitoring/logs/purge',
            level: 3,
            component: Logs.Purge
        }, {
            path: '/monitoring/logs/:logId',
            level: 3,
            component: Logs.Log
        }]
    }, {
        path : '/monitoring/tasks',
        level: 2,
        component: Tasks.List,
        displayedIcon: 'inbox',
        displayedName: 'Tasks',
        nested: false,
        routes: [{
            path: '/monitoring/tasks/filter',
            level: 3,
            component: Tasks.Filter
        }, {
            path: '/monitoring/tasks/:taskId',
            level: 3,
            component: Tasks.Task,
            displayedName: 'Afficher la task'
        }]
    }, {
        path : '*',
        component : () => console.log('should redirect')
        // <Redirect to="/monitoring/dashboard" />
    }]
}