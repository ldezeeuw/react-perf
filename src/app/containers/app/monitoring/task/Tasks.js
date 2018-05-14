import React, { Component } from 'react'
import { connect } from 'react-redux'
import { renderRoutes } from 'react-router-config'
import { Button, Icon } from 'semantic-ui-react'

import { Data } from 'uptoo-react-redux'
import { Header } from 'uptoo-react-styles'
import { ShallowEquals } from 'uptoo-react-utils'
import { Pagination } from 'uptoo-react-web-elements'

import List from './List'

const getColor = ({ isDone }) => {
    let color = 'orange'

    if (isDone) {
        color = 'green' 
    }

    return color
}

class Tasks extends Component {
    constructor(props) {
        super(props)

        this.tasks = Data.init({
            data: [],
            url: '/admin/tasks',
            sort: '-_createdAt',
            itemsPerPage: 100
        })

        this.paginate = this.paginate.bind(this)        
    }

    componentWillMount() {
        this.props.get(this.tasks)        
    }

    componentWillReceiveProps(nextProps) {
        const del = nextProps.Data.delete

        if (this.props.Data.delete.loading && !del.loading && !del.error) {
            this.props.get(this.props.Data.items)            
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return ShallowEquals.shouldComponentUpdate(this, nextProps, nextState)
    }

    paginate(params) {
        params = Data.setParams(this.props.Data.items, params)
        this.props.get(params)
    }

    renderIcon({ isDone }) {
        let icon

        if (isDone) {
            icon = <Icon name="check circle" color={getColor({ isDone })} size="large" />
        } else {
            icon = <Icon name="hourglass half" color={getColor({ isDone })} size="large" />
        }
        
        return icon
    }

    render() {
        const { pagination } = this.props.Data.items

        return (
            <div id="app-content">
                <Header 
                    title={pagination.totalItems ? `Liste des Tasks (${pagination.totalItems})` : `Liste des Tasks`}
                    subtitle="Affiche la liste des tasks triées par date de création décroissante">
                    <Button 
                        onClick={this.toggleModal} disabled 
                        content="Supprimer" 
                        color="red" 
                        icon="trash" 
                        labelPosition="right"
                    />
                </Header>
                <div id="page-content">
                    <div className="main">
                        <List items={this.props.Data.items} renderIcon={this.renderIcon} />
                        <Pagination action={this.paginate} {...pagination} />
                    </div>
                    {renderRoutes(this.props.route.routes, { getColor })}
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    Data: {
        items: state.Data.items,
        delete: state.Data.delete
    }
})

const mapDispatchToProps = dispatch => ({
    get: params => dispatch(Data.get(params)), 
    delete: params => dispatch(Data.delete('/developer/logs', params))
})

export default connect(mapStateToProps, mapDispatchToProps)(Tasks)
