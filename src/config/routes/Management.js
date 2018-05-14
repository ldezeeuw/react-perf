import React from 'react'
import { Redirect } from 'react-router-dom'

import SubRoute from './../../web/core/structure/SubRoute'

import Dashboard from './../../web/containers/app/management/Dashboard'

import Counters from './../../web/containers/app/management/counters/Counters'
import Counter from './../../web/containers/app/management/counters/counter/Container'
import CounterNew from './../../web/containers/app/management/counters/New'
import CounterEdit from './../../web/containers/app/management/counters/Edit'

import Groups from './../../web/containers/app/management/groups/Groups'
import GroupGet from './../../web/containers/app/management/groups/Panel'
import GroupDetails from './../../web/containers/app/management/groups/Details'
import GroupNew from './../../web/containers/app/management/groups/New'
import GroupEdit from './../../web/containers/app/management/groups/Edit'

export default {
    path: '/management',
    initialView: '/management/dashboard',
    component: SubRoute,
    level: 1,
    displayedName: 'Management',
    routes: [{
        path: '/management/dashboard',
        level: 2,
        component: Dashboard,
        displayedIcon: 'home',
        displayedName: 'Tableau de bord'
    }, {
        path: '/management/counters',
        level: 2,
        component: Counters,
        displayedIcon: 'bar chart',
        displayedName: 'Compteurs',
        nested: false,
        routes: [{
            path: '/management/counters/new',
            component: CounterNew
        },{
            path: '/management/counters/:counterId/details',
            component: Counter
        }, {
            path: '/management/counters/:counterId/edit',
            component: CounterEdit
        }]
    }, {
        path: '/management/groups',
        level: 2,
        component: Groups,
        displayedIcon: 'bar chart',
        displayedName: 'Groupes',
        nested: false,
        routes: [{
            path: '/management/groups/new',
            component: GroupNew
        }, {
            path: '/management/groups/:groupId',
            component: GroupGet,
            routes: [{
                path: '/management/groups/:groupId/details',
                component: GroupDetails
            }, {
                path: '/management/groups/:groupId/edit',
                component: GroupEdit
            }]
        }]
    },{
        path: '*',
        component: () => <Redirect to="/management/dashboard" />
    }]
}