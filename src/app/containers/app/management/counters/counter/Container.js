import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Grid, Icon, Modal } from 'semantic-ui-react'

import { Data } from 'uptoo-react-redux'
import { Toolbar } from 'uptoo-react-styles'
import { ShallowEquals } from 'uptoo-react-utils'
import { Async, Form, Link } from 'uptoo-react-web-elements'

import CounterDetails from './CounterDetails'
import EditGoals from './EditGoals'

class Container extends Component {
    constructor(props) {
        super(props)

        this.counter = Data.init({
            url: "/admin/counters",
            select: "color goals limit name unit _groups",
            populate: [
                {
                    path: "goals._user",
                    select: "firstName lastName picture"
                },
                {
                    path: "_groups",
                    select: "name"
                }
            ]
        })

        this.timeouts = []

        this.state = {
            error: null
        }

        this.colors = {
            info: "teal",
            success: "green",
            error: "red",
            primary: "blue",
            warning: "orange",
            dark: "black"
        }

        // this.delete = () => {
        //     this.props.delete("/developer/counters", this.props.match.params.counterId)
        // }

        this.edit = (form) => {
            const { year, month } = form
            let goals = []
            let length = typeof form.goals[form.goals.length - 1]._user !== 'undefined' ? (Array.isArray(form.goals[form.goals.length - 1]._user) ? form.goals[form.goals.length - 1]._user.length : Object.keys(form.goals[form.goals.length - 1]._user).length) : 0
            if (
                (
                    (length > 0) && (typeof form.goals[form.goals.length - 1].value === 'undefined' || form.goals[form.goals.length - 1].value === '') ||
                    (typeof form.goals[form.goals.length - 1]._user === 'undefined' || length === 0) && (typeof form.goals[form.goals.length - 1].value !== 'undefined' && form.goals[form.goals.length - 1].value !== '')
                ) &&
                typeof form.goals[form.goals.length - 1].month !== 'undefined' &&
                typeof form.goals[form.goals.length - 1].year !== 'undefined') {

                console.warn("Cannot validate a counter without a value or a user!")
                this.setState({error: "Cannot validate a counter without a value or a user!"})
                this.timeouts = setTimeout(() => {
                    this.setState({error: ''})
                }, 5000)
            } else {
                form.goals.forEach(item => {
                    const goal = {
                        _user: item._user,
                        value: item.value,
                        year: item.year,
                        month: item.month
                    }
                    
                    goals.push(goal)
                })
                
                
                this.props.put(
                    `/admin/counters/${this.props.match.params.counterId}/goals`,
                    {
                        goals,
                        year,
                        month
                    }
                )
            }
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return ShallowEquals.shouldComponentUpdate(this, nextProps, nextState, ['Data', 'location', 'history'])
    }

    toggleModal(param) {
        this.setState({ modal: param })
    }

    componentWillMount() {
        this.props.get(this.counter, this.props.match.params.counterId)
    }

    componentWillUnmount() {
        this.timeouts.forEach(val => {
            clearInterval(val)
        })
    }

    componentWillReceiveProps(nextProps) {
        const { loading, error } = nextProps.Data.item

        if (nextProps.match.params.counterId && nextProps.match.params.counterId !== this.props.match.params.counterId) {
            this.props.get(this.counter, nextProps.match.params.counterId)
        }
        else if (nextProps.Data.edit.data._id && nextProps.Data.edit.data._id !== this.props.Data.edit.data._id) {
            this.props.get(this.counter, nextProps.match.params.counterId)
        }
        else if (this.props.Data.delete.loading && !loading && !error) {
            this.props.history.push({ pathname: "/management/counters" })
        }
    }

    render() {
        const { loading, error, data } = this.props.Data.item

        return (
            <div className="panel">
                <Async error={error || this.state.error} loading={loading} className="full">

                    <div className="full full-panel">
                        <Toolbar
                            bgColor="primary"
                            onClose="/management/counters"
                            title={data.name}
                            subtitle={`subtitle`}
                        />
                        <div className="flex-content panel-content">
                            <Grid>
                                <CounterDetails data={data} />
                                <EditGoals
                                    data={data.goals ? data : null}
                                    action={this.edit}
                                    loading={loading}
                                    error={error}
                                />
                            </Grid>
                        </div>

                        <div className="footer">
                            <Link to={`/management/counters/${data._id}/edit`}>
                                <Button content="Editer" icon="edit" labelPosition="left" />
                            </Link>
                            <Button onClick={() => this.toggleModal(true)} content="Supprimer" icon="trash" color="red" labelPosition="left" />
                        </div>

                        <Modal size={this.state.size} open={this.state.modal} className="modal-form">
                            <Form action={() => this.props.delete(data._id)} error={this.props.Data.delete.error} loading={this.props.Data.delete.loading} className="full">
                                <div className="modal-form-content">
                                    <Modal.Header>
                                        Suppression du compteur
                                        <Icon link onClick={() => this.toggleModal(false)} name="close" className="close" />
                                    </Modal.Header>
                                    <Modal.Content content="Attention, cette action est irréversible." />
                                    <Modal.Actions>
                                        <Button type="button" icon="close" onClick={() => this.toggleModal(false)} labelPosition="left" content="Annuler" />
                                        <Button color="blue" icon="checkmark" labelPosition="right" content="Valider" />
                                    </Modal.Actions>
                                </div>
                            </Form>
                        </Modal>
                    </div>
                </Async>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    Data: state.Data
})

const mapDispatchToProps = dispatch => ({
    get: (params, id) => dispatch(Data.get(params, id)),
    put: (url, object) => dispatch(Data.put(url, object)),
    delete: (params) => {
        dispatch(Data.delete('/developer/counters', params))
        dispatch(Data.items.delete(params))
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(Container)
