import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import {
    Button,
    Dropdown,
    Grid,
    Input
} from 'semantic-ui-react'

import { Data } from 'uptoo-react-redux'
import { Toolbar } from 'uptoo-react-styles'
import { Api, ShallowEquals } from 'uptoo-react-utils'
import { Form } from 'uptoo-react-web-elements'

class New extends PureComponent {
    constructor(props) {
        super(props)

        const groups = Api.init({
            url: "/admin/groups",
            select: "name _users",
            populate: [{
                path: "_users",
                select: "firstName lastName picture"
            }]
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

        this.create = (form) => {
            this.props.post(
                "/admin/counters",
                { ...form }
            )
        }   
    }

    componentWillMount() {
        this.getGroups()
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.Data.create.data._id && nextProps.Data.create.data._id != this.props.Data.create.data._id) {
            this.props.get(this.props.Data.items)
            this.props.history.push(`/management/counters/${nextProps.Data.create.data._id}/details`)
        }
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
        return (
            <div className="panel">
                <Form action={this.create} error={this.props.Data.create.error} loading={this.props.Data.create.loading} className="full">
                    <div className="full full-panel">
                        <Toolbar
                            bgColor="primary"
                            onClose="/management/counters"
                            title={"Nouveau compteur"}
                            subtitle={`Cr\u00e9er un compteur`}
                        />
                        <div className="flex-content" style={{ backgroundColor: "#fbfbfb" }}>
                            <Grid style={{ margin: 0 }}>
                                <Grid.Column mobile={16} tablet={16} computer={16} className="form-item">
                                    <Grid.Row>
                                        <label>Nom</label>
                                        <Input name="name" fluid placeholder="Nom..." />
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
                        <div className="footer text-right">
                            <Button type="button" onClick={() => this.props.history.push("/management/counters")} content="Annuler" />
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
