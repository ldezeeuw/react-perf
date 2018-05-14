import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Layout, Row, Col, Icon, Badge, Button, Alert, Spin, Modal } from 'antd'

import { ShallowEquals } from 'uptoo-react-utils'
import { Data } from 'uptoo-react-redux'
import { Link } from 'uptoo-react-web-elements'

const { Header, Footer, Sider, Content } = Layout

class Log extends Component {
    constructor(props) {
        super(props)
        
        this.log = Data.init({
            url: "/developer/logs"
        })
        
        this.state = { modal: false }
    }

    componentWillMount() {
        this.props.get(this.log, this.props.match.params.logId)
    }

    componentWillReceiveProps(nextProps) {
        const { loading, error } = nextProps.Data.delete

        if (this.props.match.params.logId != nextProps.match.params.logId) {
            this.props.get(this.log, nextProps.match.params.logId)
        }
        
        if (this.props.Data.delete.loading && !loading && !error) {
            this.props.history.push({ pathname: '/monitoring/logs' })
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return ShallowEquals.shouldComponentUpdate(this, nextProps, nextState)
    }

    render() {
        const { loading, error, data } = this.props.Data.item
        const { modal } = this.state

        return (
            <Sider width={0} className="panel">
                <Modal 
                    cancelText="Annuler"
                    okText="Supprimer"
                    okType="danger"
                    onOk={() => this.props.delete(data._id)}
                    confirmLoading={this.props.Data.delete.loading}
                    visible={modal} 
                    onCancel={() => this.setState({ modal: false })}
                    title="Suppression du log"
                >
                    <p>Attention cette action est irréversible.</p>
                </Modal>
                <Layout style={{ height: '100%' }}>
                    <Header className="small">
                        <Row gutter={16} type="flex" justify="space-between">
                            <Col>
                                <Badge status={this.props.getColor(data)} />
                                {loading ? 
                                    'Chargement' 
                                    : data.message ?
                                        data.message.length > 70 ?
                                            `${data.message.slice(0, 70)}...` 
                                            : data.message
                                        : "Log sans titre"
                                }
                            </Col>
                            <Col>
                                <Link to="/monitoring/logs">
                                    <Icon type="close" />
                                </Link>
                            </Col>
                        </Row>
                    </Header>
                    <Content className="padding code">
                        <Spin spinning={loading}>
                            {error && <Alert message={error} type="error" showIcon /> }
                            {data._id == this.props.match.params.logId && <pre>{JSON.stringify(data, null, 2)}</pre>}
                        </Spin>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                        {data._id && <Button 
                            onClick={() => this.setState({ modal: true })} 
                            type="danger"
                        >
                            <Icon type="delete" />Supprimer
                        </Button> }
                    </Footer>
                </Layout>
            </Sider>
        )
    }
}

const mapStateToProps = state => ({
    Data: {
        item: state.Data.item,
        delete: state.Data.delete
    }
})

const mapDispatchToProps = dispatch => ({
    get: (params, id) => dispatch(Data.get(params, id)),
    delete: params => dispatch(Data.delete('/developer/logs', params))
})

export default connect(mapStateToProps, mapDispatchToProps)(Log)
