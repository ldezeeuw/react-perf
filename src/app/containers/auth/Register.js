import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Divider } from 'semantic-ui-react'

import { Form } from 'uptoo-react-web-elements'
import { Auth, Link } from 'uptoo-react-redux'

/*
 * TODO : Refaire le registrer avec Ant Design
 */

class Register extends Component {
    render() {
        return (
            <div>
                <div className="auth-form-main">
                    <Form action={this.props.register} error={this.props.Auth.error} loading={this.props.Auth.loading} />
                    <Divider horizontal>ou</Divider>
                    <Button className="custom" fluid content="Inscrivez-vous avec Linkedin" icon="linkedin" labelPosition="left" />
                    <Link to="/auth/login" className="auth-signup">Déjà inscris ? Connecte-toi</Link>
                </div>
                <div className="footer-auth-app">
                    <Link to="/auth/login">Déjà inscris ?</Link>
                    <label htmlFor="submit-mobile" className="btn-color">Créer mon compte</label>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return { ...state }
}

const mapDispatchToProps = dispatch => ({
    register: (data) => {
	    dispatch(Auth.register(data))
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(Register)
