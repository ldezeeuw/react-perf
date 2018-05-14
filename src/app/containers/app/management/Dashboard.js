import React, { Component } from 'react'
import { Button } from 'semantic-ui-react'

import { Header } from 'uptoo-react-styles'

export default class Dashboard extends Component {
    render() {
        return (
            <div id="app-content">
                <Header
                    icon="comments"
                    title="Management"
                    titleMobile="Production"
                    subtitle="Gestion des metrics" />

                <div id="page-content">
                    <div className="main">
                        <div className="flex-content">
                            <p>Bienvenue sur le tableau de bord</p>
                        </div>
                        <div className="footer">
                            <Button content="Precedent" icon="arrow left" labelPosition="left" />
                            <Button content="Suivant" icon="arrow right" labelPosition="right" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
