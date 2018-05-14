
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'

import { ShallowEquals } from 'uptoo-react-utils'
import { Auth, Template } from 'uptoo-react-redux'

import Navbar from './../containers/template/Navbar';
import Sidebar from './../containers/template/Sidebar';
import {PropTypes} from 'prop-types';
import { Layout } from 'antd'

class App extends Component {
    constructor(props) {
        super(props)

        this.initSidebar = this.initSidebar.bind(this)

        this.navbar = props.Template.routes.navbar.filter((route) => {
            const permission = !route.permission || this.props.Auth.user.permissions.includes(route.permission)
            return route.nested !== false && permission
        })
    }

    componentDidMount() {
        this.initSidebar(this.props.Template)
    }

    componentWillReceiveProps(nextProps) {

        if (this.props.location.pathname != nextProps.location.pathname) {
            this.props.resetErrors()

            if (nextProps.Template.size.device === 'mobile') {
                this.props.sidebarSetVisible(false)
            }
        }

        if (nextProps.Template.size !== this.props.Template.size) {
            this.initSidebar(nextProps.Template)
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return ShallowEquals.shouldComponentUpdate(this, nextProps, nextState)
    }

    initSidebar(template) {
        let isVisible = true
        
        if (template && template.size && template.size.device === 'mobile') {
            isVisible = false
        }

        this.props.sidebarSetVisible(isVisible)
    }

    render() {
        if (!this.props.Auth.user) {
            return <Redirect to="/auth/login" />
        }
    
        return(
            <Layout id="app" className={this.props.Template.sidebar.isVisible ? 'collapsed' : ''}>
                <Navbar
                    routes={this.navbar}
                    location={this.props.location}
                    history={this.props.history}
                    logout={this.props.logout}
                    toggle={this.props.toggle}
                />
                <Layout hasSider={true}>
                    <Sidebar
                        routes={this.props.Template.routes.sidebar}
                        location={this.props.location}
                        history={this.props.history}
                        collapsed={!this.props.Template.sidebar.isVisible}
                    />
                    {renderRoutes(this.props.route.routes)}
                </Layout>
            </Layout>
        )
    }
}

App.propTypes = {
    route : PropTypes.object.isRequired
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => {
    return {
        sidebarSetVisible: isVisible => {
            dispatch(Template.sidebarSetVisible(isVisible))
        },
        resetErrors: () => {
            dispatch(Template.resetErrors())
        },
        logout: () => {
            dispatch(Auth.logout())
        },
        toggle: () => {
            dispatch(Template.sidebarToggle())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
