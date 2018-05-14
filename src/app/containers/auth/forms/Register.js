import React, { Component } from 'react'
import { Button, Input } from 'semantic-ui-react'
import {PropTypes} from 'prop-types';
import { Form } from 'uptoo-react-web-elements'

/*
 * TODO : Refaire le registrer avec Ant Design
 */

export default class Register extends Component {
    render() {
        return (
            <Form action={this.props.action} error={this.props.status.error} loading={this.props.status.loading}>
                <Input icon="user" iconPosition="left" type="text" name="firstName" autoComplete="false" placeholder="Prénom" />
                <Input icon="user" iconPosition="left" type="text" name="lastName" autoComplete="false" placeholder="Nom" />
                <Input icon="mail outline" iconPosition="left" type="email" name="email" autoComplete="false" placeholder="Adresse e-mail" />
                <Input icon="key" iconPosition="left" type="password" name="password" autoComplete="false" placeholder="Mot de passe" />
                <Input icon="key" iconPosition="left" type="confirmPassword" name="password" autoComplete="false" placeholder="Confirmez le mot de passe" />
                <Button id="button-desktop" className="custom dark" fluid>Créer mon compte ! now</Button>
                <input type="submit" id="submit-mobile" className="custom dark hidden-element" />
            </Form>
        )
    }
}

Register.propTypes = {
    action: PropTypes.func.isRequired,
    status: PropTypes.object.isRequired
}
