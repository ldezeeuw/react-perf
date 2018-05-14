import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
    Button,
    Container,
    Dropdown,
    Input,
    Grid
} from 'semantic-ui-react'

import { Data } from 'uptoo-react-redux'
import { Toolbar } from 'uptoo-react-styles'
import { Api, ShallowEquals } from 'uptoo-react-utils'
import { Form, UsersAutocomplete } from 'uptoo-react-web-elements'

class Edit extends Component {
    constructor(props) {
        super(props)

        this.state = {
            counters: [],
            countersList: []
        }

        this.getCounters = () => {
            Api.getItems(
                {
                    url: "/admin/counters",
                    sort: "name"
                },
                this,
                "counters"
            )
        }

        this.edit = (form) => {
            const data = {
                _id: this.props.match.params.groupId,
                ...form,
                ...this.state
            }

            this.props.put(
                "/developer/groups",
                data
            )
        }
    }

    componentWillMount() {
        this.getCounters()
    }

    componentWillReceiveProps(nextProps) {        
        if (this.props.Data.edit.loading && !nextProps.Data.edit.loading && !nextProps.Data.edit.error) {
            this.props.history.push({ pathname: `/management/groups/${nextProps.match.params.groupId}/details` })
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextState.counters && nextState.counters.data !== this.state.counters.data && Array.isArray(nextState.counters.data)) {
            let countersList = []

            nextState.counters.data.forEach((counter, index) => {
                countersList.push({
                    key: index,
                    text: counter.name,
                    value: counter._id
                })
            })            
            this.setState({ countersList })
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return ShallowEquals.shouldComponentUpdate(this, nextProps, nextState)
    }

    render() {
        const { data } = this.props.Data.item
        let _counters = []
        if (this.props.Data.item.data._counters) {
            this.props.Data.item.data._counters.forEach((counter) => {
                _counters.push(counter._id)
            })
        }
        const group = {
            name: data.name,
            emailAddress: data.emailAddress,
            _counters,
            _users: data._users,
            _admins: data._admins
        }

        return (
            <div className="full">
                <Form action={this.edit} data={group} error={this.props.Data.edit.error} loading={this.props.Data.edit.loading} className="full">
                    <div className="full full-panel">
                        <Toolbar
                            bgColor="primary"
                            onClose="/management/groups"
                            title={data.name}
                            subtitle={`Editer le groupe`}
                        />
                        <div className="flex-content" style={{ backgroundColor: "#fbfbfb" }}>
                            <Grid style={{ margin: 0 }} className="form-item">
                                <Grid.Column mobile={16} tablet={16} computer={16}>
                                    <Grid.Row>
                                        <label>Nom</label>
                                        <Input name="name" fluid placeholder="Nom..."/>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <label>Email</label>
                                        <Input name="emailAddress" fluid placeholder="Email..."/>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <label>Compteurs</label>
                                        <Dropdown
                                            name="_counters"
                                            fluid
                                            multiple
                                            selection
                                            placeholder="Compteurs..."
                                            options={this.state.countersList}
                                        />
                                    </Grid.Row>
                                    <Grid.Row>
                                        <label>Membres</label>
                                        <UsersAutocomplete
                                            name="_users"
                                            types={'admin developer'}
                                            itemsPerPage={5}
                                            itemSelect={'picture firstName lastName'}
                                        />
                                    </Grid.Row>
                                    <Grid.Row>
                                        <label>Administrateurs</label>
                                        <UsersAutocomplete
                                            name="_admins"
                                            types={'admin developer'}
                                            itemsPerPage={5}
                                            itemSelect={'picture firstName lastName'}
                                        />
                                    </Grid.Row>
                                </Grid.Column>
                            </Grid>
                        </div>
                        <div className="footer">
                            <Container fluid textAlign="right">
                                <Button color="blue" content="Enregistrer" icon="save" labelPosition="left" />
                            </Container>
                        </div>
                    </div>
                </Form>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    Data: {
        item: state.Data.item,
        edit: state.Data.edit
    }
})

const mapDispatchToProps = dispatch => ({
    get: params => dispatch(Data.get(params)),
    put: (url, object) => dispatch(Data.put(url, object))
})

export default connect(mapStateToProps, mapDispatchToProps)(Edit)
