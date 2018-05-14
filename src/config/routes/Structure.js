import React from 'react'
import { Redirect } from 'react-router-dom'
import SubRoute from './../../web/core/structure/SubRoute'
// import Transition from './../../web/core/structure/Transition'

import Dashboard from './../../web/containers/app/structure/Dashboard'
import RouteTypeList from './../../web/containers/app/structure/route/List'
import BuildList from './../../web/containers/app/structure/build/List'
import BuildDetails from './../../web/containers/app/structure/build/Details'

// import Fade from './../../web/core/transitions/Fade'

export default {
    path: '/structure',
    initialView: '/structure/dashboard',
    component: SubRoute,
    level: 1,
    displayedName: 'Structure',
    routes: [{
        path: '/structure/dashboard',
        level: 2,
        component: Dashboard,
        displayedIcon: 'home',
        displayedName: 'Tableau de bord'
    }, {
        path: '/structure/routes',
        level: 2,
        component: SubRoute,
        displayedIcon: 'fork',
        displayedName: 'Routes',
        routes: [{
            path: '/structure/routes/public',
            level: 3,
            displayedIcon: 'global',
            displayedName: 'Public',
            component: RouteTypeList
        }, {
            path: '/structure/routes/guest',
            level: 3,
            displayedIcon: 'question',
            displayedName: 'Guest',
            component: RouteTypeList
        }, {
            path: '/structure/routes/user',
            level: 3,
            displayedIcon: 'user',
            displayedName: 'User',
            component: RouteTypeList
        }, {
            path: '/structure/routes/client',
            level: 3,
            displayedIcon: 'lock',
            displayedName: 'Client',
            component: RouteTypeList
        }, {
            path: '/structure/routes/admin',
            level: 3,
            displayedIcon: 'safety',
            displayedName: 'Admin',
            component: RouteTypeList
        }, {
            path: '/structure/routes/developer',
            level: 3,
            displayedIcon: 'code',
            displayedName: 'Developer',
            component: RouteTypeList
        }]
    },{
        path: '/structure/build',
        level: 2,
        component: BuildList,
        displayedIcon: 'rocket',
        displayedName: 'Build',
        nested: false,
        routes: [{
            path: '/structure/build/:buildName',
            component: BuildDetails
        }]
    },{
        path: '*',
        component: () => <Redirect to="/structure/dashboard" />
    }]
}