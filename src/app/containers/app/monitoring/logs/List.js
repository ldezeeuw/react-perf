import React, { Component } from 'react'
import { connect } from 'react-redux'
import { renderRoutes } from 'react-router-config'
import Moment from 'react-moment'

import { Layout, Button, Row, Col, Icon, List, Pagination, Badge, message } from 'antd'

import { Cookies } from 'uptoo-react-utils'
import { Data, Socket } from 'uptoo-react-redux'
import { Link, Socket as SocketComponent } from 'uptoo-react-web-elements'

import { JWT_TOKEN, API_DOMAIN } from './../../../../../config/globals/'

const { Header, Content, Footer } = Layout
const { Item } = List

const types = [
    { value: 'info', text: 'Info' },
    { value: 'success', text: 'Succès' },
    { value: 'warning', text: 'Warning' },
    { value: 'error', text: 'Erreur' }
]

const getColor = ({ type }) => {
    let color

    if (type == 'info') { color = 'processing' }
    if (type == 'warning') { color = 'warning'}
    if (type == 'error') { color = 'error' }
    if (type == 'success') { color = 'success' }

    return color
}

class Logs extends Component {
    constructor(props){
        super(props)
        
        this.logs = Data.init({
            url: "/developer/logs",
            sort: "-_createdAt"
        })

        this.state = {
            newLogs: 0,
            modal: false
        }

        this.token = Cookies.get(JWT_TOKEN)

        this.paginate = this.paginate.bind(this)
    }

    componentWillMount() {
        this.props.reset()   
    }

    componentDidMount() {
        this.props.get(this.logs)
    }

    componentWillReceiveProps(nextProps) {
        const { loading, error } = nextProps.Data.items
        const del = nextProps.Data.delete

        if (this.props.Data.items.loading && !loading && !error) {
            this.setState({ newLogs: 0 })
        }

        if (this.props.Data.delete.loading && !del.loading && !del.error) {
            message.success('Suppression réussie')
            this.props.get(this.props.Data.items)
        }

        if (this.props.Socket !== nextProps.Socket && nextProps.Socket.type == 'log:new') {
            this.setState({ newLogs: this.state.newLogs + 1 })
        }
    }

    paginate(params) {
        document.getElementById("content").scrollTop = 0

        params = Data.setParams(this.props.Data.items, params)
        this.props.get(params)
    }

    render() {
        const { loading, data, pagination } = this.props.Data.items

        return (
            <Layout id="main">
                <SocketComponent 
                    url={API_DOMAIN} 
                    token={this.token} 
                    onMessage={this.props.onMessage}
                />
                <Header className="header">
                    <Row type="flex" justify="space-between">
                        <Col>
                            <h3>Logs {pagination.totalItems > 0 && `(${pagination.totalItems})`}</h3>
                        </Col>
                        <Col className="text-right">
                            {this.state.newLogs !== 0 && 
                                <Button onClick={() => this.props.get(this.logs)}>
                                    <Icon type="sync" />Charger {this.state.newLogs} nouveaux logs
                                </Button>
                            }

                            <Link to="/monitoring/logs/purge">
                                <Button type="danger" style={{ marginLeft: 10 }}>
                                    <Icon type="delete" />Purger
                                </Button>
                            </Link>

                            <Link to="/monitoring/logs/filter" className="hide-xs">
                                <Button style={{ marginLeft: 10 }}>
                                    <Icon type="setting" />Filter
                                </Button>
                            </Link>

                            <Link to="/monitoring/logs/filter" className="hide-sm">
                                <Button style={{ marginLeft: 10 }}>
                                    <Icon type="setting" />
                                </Button>
                            </Link>
                        </Col>
                    </Row>
                </Header>
                <Layout hasSider={true}>
                    <Content>
                        <Layout style={{ height: '100%' }}>
                            <Header className="small">
                                <Row gutter={16} type="flex">
                                    <Col>
                                        <Badge status="success" text="Success" />
                                    </Col>
                                    <Col>
                                        <Badge status="warning" text="Warning" />
                                    </Col>
                                    <Col>
                                        <Badge status="error" text="Error" />
                                    </Col>
                                    <Col>
                                        <Badge status="processing" text="Info" />
                                    </Col>
                                </Row>
                            </Header>
                            <Content id="content">
                                <List
                                    itemLayout="vertical"
                                    dataSource={data}
                                    loading={loading}
                                    renderItem={item => (
                                        <Link to={`/monitoring/logs/${item._id}`}>
                                            <Item
                                                extra={<span><Icon type="clock-circle-o" /> <Moment format="HH:mm:ss">{item._createdAt}</Moment></span>}
                                                // actions={[
                                                //     <span><Icon type="calendar" /> <Moment format="DD/MM/YYYY">{item._createdAt}</Moment></span>
                                                // ]}
                                            >
                                                <Item.Meta
                                                    title={<span><Badge status={getColor(item)} />{item.message && item.message.length > 70 ? 
                                                        `${item.message.slice(0, 70)}...` 
                                                        : item.message
                                                    }</span>}
                                                />
                                            </Item>
                                        </Link>
                                    )}
                                />
                            </Content>
                            <Footer style={{ textAlign: 'center' }}>
                                <Row type="flex" justify="center" align="middle">
                                    <Col className="hide-xs">
                                        <Pagination 
                                            showSizeChanger 
                                            onChange={currentIndex => this.paginate({ currentIndex })} 
                                            onShowSizeChange={(currentIndex, itemsPerPage) => this.paginate({ currentIndex, itemsPerPage })} 
                                            pageSizeOptions={['5','25','50','100']}
                                            current={pagination.currentIndex} 
                                            total={pagination.totalItems} 
                                            pageSize={pagination.itemsPerPage}
                                        />
                                    </Col>
                                    <Col className="hide-sm">
                                        <Pagination 
                                            simple 
                                            onChange={currentIndex => this.paginate({ currentIndex })} 
                                            onShowSizeChange={(currentIndex, itemsPerPage) => this.paginate({ currentIndex, itemsPerPage })} 
                                            pageSizeOptions={['5','25','50','100']}
                                            current={pagination.currentIndex} 
                                            total={pagination.totalItems} 
                                            pageSize={pagination.itemsPerPage}
                                        />
                                    </Col>
                                </Row>
                            </Footer>
                        </Layout>
                    </Content>
                    {renderRoutes(this.props.route.routes, { getColor, types })}
                </Layout>
            </Layout>
        )
    }
}

const mapStateToProps = state => ({
    Data: {
        items: state.Data.items,
        delete: state.Data.delete
    },
    Socket: state.Socket
})

const mapDispatchToProps = dispatch => ({
    reset: () => {
        return dispatch(Data.items.reset())
    },
    get: params => {
        return dispatch(Data.get(params))
    },
    delete: params => {
        return dispatch(Data.delete('/developer/logs', params))
    },
    onMessage: (e, data) => {
        return dispatch(Socket.onMessage(e, data))
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(Logs)
