import React, { Component } from 'react'
import { connect } from 'react-redux'
import { renderRoutes } from 'react-router-config'

import { Data } from 'uptoo-react-redux'
import { Header } from 'uptoo-react-styles'

import List from './List'

class ElasticsearchIndexes extends Component {
    constructor(props) {
        super(props)

        this.indexes = Data.init({
            data: [],
            url: "/developer/elasticsearch/indexes"
        })

        this.state = {
            data: []
        }

        this.compare = this.compare.bind(this)
    }

    compare(a, b) {
        if (a.index < b.index) { return -1 }
        if (a.index > b.index) { return 1 }
        return 0
    }

    componentWillMount() {
        this.props.get(this.indexes)
    }

    componentWillReceiveProps(nextProps) {
        let { loading, error, data } = nextProps.Data.items

        if (this.props.Data.items.loading && !loading && !error) {
            data = data.sort(this.compare)
            this.setState({ data })
        }
    }

    render() {
        return (
            <div id="app-content">
                <Header
                    title="Liste des indexes"
                    subtitle="Afficher les indexes"
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

export default connect(mapStateToProps, mapDispatchToProps)(ElasticsearchIndexes)
