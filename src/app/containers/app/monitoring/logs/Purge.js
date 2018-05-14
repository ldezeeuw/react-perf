import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Layout, Row, Col, Icon, Button, Alert, Form, Select, Input } from 'antd'

import { Data } from 'uptoo-react-redux'
import { Link } from 'uptoo-react-web-elements'

const { Header, Sider, Content } = Layout
const { Item } = Form

const PurgeForm = Form.create()(
    class extends Component {
        constructor(props) {
            super(props)

            this.default = {
                delay: 7,
                except: ['error']
            }

            this.handleSubmit = this.handleSubmit.bind(this)
        }

        handleSubmit(e) {
            e.preventDefault()
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    this.props.action(values)
                }
            })
        }

        render() {
            const { getFieldDecorator } = this.props.form

            return (
                <Form onSubmit={this.handleSubmit}>
                    <Item label="Qui ont plus de X jours :">
                        {getFieldDecorator('delay', {
                            initialValue: this.default.delay
                        })(
                            <Input />
                        )}
                    </Item>

                    <Item label="Sauf les types">
                        {getFieldDecorator('except', {
                            initialValue: this.default.except
                        })(
                            <Select mode="multiple">
                                {this.props.types.map(option => <Select.Option 
                                    key={option.value} 
                                    value={option.value}>{option.text}
                                </Select.Option>)}
                            </Select>
                        )}
                    </Item>

                    <Item>
                        <Button type="danger" htmlType="submit" className="fluid" loading={this.props.loading}>
                            Purger les résultats
                        </Button>
                    </Item>
                </Form>
            )
        }
    }
)

class Purge extends Component {
    render() {
        const { loading, error } = this.props.Data.delete

        return (
            <Sider width={0} className="panel filter">
                <Layout style={{ height: '100%' }}>
                    <Header className="small">
                        <Row gutter={16} type="flex" justify="space-between">
                            <Col>
                                Purger les logs
                            </Col>
                            <Col>
                                <Link to="/monitoring/logs">
                                    <Icon type="close" />
                                </Link>
                            </Col>
                        </Row>
                    </Header>
                    <Content className="padding">
                        {error && <Alert message={error} type="error" showIcon />}
                        <PurgeForm 
                            action={this.props.delete}
                            loading={loading}
                            types={this.props.types} 
                        />
                    </Content>
                </Layout>
            </Sider>
        )
    }
}

const mapStateToProps = state => ({
    Data: {
        delete: state.Data.delete
    }
})

const mapDispatchToProps = dispatch => ({
    delete: params => {
        return dispatch(Data.delete('/developer/logs', params))
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(Purge)
