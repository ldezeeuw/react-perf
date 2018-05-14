import React, { Component } from 'react'
import { Layout, Menu, Icon } from 'antd'

import { ShallowEquals } from 'uptoo-react-utils'

const { SubMenu } = Menu
const { Sider } = Layout

export default class Sidebar extends Component {
    constructor(props) {
        super(props)

        this.state = {}

        this.handleClick = this.handleClick.bind(this)
        this.getAccordion = this.getAccordion.bind(this)
    }

    componentDidMount() {
        const pathname = this.props.location.pathname.split('/')[1]
        const appliation = this.props.location.pathname.split('/')[2]
        const module = this.props.location.pathname.split('/')[3]

        this.setState({
            routes: this.props.routes[`/${pathname}`],
            selectedKeys: [`/${pathname}/${appliation}`,`/${pathname}/${appliation}/${module}`]
        })
    }

    componentWillReceiveProps(nextProps) {
        if (ShallowEquals.diff(this.props.location, nextProps.location)) {
            const oldPathname = this.props.location.pathname.split('/')[1]
            const oldAppliation = this.props.location.pathname.split('/')[2]
            const oldModule = this.props.location.pathname.split('/')[3]

            const nextPathname = nextProps.location.pathname.split('/')[1]
            const nextAppliation = nextProps.location.pathname.split('/')[2]
            const nextModule = nextProps.location.pathname.split('/')[3]

            if (oldPathname != nextPathname || oldAppliation != nextAppliation || oldModule != nextModule) {
                this.setState({
                    routes: nextProps.routes[`/${nextPathname}`],
                    selectedKeys: [`/${nextPathname}/${nextAppliation}`,`/${nextPathname}/${nextAppliation}/${nextModule}`]
                })
            }
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (ShallowEquals.diff(this.state.routes, nextState.routes)) {
            return true
        }

        if (ShallowEquals.diff(this.state.selectedKeys, nextState.selectedKeys)) {
            return true
        }

        if (ShallowEquals.diff(this.props.collapsed, nextProps.collapsed)) {
            return true
        }

        return false
    }

    getSidebar(routes) {
        return typeof routes === 'undefined' ? [] : routes.map((route) => {
            return this.renderRoute(route)
        })
    }
    
    renderRoute(route) {
        let content = null

        if (!route.permission || (route.permission && this.props.Auth.user.permissions.includes(route.permission))) {
            content = (route.routes && route.nested !== false) ?
                this.getAccordion(route) :
                this.getLink(route)
        }
            
        return content
    }
    
    getAccordion(route) {

        const addKey = ({ key }) => {
            let selectedKeys = [...this.state.selectedKeys]
            if (selectedKeys.includes(key)) {
                selectedKeys = selectedKeys.filter(k => k !== key)
            } else {
                selectedKeys.push(key)
            }

            this.setState({ selectedKeys })
        }

        return(
            <SubMenu 
                key={route.path} 
                title={<span><Icon type={route.displayedIcon}/>{route.displayedName}</span>}
                onTitleClick={addKey}
            >
                {route.routes.map((r) => {
                    return this.getLink(r)
                })}
            </SubMenu>
        )
    }
    
    getLink(route) {
        return <Menu.Item key={route.path}>
            <Icon type={route.displayedIcon} />
            {route.displayedName}
        </Menu.Item>
    }
    
    handleClick({ key }) {
        this.props.history.push(key)
    }

    render() {
        return(

            <Sider 
                id="sidebar"
                width={260} 
                style={{ background: '#fff' }} 
                collapsed={this.props.collapsed}
                collapsedWidth={0}>
                <Menu
                    className="main"
                    mode="inline"
                    selectedKeys={this.state.selectedKeys}
                    openKeys={this.state.selectedKeys}
                    style={{ height: '100%', borderRight: 0 }}
                    onClick={this.handleClick}
                >
                    {this.getSidebar(this.state.routes)}
                </Menu>
            </Sider>
        )
    }
}
