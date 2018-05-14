import React, { Component } from 'react'
import { Form, Icon, Input, Button, Alert } from 'antd'
import {PropTypes} from 'prop-types';

const { Item } = Form

class Authenticator extends Component {
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
                    {getFieldDecorator('digicode')(
                        <Input size="large" prefix={<Icon type="lock" />} placeholder="Digicode à 6 chiffres" />
                    )}
                </Item>

                <Item>
                    <Button type="primary" htmlType="submit" className="fluid" loading={this.props.loading}>
                        Connexion
                    </Button>
                </Item>
            </Form>
        )
    }
}

Authenticator.propTypes = {
    action: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string
}

export default Form.create()(Authenticator)