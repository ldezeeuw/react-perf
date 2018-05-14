import React, { Component } from 'react'
import { connect } from 'react-redux'
import { renderRoutes } from 'react-router-config'
import { Button } from 'semantic-ui-react'

import { Data } from 'uptoo-react-redux'
import { Header } from 'uptoo-react-styles'
import { ShallowEquals } from 'uptoo-react-utils'
import { Async, Link, Pagination } from 'uptoo-react-web-elements'

class Counters extends Component {
    constructor(props) {
        super(props)

        this.counters = Data.init({
            data: [],
            url: "/admin/counters",
            sort: "name"
        })

        this.paginate = this.paginate.bind(this)        
    }

    paginate(params) {
        params = Data.setParams(this.props.Data.items, params)
        this.props.get(params)
    }

    componentWillMount() {
        this.props.get(this.counters)
    }
    
    componentWillReceiveProps(nextProps) {
        const { loading, error, data, pagination } = nextProps.Data.items
        let { currentIndex } = pagination

        if (!loading && !error && data.length == 0 && currentIndex > 1) {
            currentIndex--
            let params = Data.setParams(this.props.Data.items, { currentIndex })
            this.props.get(params)
        }
        else if (nextProps.Data.edit.data._id && nextProps.Data.edit.data._id !== this.props.Data.edit.data._id) {
            this.props.get(this.props.Data.items)
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return ShallowEquals.shouldComponentUpdate(this, nextProps, nextState)
    }
        
    render() {
        const { items } = this.props.Data
        const { data } = items

        return (
            <div id="app-content">
                <Header
                    title="Liste des compteurs"
                    subtitle="Gérer les compteurs">
                    <Link to="/management/counters/new">
                        <Button content={this.props.Template.size.device === 'mobile' ? 'Compteur' : 'Nouveau compteur'} icon="add" labelPosition="left" />
                    </Link>
                </Header>
                <div id="page-content">
                    <div className="main">
                        <div className="flex-content">
                            <Async error={items.error} loading={items.loading} className="full">
                                {data.map((item, key) => (
                                    <Link to={`/management/counters/${item._id}/details`} key={key}>
                                        <div className="items-list">
                                            <div className="item-content">
                                                <div className="infos">
                                                    <div className="title">
                                                        {item.name}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </Async>
                        </div>
                        <Pagination action={this.paginate} {...this.props.Data.items.pagination} />
                    </div>
                    {renderRoutes(this.props.route.routes)}
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        Data: state.Data,
        Template: state.Template
    }
}

const mapDispatchToProps = dispatch => ({
    get: (params) => dispatch(Data.get(params))
})

export default connect(mapStateToProps, mapDispatchToProps)(Counters)
