import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
    Button,
    Grid,
    Dropdown,
    Input
} from 'semantic-ui-react'

import { Data } from 'uptoo-react-redux'
import { Api } from 'uptoo-react-utils'
import { Form, UsersAutocomplete } from 'uptoo-react-web-elements'
import { Toolbar } from 'uptoo-react-styles'

class New extends Component {
    constructor(props) {
        super(props)

        const counters = Api.init({
            url: "/admin/counters",
            select: "name"
        })

        this.groups = Data.init({
            data: [],
            url: "/admin/groups",
            sort: "name"
        })

        this.state = {
            options: [],
            counters,
            users: []
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

        this.create = (form) => {
            this.props.post(
                "/developer/groups",
                {
                    ...form,
                    ...this.state
                }
            )
        }
    }

    componentWillMount() {
        this.getCounters()
    }

    componentWillReceiveProps(nextProps) {
        const { loading, error } = nextProps.Data.create

        if (this.props.Data.create.loading && !loading && !error) {
            this.props.history.push({ pathname: `/management/groups/${nextProps.Data.create.data._id}/details` })
        }    
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextState.counters && JSON.stringify(nextState.counters) !== JSON.stringify(this.state.counters)) {
            let options = []
            
            nextState.counters.data.forEach((counter, index) => {
                options.push({
                    key: index,
                    text: counter.name,
                    value: counter._id
                })
            })

            this.setState({ options })
        }
    }

    render() {
        return (
            <div className="panel">
                <Form action={this.create} error={this.props.Data.create.error} loading={this.props.Data.create.loading} className="full">
                    <div className="full full-panel">
                        <Toolbar
                            bgColor="primary"
                            onClose="/management/groups"
                            title={"Nouveau groupe"}
                            subtitle={`Cr\u00e9er un groupe`}
                        />
                        <div className="flex-content" style={{ backgroundColor: "#fbfbfb" }}>
                            <Grid style={{ margin: 0 }}>
                                <Grid.Column mobile={16} tablet={16} computer={16} className="form-item">
                                    <Grid.Row>
                                        <label>Nom</label>
                                        <Input name="name" fluid placeholder="Nom..." />
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
                                            placeholder="Compteurs..."
                                            selection
                                            multiple
                                            options={this.state.options}
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
                            <Button type="button" onClick={() => this.props.history.push("/management/groups")} content="Annuler" />
                            <Button type="submit" color="blue" content="Enregistrer" icon="save" labelPosition="left" />
                        </div>
                    </div>
                </Form>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    Data: {
        create: state.Data.create,
        items: state.Data.items
    }
})

const mapDispatchToProps = dispatch => ({
    post: (url, object) => dispatch(Data.post(url, object)),
    get: (params) => dispatch(Data.get(params))
})

export default connect(mapStateToProps, mapDispatchToProps)(New)