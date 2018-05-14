import React, { PureComponent } from 'react'

import { ShallowEquals } from 'uptoo-react-utils'
import { Async, Link } from 'uptoo-react-web-elements'

class List extends PureComponent {
    shouldComponentUpdate(nextProps) {
        return ShallowEquals.diff(this.props.items, nextProps.items)
    }

    render() {
        const { loading, error, data } = this.props.items

        return (
            <div className="flex-content">
                <Async loading={loading} error={error} className="full">
                    {data.map((item, key) => {
                        return (
                            <Link key={key} to={`/databases/schemas/${item.name}`}>
                                <div className="items-list">
                                    <div className="item-content">
                                        <div className="infos">
                                            <div className="title">
                                                {item.name}
                                            </div>
                                            <div className="subtitle">
                                                {item.parent && `Schéma parent: ${item.parent}`}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        )    
                    })}
                </Async>
            </div>
        )
    }
}

export default List
