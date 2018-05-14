import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Data } from 'uptoo-react-redux'
import { Toolbar } from 'uptoo-react-styles'
import { Async } from 'uptoo-react-web-elements'

class SchemaDetails extends Component {

    constructor(props) {
        super(props)

        this.schema = Data.init({ url: '/developer/schemas' })
    }

    componentWillMount() {
        this.props.get(this.schema, this.props.match.params.schemaName)
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.match.params.schemaName !== nextProps.match.params.schemaName) {
            this.props.get(this.schema, nextProps.match.params.schemaName)
        }
    }

    render() {
        const { loading, error, data } = this.props.Data.item
        
        return (
            <div className="panel">
                <Async error={error} loading={loading} className="full">
                    {Object.keys(data).length != 0 &&
                        <div className="full full-panel">
                            <Toolbar
                                bgColor="primary"
                                onClose="/databases/schemas"
                                title={this.props.match.params.schemaName}
                                subtitle={data.parent}
                            />
                            <div className="content flex-content">
                                <div className="codePreview">
                                    <pre>{JSON.stringify(data, null, 4)}</pre>
                                </div>
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
        item: state.Data.item
    }
})

const mapDispatchToProps = dispatch => ({
    get: (params, id) => dispatch(Data.get(params, id))
})

export default connect(mapStateToProps, mapDispatchToProps)(SchemaDetails)
