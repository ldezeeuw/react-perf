import React, { Component } from 'react'
import { connect } from 'react-redux'
import { renderRoutes } from 'react-router-config'
import { Button } from 'semantic-ui-react'

import { Data } from 'uptoo-react-redux'
import { Header } from 'uptoo-react-styles'
import { ShallowEquals } from 'uptoo-react-utils'
import { Async, Link, Pagination } from 'uptoo-react-web-elements'

class Groups extends Component {
    constructor(props) {
        super(props)

        this.groups = Data.init({
            data: [],
            url: "/admin/groups",
            sort: "name"
        })

        this.paginate = this.paginate.bind(this)
    }

    paginate(params) {
        params = Data.setParams(this.props.Data.items, params)
        this.props.get(params)
    }

    componentWillMount() {
        this.props.get(this.groups)
    }
    
    componentWillReceiveProps(nextProps) {
        const { create, edit } = nextProps.Data
        const del = nextProps.Data.delete

        if ((this.props.Data.create.loading && !create.loading && !create.error) ||
        (this.props.Data.edit.loading && !edit.loading && !edit.error && edit.data.name != this.props.Data.item.data.name) ||
        (this.props.Data.delete.loading && !del.loading && !del.error)) {
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
                    title="Liste des groupes"
                    subtitle="Gérer les groupes">
                    <Link to="/management/groups/new">
                        <Button content={this.props.Template.size.device === 'mobile' ? 'Groupe' : 'Nouveau groupe'} icon="add" labelPosition="left" />
                    </Link>
                </Header>
                <div id="page-content">
                    <div className="main">
                        <div className="flex-content">
                            <Async error={items.error} loading={items.loading} className="full">
                                {Object.keys(data).length > 0 && data.map((item, key) => (
                                    <Link to={`/management/groups/${item._id}/details`} key={key}>
                                        <div className="items-list">
                                            <div className="item-content">
                                                <div className="infos">
                                                    <div className="title">
                                                        {item.name}
                                                    </div>
                                             
                                                </div>
                                            </div>
                                            <div className="item-details">
                                                details
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

const mapStateToProps = state => ({
    Data: {
        items: state.Data.items,
        item: state.Data.item,
        create: state.Data.create,
        edit: state.Data.edit,
        delete: state.Data.delete
    },
    Template: {
        size: {
            device: state.Template.device
        }
    }
})

const mapDispatchToProps = dispatch => ({
    get: params => dispatch(Data.get(params))
})

export default connect(mapStateToProps, mapDispatchToProps)(Groups)
