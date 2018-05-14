import React, { Component } from 'react'
import { connect } from 'react-redux'
import { renderRoutes } from 'react-router-config'
import Moment from 'react-moment'

import { Layout, Row, Col, Icon, List, Pagination, Badge, message } from 'antd'

import { Data } from 'uptoo-react-redux'
import { Link } from 'uptoo-react-web-elements'

const { Header, Content, Footer } = Layout
const { Item } = List

const types = [
    { value: 'info', text: 'Info' },
    { value: 'success', text: 'Succès' },
    { value: 'warning', text: 'Warning' },
    { value: 'error', text: 'Erreur' }
]

const getColor = ({ isDone }) => {
    let color = 'warning'

    if (isDone) {
        color = 'success' 
    }

    console.log(color)
    return color
}

class Tasks extends Component {
    constructor(props){
        super(props)
        
        this.tasks = Data.init({
            url: "/admin/tasks",
            sort: "-_createdAt"
        })

        this.paginate = this.paginate.bind(this)
    }

    componentWillMount() {
        this.props.reset()   
    }

    componentDidMount() {
        this.props.get(this.tasks)
    }

    componentWillReceiveProps(nextProps) {
        const del = nextProps.Data.delete

        if (this.props.Data.delete.loading && !del.loading && !del.error) {
            message.success('Suppression réussie')
            this.props.get(this.props.Data.items)
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
                <Header className="header">
                    <Row type="flex" justify="space-between">
                        <Col>
                            <h3>Taches {pagination.totalItems > 0 && `(${pagination.totalItems})`}</h3>
                        </Col>
                    </Row>
                </Header>
                <Layout hasSider={true}>
                    <Content>
                        <Layout style={{ height: '100%' }}>
                            <Header className="small">
                                <Row gutter={16} type="flex">
                                    <Col>
                                        <Badge status="success" text="Envoyé" />
                                    </Col>
                                    <Col>
                                        <Badge status="warning" text="En attente" />
                                    </Col>
                                </Row>
                            </Header>
                            <Content id="content">
                                <List
                                    itemLayout="vertical"
                                    dataSource={data}
                                    loading={loading}
                                    renderItem={item => (
                                        <Link to={`/monitoring/tasks/${item._id}`}>
                                            <Item
                                                extra={<span><Icon type="clock-circle-o" /> <Moment format="DD/MM HH:mm">{item.shouldBeSentAt}</Moment></span>}
                                                // actions={[
                                                //     <span><Icon type="calendar" /> <Moment format="DD/MM/YYYY">{item._createdAt}</Moment></span>
                                                // ]}
                                            >
                                                <Item.Meta
                                                    title={<span><Badge status={getColor(item)} />MM{item.type}</span>}
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
    }
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
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(Tasks)
