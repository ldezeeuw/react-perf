import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
    Button,
    Container,
    Grid,
    Icon,
    Message,
    Progress
} from 'semantic-ui-react'

import { Data, Socket } from 'uptoo-react-redux'
import { Loader, Toolbar } from 'uptoo-react-styles'
import { CRUD, ShallowEquals, Storage } from 'uptoo-react-utils'
import { Async, Socket as SocketComponent } from 'uptoo-react-web-elements'

import { API_DOMAIN, JWT_TOKEN } from './../../../../../config'

class ElasticsearchIndex extends Component {
    constructor(props) {
        super(props)

        this.token = Storage.get(JWT_TOKEN)

        let index = Data.init({data: {}})

        this.state = {
            index,
            total: 0,
            bulksize: 0,
            packets: 0,
            processId: null,
            data: {
                error: false
            }
        }

        this.getIndex = (event, props) => {
            this.setState({ data: { loading: true, error: false } })

            const { items } = this.props.Data
            const index = items.data.filter(index => index.index === props["data-indexName"])

            if (index.length > 0) {
                CRUD
                    .post({ url: index[0].url, object: { reindex: true } })
                    .then(() => {
                        this.setState({ data: { loading: false } })
                    }, err => {
                        this.setState({ data: { loading: false, error: err.message } })
                    })
            }
        }

        this.percent = this.percent.bind(this)
        this.inProgress = this.inProgress.bind(this)
    }

    shouldComponentUpdate(nextProps, nextState) {
        return ShallowEquals.shouldComponentUpdate(this, nextProps, nextState, ['Data', 'Socket', 'match'])
    }

    percent() {
        return Math.round((Number((this.state.packets * this.state.bulksize) / this.state.total * 1000)) / 10)
    }

    inProgress() {
        return this.state.bulksize * this.state.packets < this.state.total
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.Socket !== this.props.Socket) {

            let nextType = nextProps.Socket.type
            let nextIndex = nextProps.Socket.data.index
            let nextProcessId = nextProps.Socket.data.processId

            if (nextType.indexOf('elasticsearch' === 0)) {

                if (nextType === 'elasticsearch:index' && nextIndex === this.props.match.params.index && !this.inProgress()) {
                    this.setState({
                        total: nextProps.Socket.data.totalItems,
                        bulksize: nextProps.Socket.data.bulksize,
                        packets: 0,
                        processId: nextProcessId
                    })
                }

                if ((nextProcessId && this.state.processId && nextProcessId === this.state.processId)) {
                    if ((nextType === 'elasticsearch:packet' || nextType === 'elasticsearch:finish')) {
                        this.setState({
                            packets: this.state.packets += 1
                        })
                    }
                }
            }
        }

        if (nextProps.match.params.index && this.props.match.params.index && nextProps.match.params.index !== this.props.match.params.index) {
            this.setState({
                total: 0,
                bulksize: 0,
                packets: 0,
                processId: null,
                data: {
                    loading: false,
                    error: false
                }
            })
        }
    }

    renderDetails(total, bulksize, packets) {
        return (
            <div className="items-list">
                <Grid columns="2" stackable={false} className="item-content">
                    <Grid.Column width="5" textAlign="left">
                        <div>Total: </div>
                        <div>Bulksize:</div>
                        <div>Packets: </div>
                    </Grid.Column>
                    <Grid.Column width="3">
                        <div>{total}</div>
                        <div>{bulksize}</div>
                        <div>{packets}</div>
                    </Grid.Column>
                </Grid>
            </div>
        )
    }

    renderProgressBar(percent) {
        return (
            <div>
                {!(isNaN(percent)) &&
                    <Progress percent={percent} progress={percent > 5} indicating active={percent !== 100} success={percent >= 100} />
                }
            </div>
        )
    }

    renderProgressMessage(total, type, percent) {
        if (total !== 0) {
            return (
                <div className="content flex-content">
                    {(type === 'elasticsearch:index' || type === 'elasticsearch:packet') &&
                        <Message>
                            <Icon size="huge"><Loader /></Icon>Achieved: {percent}%
                        </Message>
                    }
                    {(type === 'elasticsearch:finish' || percent >= 100) &&
                        <Message>
                            <Icon size="huge" color="green" name="checkmark" />
                            Successful indexation !
                        </Message>
                    }
                </div>
            )
        }
    }

    render() {
        const percent = this.percent()
        
        return (
            <div className="panel">
                <SocketComponent url={API_DOMAIN} token={this.token} onMessage={this.props.onMessage} />
                <Async error={this.state.data.error} loading={this.state.data.loading} className="full">
                    <div className="full flex-column">
                        <Toolbar
                            bgColor="primary"
                            onClose="/databases/elasticsearch"
                            title={'Index: ' + this.props.match.params.indexName}
                            ellipsis={true}
                            subtitle={'Launch indexation to display or refresh data'}
                        />
                        <div className="flex-content">
                            <Container fluid className="margin">
                                {this.state.processId &&
                                    <div>
                                        {this.renderDetails(this.state.total, this.state.bulksize, this.state.packets)}
                                        {this.renderProgressBar(percent)}
                                        {this.renderProgressMessage(this.state.total, this.props.Socket.type, percent)}
                                    </div>
                                }
                            </Container>
                        </div>
                        <div className="footer">
                            <Container fluid textAlign="right">
                                <Button
                                    onClick={this.getIndex}
                                    data-indexName={this.props.match.params.indexName}
                                    icon="send"
                                    color="blue"
                                    content="Indexation"
                                    disabled={((this.props.Socket.type === 'elasticsearch:index' || this.props.Socket.type === 'elasticsearch:packet') && this.props.Socket.data.index === indexName)}
                                />
                            </Container>
                        </div>
                    </div>
                </Async>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    Data: {
        items: state.Data.items
    },
    Socket: state.Socket
})

const mapDispatchToProps = dispatch => ({
    onMessage: (e, data) => dispatch(Socket.onMessage(e, data))
})

export default connect(mapStateToProps, mapDispatchToProps)(ElasticsearchIndex)
