import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
    Button,
    Divider,
    Grid,
    Icon,
    Label,
    Modal
} from 'semantic-ui-react'

import { Data } from 'uptoo-react-redux'
import { Picture, Toolbar } from 'uptoo-react-styles'
import { ShallowEquals } from 'uptoo-react-utils'
import { Async, Form, Link } from 'uptoo-react-web-elements'

class GroupDetails extends Component {

    constructor(props) {
        super(props)

        this.group = Data.init({
            url: "/admin/groups",
            populate: [
                {
                    path: "_counters",
                    select: "name"
                },
                {
                    path: "_users",
                    select: "firstName lastName picture"
                },
                {
                    path: "_admins",
                    select: "firstName lastName picture"                  
                }
            ]
        })

        this.state = {
            modal: false,
            users: []
        }

        this.delete = (groupId) => {
            this.props.delete("/developer/groups", groupId)
        }

        this.toggleModal = this.toggleModal.bind(this)
    }

    toggleModal(param) {
        this.setState({ modal: param })
    }

    formatDetails(user) {
        const { _id, firstName, lastName, picture } = user
        const details = {
            text: `${firstName} ${lastName}`,
            image: <Picture
                dimension="40"
                borderSize="2"
                borderStyle="solid"
                borderColor="light"
                url={picture || "https://storage.googleapis.com/uptoo/accounts/profilPicture.png"}
            />,
            value: _id,
            key: _id
        }

        return details
    }

    componentWillMount() {
        this.props.get(this.group, this.props.match.params.groupId)
    }

    componentWillReceiveProps(nextProps) {
        const { loading, error } = nextProps.Data.delete

        if (this.props.Data.delete.loading && !loading && !error) {
            this.props.history.push({ pathname: "/management/groups" })
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return ShallowEquals.shouldComponentUpdate(this, nextProps, nextState)
    }

    renderPeopleArray(title, array = []) {
        return (
            <Grid.Row>
                <Grid.Column mobile={16} tablet={8} computer={4}>                                    
                    <label>{title}</label>
                </Grid.Column>
                <Grid.Column mobile={16} tablet={8} computer={12}>
                    {array.length > 0 && array.map((person, key) => <Label key={key} content={`${person.firstName} ${person.lastName}`} style={{marginBottom: "0.5em"}} />) || <Label content="Aucun" /> }
                </Grid.Column>
            </Grid.Row>
        )
    }
    
    render() {
        const { loading, error, data } = this.props.Data.item
        
        return (
            <Async error={error} loading={loading} className="full">
                { data._id &&
                    <div className="full full-panel">
                        <Toolbar
                            bgColor="primary"
                            onClose="/management/groups"
                            title={data.name}
                            subtitle={`subtitle`}
                        />
                        <div className="flex-content panel-content">
                            <Grid padded className="form-item">
                                <Grid.Row>
                                    <Grid.Column mobile={16} tablet={8} computer={4}>                                    
                                        <label>Email</label>
                                    </Grid.Column>
                                    <Grid.Column mobile={16} tablet={8} computer={12}>
                                        <Label content={data.emailAddress || "Non défini"} />
                                    </Grid.Column>
                                </Grid.Row>
                                
                                <Grid.Row>
                                    <Grid.Column mobile={16} tablet={8} computer={4}>                                    
                                        <label>Compteurs</label>
                                    </Grid.Column>
                                    <Grid.Column mobile={16} tablet={8} computer={12}>
                                        {data._counters && data._counters.length > 0 ? 
                                            data._counters.map((counter, key) => <Label key={key} content={counter.name} style={{marginBottom: "0.5em"}} />)
                                            :
                                            <Label content="Non défini" />
                                        }
                                    </Grid.Column>
                                </Grid.Row>

                                <Grid.Row>
                                    <Grid.Column width={16}>
                                        <Divider horizontal>Utilisateurs</Divider>
                                    </Grid.Column>
                                </Grid.Row>

                                {this.renderPeopleArray("Membres", data._users)}
                                {this.renderPeopleArray("Administrateurs", data._admins)}
                            </Grid>
                        </div>
                        <div className="footer">
                            <Link to={`/management/groups/${data._id}/edit`}>
                                <Button content="Editer" icon="edit" labelPosition="left" />
                            </Link>
                            <Button onClick={() => this.toggleModal(true)} content="Supprimer" icon="trash" color="red" labelPosition="left" />
                        </div>

                        <Modal size={this.state.size} open={this.state.modal} className="modal-form">
                            <Form action={() => this.delete(data._id)} error={this.props.Data.delete.error} loading={this.props.Data.delete.loading} className="full">
                                <div className="modal-form-content">
                                    <Modal.Header>
                                        Suppression du groupe
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
                }
            </Async>
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
    delete: (url, id) => dispatch(Data.delete(url, id))
})

export default connect(mapStateToProps, mapDispatchToProps)(GroupDetails)
