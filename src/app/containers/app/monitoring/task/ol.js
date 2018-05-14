import React, { Component } from 'react'
import Moment from 'react-moment'

import { ShallowEquals } from 'uptoo-react-utils'
import { Link, Async } from 'uptoo-react-web-elements'

class List extends Component {
    shouldComponentUpdate(nextProps) {
        return ShallowEquals.diff(this.props.items, nextProps.items)
    }

    render() {
        const { loading, error, data } = this.props.items

        return (
            <div className="flex-content">
                <Async error={error} loading={loading} className="full">
                    {data.map((item, key) => {
                        return <Link key={key} to={'/monitoring/tasks/' + item._id}>
                            <div className="items-list">
                                <div className="item-content">
                                    <div className="infos">
                                        <div className="title">
                                            {item.type && `Tâche de type ${item.type}`}
                                        </div>
                                        <div className="subtitle">
                                            Envoi le <Moment format="DD/MM/YYYY [à] HH:mm:ss">{item.shouldBeSentAt}</Moment>
                                        </div>
                                    </div>
                                </div>
                                <div className="item-details">
                                    {this.props.renderIcon(item)}
                                </div>
                            </div>
                        </Link>
                    })}
                </Async>
            </div>          
        )
    }
}

export default List
