import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { Button, Modal } from 'semantic-ui-react'

import { ShallowEquals } from 'uptoo-react-utils'
import { Data } from 'uptoo-react-redux'
import { Async } from 'uptoo-react-web-elements'
import { Toolbar } from 'uptoo-react-styles'

class Task extends Component {
    constructor(props) {
        super(props)

        this.task = Data.init({ url: '/admin/tasks' })

        this.state = { modal: false }
    }

    componentWillMount() {
        this.props.get(this.task, this.props.match.params.taskId)
    }

    componentWillReceiveProps(nextProps) {
        const { loading, error } = nextProps.Data.delete
        
        if (this.props.match.params.taskId != nextProps.match.params.taskId) {
            this.props.get(this.task, nextProps.match.params.taskId)
        }
        
        if (this.props.Data.delete.loading && !loading && !error) {
            this.props.history.push({ pathname: '/monitoring/tasks' })
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return ShallowEquals.shouldComponentUpdate(this, nextProps, nextState)
    }

    render() {
        const { loading, error, data } = this.props.Data.item
        const { modal } = this.state
        
        return (
            <div className="panel">
                <Modal size="small" open={modal} onClose={() => this.setState({ modal: false })} className="modal-form">
                    <Modal.Header>Suppression de la task</Modal.Header>
                    <Modal.Content>Attention cette action est irréversible.</Modal.Content>
                    <Modal.Actions>
                        <Button 
                            onClick={() => this.setState({ modal: false })}
                            type="button" 
                            content="Quitter"
                            icon="close" 
                            labelPosition="left"
                        />
                        <Button 
                            onClick={() => this.props.delete(data._id)}
                            content="Supprimer"
                            color="red" 
                            icon="trash"
                            labelPosition="right"
                        />
                    </Modal.Actions>
                </Modal>
                <Async error={error} loading={loading} className="full">
                    {this.props.match.params.taskId == data._id &&
                        <div className="full full-panel">
                            <Toolbar
                                bgColor={this.props.getColor(data)}
                                onClose="/monitoring/tasks"
                                title={data.message}
                                subtitle={`Envoi le ${moment(data.shouldBeSentAt).format("DD/MM/YYYY")} à ${moment(data.shouldBeSentAt).format("HH:mm:ss")}`}                                
                            />
                            <div className="content flex-content">
                                <div className="codePreview">
                                    <pre>{JSON.stringify(data, null, 2)}</pre>
                                </div>
                            </div>
                            <div className="footer">
                                <span />
                                <Button 
                                    onClick={() => this.setState({ modal: true })} 
                                    content="Supprimer"
                                    icon="trash" 
                                    color="red" 
                                    labelPosition="right"  
                                />
                            </div>
                        </div>
                    }
                </Async>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    Data: {
        item: state.Data.item,
        delete: state.Data.delete
    }
})

const mapDispatchToProps = dispatch => ({
    get: (params, id) => dispatch(Data.get(params, id)),
    delete: params => dispatch(Data.delete('/developer/tasks', params))
})

export default connect(mapStateToProps, mapDispatchToProps)(Task)
