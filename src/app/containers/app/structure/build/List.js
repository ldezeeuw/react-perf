import React, { Component } from 'react'
import { renderRoutes } from 'react-router-config'

import { Header } from 'uptoo-react-styles'
import { ShallowEquals } from 'uptoo-react-utils'
import { Link } from 'uptoo-react-web-elements'

export default class BuildList extends Component {
    constructor(props){
        super(props)

        this.builds = [{
            name: 'API',
            url: '/developer/build/api'
        },{
            name: 'Console',
            url: '/developer/build/console'
        },{
            name: 'Klimbr',
            url: '/developer/build/klimbr'
        },{
            name: 'Suite',
            url: '/developer/build/suite'
        },{
            name: 'Demo',
            url: '/developer/build/demo'
        },{
            name: 'Salaires',
            url: '/developer/build/salaires'
        },{
            name: 'Jobs',
            url: '/developer/build/jobs'
        }]
    }

    shouldComponentUpdate(nextProps, nextState) {
        return ShallowEquals.shouldComponentUpdate(this, nextProps, nextState)
    }

    render() {
        return (
		    <div id="app-content">
                <Header 
                    title="Liste des builds"
                    subtitle="Afficher les apps pour build"
                />
                <div id="page-content">
                    <div className="main">
                        <div className="flex-content">
                            { this.builds.map((item, key) => {
                                return(
                                    <Link key={key} to={'/structure/build/' + item.name.toLowerCase()}>
                                        <div className="items-list">
                                            <div className="item-content">
                                                <div className="infos">
                                                    <div className="title">
                                                        {item.name}
                                                    </div>
                                                    <div className="subtitle">
                                                        {item.url}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                    {renderRoutes(this.props.route.routes)}
                </div>
            </div>
        )
    }
}
