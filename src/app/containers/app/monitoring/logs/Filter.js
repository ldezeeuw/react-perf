import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Layout, Row, Col, Icon, Button, Alert, Form, Select } from 'antd'

import { Data } from 'uptoo-react-redux'
import { Link } from 'uptoo-react-web-elements'

const { Header, Sider, Content } = Layout
const { Item } = Form

const FilterForm = Form.create()(
    class extends Component {
        constructor(props) {
            super(props)

            this.default = {
                type: props.filter && props.filter.type && props.filter.type.$in || []
            }

            this.handleSubmit = this.handleSubmit.bind(this)
        }

        handleSubmit(e) {
            e.preventDefault()
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    const filter = {}

                    if (values.type && values.type.length > 0) {
                        filter.type = {
                            $in : values.type
                        }
                    }

                    this.props.action({ filter })
                }
            })
        }

        render() {
            const { getFieldDecorator } = this.props.form

            return (
                <Form onSubmit={this.handleSubmit}>
                    <Item label="Filtrer par type">
                        {getFieldDecorator('type', {
                            initialValue: this.default.type
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
                        <Button type="primary" htmlType="submit" className="fluid" loading={this.props.loading}>
                            Filtrer les résultats
                        </Button>
                    </Item>
                </Form>
            )
        }
    }
)

class Filter extends Component {
    constructor(props) {
        super(props)
        this.filter = this.filter.bind(this)
    }

    filter(params) {
        document.getElementById("content").scrollTop = 0
        
        params = Data.setParams(this.props.Data.items, params)
        params.currentIndex = 1

        this.props.get(params)
    }

    render() {
        const { loading, error, params } = this.props.Data.items

        return (
            <Sider width={0} className="panel filter">
                <Layout style={{ height: '100%' }}>
                    <Header className="small">
                        <Row gutter={16} type="flex" justify="space-between">
                            <Col>
                                Filrer les logs
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
                        <FilterForm 
                            action={this.filter} 
                            filter={params.filter}
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
        items: state.Data.items
    }
})

const mapDispatchToProps = dispatch => ({
    get: (params) => {
        return dispatch(Data.get(params))
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(Filter)
