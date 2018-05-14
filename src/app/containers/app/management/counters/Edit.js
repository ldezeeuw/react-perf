import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
    Button,
    Container,
    Dropdown,
    Grid,
    Input
} from 'semantic-ui-react'

import { Data } from 'uptoo-react-redux'
import { Toolbar } from 'uptoo-react-styles'
import { Api, ShallowEquals } from 'uptoo-react-utils'
import { Form } from 'uptoo-react-web-elements'

class Edit extends Component {
    constructor(props) {
        super(props)

        const groups = Api.init({
            data: [],
            url: "/admin/groups",
            select: "name"
        })

        this.state = {
            groups,
            options: []
        }

        this.getGroups = () => {
            Api.getItems(
                { url: "/admin/groups" },
                this,
                "groups"
            )
        }

        this.edit = (form) => {
            const data = {
                _id: this.props.match.params.counterId,
                ...form,
                ...this.state
            }

            this.props.put(
                '/admin/counters',
                data
            )
            this.props.history.push(`/management/counters/${this.props.match.params.counterId}/details`)
        }
    }

    componentDidMount() {
        this.getGroups()
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextState.groups && nextState.groups !== this.state.groups) {
            let options = []
            nextState.groups.data.forEach((group, index) => {
                options.push({
                    key: index,
                    text: group.name,
                    value: group._id
                })
            })

            this.setState({ options })
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return ShallowEquals.shouldComponentUpdate(this, nextProps, nextState)
    }

    render() {
        const { data } = this.props.Data.item
        let _groups = []
        if (this.props.Data.item.data._groups) {
            this.props.Data.item.data._groups.forEach((group) => {
                _groups.push(group._id)
            })
        }
        const counter = {
            name: data.name,
            unit: data.unit,
            limit: data.limit,
            color: data.color,
            _groups
        }

        return (
            <div className="panel">
                <div className="full">
                    <Form action={this.edit} data={counter} error={this.props.Data.edit.error} loading={this.props.Data.edit.loading} className="full">
                        <div className="full full-panel">
                            <Toolbar
                                bgColor="primary"
                                onClose="/management/counters"
                                title={counter.name}
                                subtitle={`Editer le compteur`}
                            />
                            <div className="flex-content" style={{ backgroundColor: "#fbfbfb" }}>
                                <Grid style={{ margin: 0 }} className="form-item">
                                    <Grid.Column mobile={16} tablet={16} computer={16}>
                                        <Grid.Row>
                                            <label>Nom</label>
                                            <Input name="name" fluid placeholder="Nom..."/>
                                        </Grid.Row>
                                        <Grid.Row>
                                            <label>Unité</label>
                                            <Input name="unit" fluid placeholder="Unité..." />
                                        </Grid.Row>
                                        <Grid.Row>
                                            <label>Limite</label>
                                            <Input name="limit" type="number" fluid placeholder="Limite..." />
                                        </Grid.Row>
                                        <Grid.Row>
                                            <label>Couleur</label>
                                            <Dropdown
                                                name="color"
                                                fluid
                                                placeholder="Couleur..."
                                                selection
                                                options={[
                                                    { key: 0, text: "Couleur...", value: "" },
                                                    { key: 1, text: <Dropdown.Item label={{ color: "teal", empty: true, circular: true }} text=" Info" />, value: "info" },
                                                    { key: 2, text: <Dropdown.Item label={{ color: "green", empty: true, circular: true }} text=" Success" />, value: "success" },
                                                    { key: 3, text: <Dropdown.Item label={{ color: "red", empty: true, circular: true }} text=" Error" />, value: "error" },
                                                    { key: 4, text: <Dropdown.Item label={{ color: "blue", empty: true, circular: true }} text=" Primary" />, value: "primary" },
                                                    { key: 5, text: <Dropdown.Item label={{ color: "orange", empty: true, circular: true }} text=" Warning" />, value: "warning" },
                                                    { key: 6, text: <Dropdown.Item label={{ color: "black", empty: true, circular: true }} text=" Dark" />, value: "dark" }
                                                ]}
                                            />
                                        </Grid.Row>
                                        <Grid.Row>
                                            <label>Groupes</label>
                                            <Dropdown
                                                name="_groups"
                                                fluid
                                                placeholder="Groupes..."
                                                selection
                                                multiple
                                                options={this.state.options}
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
            </div>
        )
    }
}

const mapStateToProps = state => ({
    Data: state.Data
})

const mapDispatchToProps = dispatch => ({
    put: (url, object) => dispatch(Data.put(url, object))
})

export default connect(mapStateToProps, mapDispatchToProps)(Edit)
