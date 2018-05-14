import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Checkbox } from 'semantic-ui-react'

import { ShallowEquals } from 'uptoo-react-utils'
import { Data } from 'uptoo-react-redux'
import { Form } from 'uptoo-react-web-elements'

class Tasks extends Component {
    constructor(props){
        super(props)
        
        this.state = { isDone: false }
        this.handleFilter = this.handleFilter.bind(this)
    }

    shouldComponentUpdate(nextProps) {
        return ShallowEquals.diff(this.props.Data.items, nextProps.Data.items)
    }

    handleFilter(form) {
        let filter = {}
        
        if (form.isDone) {
            filter.isDone = false
        }
        
        let params = Data.setParams(this.props.Data.items, { filter })
        this.props.get(params)
    }
    
    render() {
        const { loading, error } = this.props.Data.items

        return (
            <div>
                <h3 className="title">Filtrer les jobs</h3>
                <Form 
                    action={this.handleFilter} 
                    data={this.state}
                    error={error} 
                    loading={loading} 
                    className="filter"
                >
                    <div className="item-filter">
	                    <Checkbox name="isDone" label="En attente" />
				    </div>
                    <div className="item-filter">
                        <Button ref="btnForm" id="btnForm" fluid>
                            Rechercher
                        </Button>
                    </div>
                </Form>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    Data: {
        items: state.Data.items
    }
})

const mapDispatchToProps = dispatch => {
    return {
        get: params => {
            dispatch(Data.get(params))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Tasks)


