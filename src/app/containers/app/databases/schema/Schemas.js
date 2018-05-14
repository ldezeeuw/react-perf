import React, { Component } from 'react'
import { connect } from 'react-redux'
import { renderRoutes } from 'react-router-config'

import { Data } from 'uptoo-react-redux'
import { Header } from 'uptoo-react-styles'
import { ShallowEquals } from 'uptoo-react-utils'

import List from './List'

class SchemasList extends Component {
    constructor(props) {
        super(props)

        this.schemas = Data.init({
            data: [],
            url: '/developer/schemas'
        })
    }

    componentWillMount() {
        this.props.get(this.schemas)
    }

    shouldComponentUpdate(nextProps, nextState) {
        return ShallowEquals.shouldComponentUpdate(this, nextProps, nextState, ['Data', 'route', 'location'])
    }

    render() {
        return (
		    <div id="app-content">
                <Header 
                    title="Liste des schémas"
                    subtitle="Affiche la liste des schémas"
                />
                <div id="page-content">
                    <div className="main">
                        <List items={this.props.Data.items} />                        
                    </div>
                    {renderRoutes(this.props.route.routes)}
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    Data: {
        items: state.Data.items
    }
})

const mapDispatchToProps = dispatch => ({
    get: (params) => dispatch(Data.get(params))
})

export default connect(mapStateToProps, mapDispatchToProps)(SchemasList)
