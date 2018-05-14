import React from 'react'
import {Redirect} from 'react-router-dom'
import SubRoute from './../../web/core/structure/SubRoute'

import Dashboard from './../../web/containers/app/databases/Dashboard'
import ElasticsearchIndexes from './../../web/containers/app/databases/elasticsearch/Indexes'
import ElasticsearchIndex from './../../web/containers/app/databases/elasticsearch/Index'
import Schemas from './../../web/containers/app/databases/schema/Schemas'
import Schema from './../../web/containers/app/databases/schema/Schema'

export default {
    path : '/databases',
    initialView: '/databases/dashboard',
    component: SubRoute,
    level: 1,
    displayedName: 'Databases',
    routes: [{
        path : '/databases/dashboard',
        level: 2,
        component: Dashboard,
        displayedIcon: 'home',
        displayedName: 'Tableau de bord'
    },{
        path : '/databases/elasticsearch/indexes',
        level: 2,
        component: ElasticsearchIndexes,
        displayedIcon: 'search',
        displayedName: 'Elasticsearch',
        nested: false,
        routes: [{
            path: '/databases/elasticsearch/indexes/:indexName',
            level: 3,
            component: ElasticsearchIndex
        }]
    },{
        path : '/databases/schemas',
        level: 2,
        component: Schemas,
        displayedIcon: 'sitemap',
        displayedName: 'Schémas',
        nested: false,
        routes: [{
            path: '/databases/schemas/:schemaName',
            level: 3,
            component: Schema
        }]
    },{
        path : '*',
        component : () => <Redirect to="/databases/dashboard" />
    }]
}