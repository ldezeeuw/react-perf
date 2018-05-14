import React, { Component } from 'react'
import { Layout, Menu, Tag, Icon, Row, Col, Select, Dropdown } from 'antd'

import { ShallowEquals } from 'uptoo-react-utils'

const { Header } = Layout
const Option = Select.Option

export default class Navbar extends Component {
    constructor(props) {
        super(props)

        this.state = {
            selectedKeys: `/${props.location.pathname.split('/')[1]}`
        }

        this.handleClick = this.handleClick.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        if (ShallowEquals.diff(this.props.location, nextProps.location)) {
            const oldModule = this.props.location.pathname.split('/')[1]
            const newModule = nextProps.location.pathname.split('/')[1]

            if (oldModule != newModule) {
                this.setState({ selectedKeys: `/${newModule}`})
            }
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return ShallowEquals.diff(this.state.selectedKeys, nextState.selectedKeys)
    }

    handleClick({ key }) {
        if (key == 0) {
            return this.props.toggle()
        }
        if (key =='logout') {
            return this.props.logout()
        }
        this.props.history.push(key)
    }

    handleChange(value){
        this.props.history.push(value)
    }

    render() {
        return (
            <Header id="navbar">
                <Row type="flex" justify="space-between">
                    <Col style={{ height: 64 }}>
                        <div className="logo" onClick={this.props.toggle}>
                            <div className="burger-menu">
                                <div className="burger" />
                            </div>
                        </div>
                    </Col>

                    <Col className="hide-sm" style={{ height: 64, flex: 1, padding: '0 15px' }}>
                        <Select style={{ width: '100%' }} onChange={this.handleChange} value={this.state.selectedKeys}>
                            {this.props.routes.map((route, key) => <Option key={key} value={route.path}>
                                {route.displayedName}
                            </Option>)}
                        </Select>
                    </Col>

                    <Col className="hide-xs" style={{ height: 64 }}>
                        <Menu
                            mode="horizontal"
                            selectedKeys={[this.state.selectedKeys]}
                            style={{ lineHeight: '62px' }}
                            onClick={this.handleClick}
                        >
                            {this.props.routes.map(route => <Menu.Item key={route.path}>
                                {route.displayedName}
                            </Menu.Item>)}
                        </Menu>
                    </Col>

                    <Col className="hide-xs" style={{ height: 64, flex: 1, textAlign: 'center' }}>
                        {process.env.NODE_ENV != 'production' && <Tag color="red">
                            <Icon type="warning" />
                            ATTENTION - VERSION DE {process.env.NODE_ENV.toUpperCase()}
                        </Tag>}
                    </Col>

                    <Col style={{ height: 64 }}>
                        <Dropdown overlay={<Menu
                            id="logout"
                            style={{ lineHeight: '62px', marginRight: 5 }}
                            onClick={this.handleClick}
                        >
                            <Menu.Item key="logout">
                                <Icon type="logout" /> Déconnexion
                            </Menu.Item>
                        </Menu>} trigger={['click']}>
                            <a className="logout" href="#">
                                <span><Icon type="user" /><span className="hide-xs">Mon compte</span></span>
                            </a>
                        </Dropdown>
                    </Col>
                </Row>
            </Header>
        )
    }
}
