import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Auth } from 'uptoo-react-redux'

import Login from './forms/Login'
import Authenticator from './forms/Authenticator';

class Form extends Component {
    render() {
        const { authenticator } = this.props.Auth

        return (
            <div>
                <div className="auth-form-main">
                    { authenticator ?
                        <Authenticator 
                            action={(data) => this.props.authenticate({ ...data, authenticator })} 
                            loading={this.props.Auth.loading} 
                            error={this.props.Auth.error}
                        /> :
                        <Login 
                            action={this.props.login} 
                            loading={this.props.Auth.loading}
                            error={this.props.Auth.error} 
                        />
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({
    login: data => {
        dispatch(Auth.login(data))
    },
    authenticate: data => {
        dispatch(Auth.authenticate(data))
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(Form)
