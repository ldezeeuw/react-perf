import React, { Component } from 'react'
import { connect } from 'react-redux'
import { renderRoutes } from 'react-router-config'
import { Button, Grid, Input, Modal, Select } from 'semantic-ui-react'

import { Data, Socket } from 'uptoo-react-redux'
import { Header } from 'uptoo-react-styles'
import { Cookies, ShallowEquals } from 'uptoo-react-utils'
import { Form, Pagination, Socket as SocketComponent } from 'uptoo-react-web-elements'

import { API_DOMAIN, JWT_TOKEN } from './../../../../../config/globals/'
import List from './List'

const getColor = ({ type }) => {
    let color

    if (type == 'info') { color = 'teal' }
    if (type == 'warning') { color = 'orange'}
    if (type == 'error') { color = 'red' }
    if (type == 'success') { color = 'green' }

    return color
}

const getIcon = ({ type }) => {
    let icon

    if (type == 'info') { icon = 'info circle' }
    if (type == 'warning') { icon = 'warning sign'}
    if (type == 'error') { icon = 'remove circle' }
    if (type == 'success') { icon = 'check circle' }

    return icon
}

class Logs extends Component {
    constructor(props){
        super(props)
        
        this.logs = Data.init({
            url: "/developer/logs",
            sort: "-_createdAt"
        })

        this.state = {
            newLogs: 0,
            modal: false
        }

        this.token = Cookies.get(JWT_TOKEN)

        this.types = [
            { key: 'info', value: 'info', text: 'Info' },
            { key: 'success', value: 'success', text: 'Succès' },
            { key: 'warning', value: 'warning', text: 'Warning' },
            { key: 'error', value: 'error', text: 'Erreur' }
        ]

        this.default = {
            delay: 7,
            except: ['error']
        }

        this.paginate = this.paginate.bind(this)
    }

    componentWillMount() {
        this.props.get(this.logs)        
    }

    componentWillReceiveProps(nextProps) {
        const { loading, error } = nextProps.Data.items
        const del = nextProps.Data.delete

        if (this.props.Data.items.loading && !loading && !error) {
            this.setState({ newLogs: 0 })
        }

        if (this.props.Data.delete.loading && !del.loading && !del.error) {
            this.props.get(this.props.Data.items)
        }

        if (this.props.Socket !== nextProps.Socket && nextProps.Socket.type == 'log:new') {
            this.setState({ newLogs: this.state.newLogs + 1 })
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return ShallowEquals.shouldComponentUpdate(this, nextProps, nextState)
    }

    paginate(params) {
        params = Data.setParams(this.props.Data.items, params)
        this.props.get(params)
    }

    render() {
        const { pagination } = this.props.Data.items

        return (
		    <div id="app-content">
                <SocketComponent 
                    url={API_DOMAIN} 
                    token={this.token} 
                    onMessage={this.props.onMessage}
                />
                <Modal 
                    size="small" 
                    open={this.state.modal} 
                    onClose={() => this.setState({ modal: false })} 
                    className="modal-form"
                >
                    <Modal.Header>Supprimer les logs</Modal.Header>
                    <Form 
                        action={this.props.deleteItems} 
                        loading={this.props.Data.delete.loading}
                        error={this.props.Data.delete.error}
                        data={this.default}   
                        className="full"
                    >
                        <Modal.Content>
                            <Grid style={{margin: 0}}>
                                <Grid.Column mobile={16} tablet={8} computer={8}>
                                    <label>Qui ont plus de X jours :</label>
                                    <Input fluid name="delay" type="text" placeholder="Prénom"/>
                                </Grid.Column>
                                <Grid.Column mobile={16} tablet={8} computer={8}>
                                    <label>Sauf les types</label>
                                    <Select name="except" defaultValue={0} fluid search multiple options={this.types} />
                                </Grid.Column>
                            </Grid>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button type="button" onClick={() => this.setState({ modal: false })} icon="close" labelPosition="left" content="Fermer" />
                            <Button color="red" icon="trash" labelPosition="right" content="Supprimer" />
                        </Modal.Actions>
                    </Form>
                </Modal>

                <Header title="Liste des Logs" icon="smile" subtitle="Affiche la liste des logs triés par date décroissante">
                    {this.state.newLogs !== 0 && 
                        <Button 
                            onClick={() => this.props.get(this.logs)} 
                            icon="refresh" 
                            labelPosition="left" 
                            content={`${this.state.newLogs} nouveaux logs à afficher`}
                        />
                    }
                    <Button 
                        onClick={() => this.setState({ modal: true })}
                        content="Supprimer" 
                        color="red" 
                        icon="trash" 
                        labelPosition="right"
                    />
                </Header>

                <div id="page-content">
		            <div className="main">
                        <List items={this.props.Data.items} getColor={getColor} getIcon={getIcon} />
                        <Pagination action={this.paginate} {...pagination} />
                    </div>
                    {renderRoutes(this.props.route.routes, { getColor })}
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    Data: {
        items: state.Data.items,
        delete: state.Data.delete
    },
    Socket: state.Socket
})

const mapDispatchToProps = dispatch => ({
    get: params => dispatch(Data.get(params)),
    delete: params => dispatch(Data.delete('/developer/logs', params)),
    onMessage: (e, data) => dispatch(Socket.onMessage(e, data))
})

export default connect(mapStateToProps, mapDispatchToProps)(Logs)
