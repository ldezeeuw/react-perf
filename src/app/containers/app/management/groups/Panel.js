import React, { Component } from 'react'
import { connect } from 'react-redux'
import { renderRoutes } from 'react-router-config'

import { Data } from 'uptoo-react-redux'
import { ShallowEquals } from 'uptoo-react-utils'
import { Async } from 'uptoo-react-web-elements'

class Panel extends Component {
    constructor(props) {
        super(props)

        this.group = Data.init({
            url: `/admin/groups`,
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
    }

    componentWillMount() {
        this.props.get(this.group, this.props.match.params.groupId)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.match.params.groupId !== this.props.match.params.groupId) {
            this.props.get(this.group, nextProps.match.params.groupId)
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return ShallowEquals.shouldComponentUpdate(this, nextProps, nextState)
    }

    render() {
        const { item } = this.props.Data

        return (
            <div className="panel">
                <Async data={item} className="full">
                    {renderRoutes(this.props.route.routes)}
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

export default connect(mapStateToProps, mapDispatchToProps)(Panel)
