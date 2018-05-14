import React, { PureComponent } from 'react'
import {
    Container,
    Grid,
    Header as HeaderSemantic,
    Icon
} from 'semantic-ui-react'
import moment from 'moment'
import 'moment/locale/fr'
import Moment from 'react-moment'

export default class MonthPicker extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            date: moment().year(this.props.year).month(parseInt(this.props.month) - 1)
        }

        this.changeDate = this.changeDate.bind(this)
        this.month = {
            increment: () => this.changeDate(1),
            decrement: () => this.changeDate(-1),
            addYear: () => this.changeDate(12),
            subtractYear: () => this.changeDate(-12)
        }
    }

    changeDate(step) {
        let date = this.state.date.clone().add(step, 'months')

        this.setState({ date })
        
        this.props.onChange({
            startDate: moment(date).startOf('month'),
            endDate: moment(date).endOf('month')
        })
    }

    render() {
        return (
            <Container fluid>
                <HeaderSemantic size="huge">
                    <Grid columns={5} padded="vertically" verticalAlign="middle">
                        <Grid.Row centered>
                            <Grid.Column width={1}>
                                <span onClick={this.month.subtractYear} data-step={-12}>
                                    <Icon name="angle double left" size="large" link fitted />
                                </span>
                            </Grid.Column>
                            <Grid.Column width={1}>
                                <span onClick={this.month.decrement}>
                                    <Icon name="angle left" size="large" link fitted />
                                </span>
                            </Grid.Column>
                            <Grid.Column width={3} textAlign="center">
                                <span>
                                    <Moment locale="fr" format="MMMM YYYY">{this.state.date}</Moment>
                                </span>
                            </Grid.Column>
                            <Grid.Column width={1}>
                                <span onClick={this.month.increment}>
                                    <Icon name="angle right" size="large" link fitted />
                                </span>
                            </Grid.Column>
                            <Grid.Column width={1}>
                                <span onClick={this.month.addYear}>
                                    <Icon name="angle double right" size="large" link fitted />
                                </span>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </HeaderSemantic>
            </Container>
        )
    }
}

MonthPicker.propTypes = {
    year: React.PropTypes.string,
    month: React.PropTypes.string
}

MonthPicker.defaultProps = {
    year: moment().clone().format('Y'),
    month: moment().clone().format('M')
}