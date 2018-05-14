import React, { Component } from 'react'
import { Form, Icon, Input, Button, Alert, Row, Col, Checkbox } from 'antd'
import {PropTypes} from 'prop-types';

const { Item } = Form

class Login extends Component {
    constructor(props) {
        super(props)
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
        const { error, form } = this.props
        const { getFieldDecorator } = form

        return (
            <Form onSubmit={this.handleSubmit}>

                <div style={{ minHeight: 40, marginBottom: 10 }}>
                    {error && <Alert message={error} type="error" showIcon />}
                </div>
                
                <Item>
                    {getFieldDecorator('email')(
                        <Input size="large" prefix={<Icon type="user" />} placeholder="Votre adresse email" />
                    )}
                </Item>

                <Item>
                    {getFieldDecorator('password')(
                        <Input size="large" prefix={<Icon type="lock" />} type="password" placeholder="Mot de passe" />
                    )}
                </Item>

                <Item>
                    <Row type="flex" justify="space-between" style={{ marginTop: 30 }}>
                        <Col>
                            {getFieldDecorator('remember', {
                                valuePropName: 'checked',
                                initialValue: true
                            })(
                                <Checkbox>Se souvenir</Checkbox>
                            )}
                        </Col>
                        <Col>
                            <a href="">Mot de passe oublié</a>
                        </Col>
                    </Row>
                    <Button type="primary" htmlType="submit" className="fluid" loading={this.props.loading}>
                        Connexion
                    </Button>
                </Item>

                {/* <div className="more">
                    <Button className="fluid facebook">Facebook</Button>
                    <Button className="fluid google">Google</Button>
                    <Button className="fluid linkedin">Linkedin</Button>
                </div> */}
            </Form>
        )
    }
}

Login.propTypes = {
    action: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string
}

export default Form.create()(Login)
