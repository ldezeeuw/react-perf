import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Layout, Row, Col } from 'antd'

const { Header, Content } = Layout

class Dashboard extends Component {
    render() {
        return (
            <Layout id="main">
                <Header className="header">
                    <Row type="flex" justify="space-between">
                        <Col>
                            <h3>Monitoring</h3>
                        </Col>
                        <Col>
                            {/* <Button>Ajouter</Button> */}
                        </Col>
                    </Row>
                </Header>
                <Content className="padding">
                    Bienvenue sur le tableau de bord
                </Content>
                {/* <Footer>
                    <Row type="flex" justify="space-between">
                        <Col>
                            <Button>Précédent</Button>
                        </Col>
                        <Col>
                            <Button>Suivant</Button>
                        </Col>
                    </Row>
                </Footer> */}
            </Layout>
        )
    }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = () => ({})

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
