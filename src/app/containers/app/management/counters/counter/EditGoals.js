import React, { PureComponent } from 'react'
import { 
    Button,
    Divider,
    Grid,
    Input
} from 'semantic-ui-react'
import moment from 'moment'

import { Form, UsersAutocomplete } from 'uptoo-react-web-elements'

import MonthPicker from './../MonthPicker'

export default class EditGoals extends PureComponent {
    constructor(props) {
        super(props)

        let goals = this.props.data && typeof this.props.data.goals !== 'undefined' && this.props.data.goals ? 
            this.parseGoals(this.props.data.goals, moment()).goals : []

        if (!goals || typeof goals == 'undefined') {
            goals = []
        }

        this.state = {
            month: moment().format('M'),
            year: moment().format('Y'),
            goals
        }
        
        this.changeDate = this.changeDate.bind(this)
    }

    changeDate({ startDate }) {
        const goals = this.props.data && this.props.data.goals ? this.parseGoals(this.props.data.goals, moment(startDate)).goals : []

        this.setState({
            month: moment(startDate).clone().format('M'),
            year: moment(startDate).clone().format('Y'),
            goals
        })
    }

    parseGoals(goals, startDate) {
        let returnValue

        if (Object.keys(this.props.data).length > 0) {
            let years = this.toSortedArray(goals).find(el => el.value === Number.parseInt(moment(startDate).clone().format('Y')))
            if (typeof years !== 'undefined' && years) {
                returnValue = years.months.find(e => e.value === Number.parseInt(moment(startDate).clone().format('M')))
                return typeof returnValue !== "undefined" ? returnValue : null
            }
        }
        return []
    }

    toSortedArray(initialArray) {        
        let array = [...initialArray]
        let goals = []
        
        array.forEach(item => {
            if (!goals.some(year => year.value === item.year )) {
                goals.push({ value: item.year, months: [] })
            }

            const year = goals.find(year => year.value === item.year)

            if (!year.months.some(month => month.value === item.month)) {
                year.months.push({ value: item.month, goals: [] })
            }
            const month = year.months.find(month => month.value === item.month)
            month.goals.push(item)
        })

        return goals
    }

    render() {
        return (
            <Grid.Column width={16}>
                <div className="list-item">
                    <MonthPicker onChange={this.changeDate} month={this.state.month} year={this.state.year}/>
                    <Form
                        data={{goals: [...this.state.goals], month: Number.parseInt(this.state.month), year: Number.parseInt(this.state.year)}}
                        action={this.props.action}
                        error={this.props.error}
                        loading={this.props.loading}
                    >
                        <Divider/>
                        <UsersAutocomplete
                            name={`goals.${this.state.goals.length}._user`}
                            types={'admin developer'}
                            itemsPerPage={5}
                            itemSelect={'picture firstName lastName email'}
                            displayResultInInput="description"
                        />
                        <Input
                            name={`goals.${this.state.goals.length}.value`}
                            type="number"
                            placeholder="Objectif"
                        />
                        <Input
                            name={`goals.${this.state.goals.length}.year`}
                            type="number"
                            className="hidden-element"
                            data-defaultValue={Number.parseInt(this.state.year)}
                        />
                        <Input
                            name={`goals.${this.state.goals.length}.month`}
                            type="number"
                            className="hidden-element"
                            data-defaultValue={Number.parseInt(this.state.month)}
                        />
                        <Button icon="add" type="submit"/>
                        <Divider/>
                        {this.state.goals.map((goal, index) => {
                            return (
                                <div className="item-panel" key={index}>
                                    <div className="title-item-panel">{goal._user.firstName} {goal._user.lastName}</div>
                                    <span className="item-rating">
                                        {goal.value} 
                                        <Input
                                            name={`goals.${index}.value`}
                                            type="number"
                                            style={{maxWidth:"100px"}}
                                        />
                                        {this.props.data.unit && ` ${this.props.data.unit}`}
                                    </span>
                                    <span>
                                        <Button
                                            icon="save"
                                            type="submit"
                                        />
                                    </span>
                                </div>
                            )
                        })}
                    </Form>
                </div>
            </Grid.Column>
        )
    }
}
