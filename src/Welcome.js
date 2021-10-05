import React from "react";
import {connect} from 'redux-bundler-react'
import {Modal, Container, Row, Card, CardDeck} from 'react-bootstrap'

const Welcome = ({configuration, doToggleGrameneHelp, doReplaceGrameneFilters}) => (
    <Container fluid style={{padding: '40px'}}>
        <Row>
            <h1>Welcome</h1>
            <CardDeck style={{width: '100%'}}>
                <Card style={{'backgroundColor': '#f3f6f5', 'borderColor': '#DDE5E3'}}>
                    <Card.Body>
                        <Card.Title>Suggestions</Card.Title>
                        <Card.Text>Matching terms are provided as you type:</Card.Text>
                        <div className='gene-search-pic-sugg'/>
                    </Card.Body>
                </Card>
                <Card style={{'backgroundColor': '#f3f6f5', 'borderColor': '#DDE5E3'}}>
                    <Card.Body>
                        <Card.Title>Visualization</Card.Title>
                        <Card.Text>See the distribution of results across all genomes:</Card.Text>
                        <div className='gene-search-pic-results'/>
                    </Card.Body>
                </Card>
                <Card style={{'backgroundColor': '#f3f6f5', 'borderColor': '#DDE5E3'}}>
                    <Card.Body>
                        <Card.Title>Gene tree view</Card.Title>
                        <Card.Text>Explore evolutionary history of a gene family:</Card.Text>
                        <div className='gene-search-pic-genetree'/>
                    </Card.Body>
                </Card>
            </CardDeck>
        </Row>
    </Container>
);

export default connect(
    'selectConfiguration',
    'doToggleGrameneHelp',
    'doReplaceGrameneFilters',
    Welcome
);
