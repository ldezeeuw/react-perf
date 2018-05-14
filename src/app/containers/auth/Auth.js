import React, { Component } from 'react'
import { connect } from 'react-redux'
import { renderRoutes } from 'react-router-config'
import { Redirect } from 'react-router-dom'

import { Template } from 'uptoo-react-redux'

class Auth extends Component {
    componentWillReceiveProps(nextProps) {
        if (nextProps.location.pathname != this.props.location.pathname) {
            this.props.resetErrors()
        }
    }

    render() {
        if (this.props.Auth.user) {
            return <Redirect to="/monitoring/dashboard" />
        }

        return (
            <div id="auth">
                <div className="content">
                    <div className="text-center">
                        <img className="logo" src="https://storage.googleapis.com/uptoo-developer/illustrations_public/logo_uptoo.png" />
                    </div>
                    {renderRoutes(this.props.route.routes)}
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({
    resetErrors: () => {
        dispatch(Template.resetErrors())
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(Auth)
