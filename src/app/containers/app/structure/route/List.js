import React, { Component } from 'react'
import { connect } from 'react-redux'
import { renderRoutes } from 'react-router-config'
import { Grid, Label, Message } from 'semantic-ui-react'

import { Data } from 'uptoo-react-redux'
import { Header } from 'uptoo-react-styles'
import { ShallowEquals } from 'uptoo-react-utils'
import { Async } from 'uptoo-react-web-elements'

class RouteTypeList extends Component {
    constructor(props) {
        super(props)

        this.routeType = this.props.route.path.replace('/structure/routes/', '')

        this.routes = Data.init({
            data: [],
            url: '/developer/routes'
        })

        this.categories = {}

        this.sortUrl = (array) => {
            array.sort((a, b) => {
                if (a.url < b.url) {
                    return -1
                }
                else if (a.url > b.url) {
                    return 1
                }
                return 0
            })

            return array
        }

        this.props.get(this.routes, this.routeType)
    }

    shouldComponentUpdate(nextProps, nextState) {
        return ShallowEquals.shouldComponentUpdate(this, nextProps, nextState)
    }

    sortRoutes(data) {
        let routesArray = []

        if (Object.keys(data).length != 0 && typeof data.map !== 'undefined') {
            data.map((route) => {
                route.model = route.url.split('/', 3).join('/')

                if (!routesArray[route.model]) {
                    routesArray[route.model] = []
                    this.categories[route.model] = false
                }

                if (routesArray[route.model].indexOf(route) == -1) {
                    routesArray[route.model].push(route)
                }

                routesArray[route.model] = this.sortUrl(routesArray[route.model])
            })
        }

        return routesArray
    }

    renderMethod(route) {
        let color = 'blue'

        switch (route.method) {
        case 'post':
            color = "green"
            break
        case 'put':
            color = "orange"
            break
        case 'delete':
            color = 'red'
            break
        }

        return (
            <Grid.Column width="2" textAlign="center">
                <Label content={route.method.toUpperCase()} color={color} />
            </Grid.Column>
        )
    }

    renderDetails(route) {

        return (
            <Grid.Column>
                <div className="infos">
                    <div className="title">{route.url}</div>
                    <div className="subtitle">{route.desc}</div>
                </div>
            </Grid.Column>
        )
    }

    renderCategory(array) {

        return (
            array.map((route, key) => {
                return (
                    <div key={key}>
                        <div className="items-list">
                            <Grid columns="2" stackable={true} className="item-content">
                                {this.renderMethod(route)}
                                {this.renderDetails(route)}
                            </Grid>
                        </div>
                    </div>
                )
            })
        )
    }

    renderRoutesArray(data) {
        return (
            (Object.keys(data).length != 0) ? (
                <Grid padded="vertically">
                    {Object.keys(data).map((category, key) => {
                        return (
                            <div key={key} className="full">
                                <Message style={{ margin: 0 }} size="big" content={category} />
                                <div>{this.renderCategory(data[category])}</div>
                            </div>
                        )
                    })}
                </Grid>
            )
                :
                <div>No routes to display</div>
        )
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.match.params.routeType && nextProps.match.params.routeType !== this.props.match.params.routeType) {
            this.props.get(this.routes, nextProps.match.params.routeType)
        }
    }

    render() {
        const routesArray = this.sortRoutes(this.props.Data.item.data)

        return (
            <div id="app-content">
                <Header
                    title={"Liste des routes " + this.routeType}
                    subtitle={"Affiche les routes de type " + this.routeType}
                />
                <Async error={this.props.Data.item.error} loading={this.props.Data.item.loading} id="page-content">
                    <div className="main">
                        <div className="flex-content">
                            {this.renderRoutesArray(routesArray)}
                        </div>
                    </div>
                    {renderRoutes(this.props.route.routes)}
                </Async>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    Data: {
        item: state.Data.item
    }
})

const mapDispatchToProps = dispatch => ({
    get: (params, id) => dispatch(Data.get(params, id))
})

export default connect(mapStateToProps, mapDispatchToProps)(RouteTypeList)
