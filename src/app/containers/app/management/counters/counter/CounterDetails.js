import React, { PureComponent } from 'react'
import { Grid, Label } from 'semantic-ui-react'

export default class CounterDetails extends PureComponent {
    static renderColor(labelColor) {
        let color = ""
        let text = "Non défini"

        switch (labelColor) {
        case "info": 
            color = "teal"
            text = "Info"
            break

        case "success":
            color = "green"
            text = "Success"
            break

        case "error":
            color = "red"
            text = "Error"
            break

        case "primary":
            color = "blue"
            text = "Primary"
            break

        case "warning":
            color = "orange"
            text = "Warning"
            break

        case "dark":
            color = "black"
            text = "Dark"
            break
        }

        return (
            <div>
                {color !== "" && <Label color={color} empty circular></Label>}
                <span>{color !== "" ? ` ${text} ` : text}</span>
            </div>
        )
    }

    renderItem(title, value) {
        const text = value || "Non défini"
        
        return (
            <Grid.Row>
                <Grid.Column mobile={16} tablet={8} computer={4}>                                    
                    <label>{title}</label>
                </Grid.Column>
                <Grid.Column mobile={16} tablet={8} computer={12}>
                    <Label content={text} />
                </Grid.Column>
            </Grid.Row>
        )
    }

    render() {
        return (
            <Grid padded className="form-item">
                {this.renderItem("Limite", this.props.data.limit)}
                {this.renderItem("Unité", this.props.data.unit)}
                {this.renderItem("Couleur", CounterDetails.renderColor(this.props.data.color))}
                
                <Grid.Row>
                    <Grid.Column mobile={16} tablet={8} computer={4}>                                    
                        <label>Groupes</label>
                    </Grid.Column>
                    <Grid.Column mobile={16} tablet={8} computer={12}>
                        {this.props.data._groups && this.props.data._groups.length > 0 ? 
                            this.props.data._groups.map((group, key) => <Label key={key} content={group.name} style={{marginBottom: "0.5em"}} />)
                            :
                            <Label content="Aucun" />
                        }
                    </Grid.Column>
                </Grid.Row>

                {this.props.data.goals && this.renderItem("Nombre d'objectifs", this.props.data.goals.length)}
            </Grid>
        )
    }
}