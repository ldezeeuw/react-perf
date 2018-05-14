import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Container } from 'semantic-ui-react'

import { Socket } from 'uptoo-react-redux'
import { Loader, Toolbar } from 'uptoo-react-styles'
import { Api, Cookies, ShallowEquals } from 'uptoo-react-utils'
import { Socket as SocketComponent } from 'uptoo-react-web-elements'

import { API_DOMAIN, JWT_TOKEN } from './../../../../../config'

class BuildDetails extends Component {
    constructor(props) {
        super(props)

        let build = Api.init({ data: {} })

        this.state = {
            build,
            status: null,
            message: null
        }

        this.getBuild = buildName => {
            Api.getItem(
                { url: `/developer/build/${buildName}` },
                this,
                'build'
            )
        }

        this.token = Cookies.get(JWT_TOKEN)
    }

    shouldComponentUpdate(nextProps, nextState) {
        return ShallowEquals.shouldComponentUpdate(this, nextProps, nextState)
    }

    componentWillReceiveProps(nextProps) {
        if ((nextProps.Socket.type == 'build:start' || nextProps.Socket.type == 'build:finish') && nextProps.Socket !== this.props.Socket && nextProps.Socket.data.app == this.props.match.params.buildName) {
            this.state.status = nextProps.Socket.type
            this.state.message = nextProps.Socket.data.message
        }
        else if (nextProps.match.params.buildName !== this.props.match.params.buildName) {
            this.state.status = null
            this.state.message = null
        }
    }

    render() {
        const buildName = this.props.match.params.buildName.charAt(0).toUpperCase() + this.props.match.params.buildName.slice(1)

        return (
            <div className="panel">
                <SocketComponent url={API_DOMAIN} token={this.token} onMessage={this.props.onMessage} />
                <div className="full full-panel">
                    <Toolbar
                        bgColor="primary"
                        onClose="/structure/build"
                        title={buildName}
                        subtitle={`Build ${buildName} in ${process.env.NODE_ENV} environment`}
                    />
                    <div className="content flex-content">
                        {this.state.message}
                        {(this.state.status == 'build:start' && this.props.match.params.buildName == 'api') &&
                            <div>Once the API restarts, please wait approximately 1 minute and refresh your browser. </div>
                        }
                        {this.state.status == 'build:start' &&
                            <Loader />
                        }
                        {this.state.status == 'build:finish' &&
                            <div className="ui icon message">
                                <i className="green checkmark icon" size="massive"></i>
                                <div className="content">
                                    <p> Build effectué !</p>
                                </div>
                            </div>
                        }
                    </div>
                    <div className="footer">
                        <Container fluid textAlign="right">
                            <Button onClick={() => { this.getBuild(this.props.match.params.buildName) }} icon="checkmark" color="blue" labelPosition="right" content="Build" />
                        </Container>
                    </div>

                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    Socket: state.Socket
})

const mapDispatchToProps = dispatch => ({
    onMessage: (e, data) => dispatch(Socket.onMessage(e, data))
})

export default connect(mapStateToProps, mapDispatchToProps)(BuildDetails)
