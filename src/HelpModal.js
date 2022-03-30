import React from "react";
import {connect} from 'redux-bundler-react'
import {Modal, Container, Row, Card, CardDeck} from 'react-bootstrap'

const examples = [
  {
    subsite: {
      main: 1
    },
    text: "ARR-B Transcription Factors in Brassicaceae",
    filters: {
      status :'init',
      operation: 'AND',
      negate: false,
      marked: false,
      leftIdx: 0,
      rightIdx: 11,
      children: [
        {
          fq_field: 'domains__ancestors',
          fq_value:1005,
          name:'SANT/Myb',
          category:'InterPro Domain',
          leftIdx:1,
          rightIdx:2,
          negate:false,
          showMenu:false,
          marked:false
        },
        {
          fq_field:'domains__ancestors',
          fq_value:17930,
          name:'Myb_dom',
          category:'InterPro Domain',
          leftIdx:3,
          rightIdx:4,
          negate:false,
          showMenu:false,
          marked:false
        },
        {
          fq_field:'domains__ancestors',
          fq_value:1789,
          name:'Sig_transdc_resp-reg_receiver',
          category:'InterPro Domain',
          leftIdx:5,
          rightIdx:6,
          negate:false,
          showMenu:false,
          marked:false
        },
        {
          fq_field:'domains__ancestors',
          fq_value:41723,
          name:'CCT',
          category:'InterPro Domain',
          leftIdx:7,
          rightIdx:8,
          negate:true,
          showMenu:false,
          marked:false,
          parentIdx:0
        },
        {
          fq_field: 'taxonomy__ancestors',
          fq_value: 3700,
          name: 'Brassicaceae',
          category: 'Taxonomy',
          leftIdx: 9,
          rightIdx: 10,
          negate: false,
          showMenu: false,
          marked: false
        }
      ],
      showMarked:false,
      showMenu:false,
      searchOffset:0,
      rows:20
    }
  },
  {
    subsite: {
      maize: 1,
      sorghum: 1,
      main: 1
    },
    text: "What are the orthologs of Arabidopsis thaliana's PAD4 gene in Andropogoneae?",
    filters: {
      status: 'init',
      rows: 20,
      operation: 'AND',
      negate: false,
      leftIdx: 0,
      rightIdx: 5,
      children: [
        {
          fq_field: 'homology__all_orthologs',
          fq_value: 'AT3G52430',
          name: 'Orthologs of PAD4',
          category: 'Gene Tree',
          leftIdx: 1,
          rightIdx: 2,
          negate: false,
          marked: false
        },
        {
          fq_field: 'taxonomy__ancestors',
          fq_value: 147429,
          name: 'Andropogoneae',
          category: 'Taxonomy',
          leftIdx: 3,
          rightIdx: 4,
          negate: false,
          marked: false
        }
      ]
    }
  },
  {
    subsite: {
      grapevine: 1
    },
    text: "What are the orthologs of Arabidopsis thaliana's PAD4 gene in rosids?",
    filters: {
      status: 'init',
      rows: 20,
      operation: 'AND',
      negate: false,
      leftIdx: 0,
      rightIdx: 5,
      children: [
        {
          fq_field: 'homology__all_orthologs',
          fq_value: 'AT3G52430',
          name: 'Orthologs of PAD4',
          category: 'Gene Tree',
          leftIdx: 1,
          rightIdx: 2,
          negate: false,
          marked: false
        },
        {
          fq_field: 'taxonomy__ancestors',
          fq_value: 71275,
          name: 'rosids',
          category: 'Taxonomy',
          leftIdx: 3,
          rightIdx: 4,
          negate: false,
          marked: false
        }
      ]
    }
  },
  {
    subsite: {
      oryza: 1
    },
    text: "What are the orthologs of Arabidopsis thaliana's PAD4 gene in oryza?",
    filters: {
      status: 'init',
      rows: 20,
      operation: 'AND',
      negate: false,
      leftIdx: 0,
      rightIdx: 5,
      children: [
        {
          fq_field: 'homology__all_orthologs',
          fq_value: 'AT3G52430',
          name: 'Orthologs of PAD4',
          category: 'Gene Tree',
          leftIdx: 1,
          rightIdx: 2,
          negate: false,
          marked: false
        },
        {
          fq_field: 'taxonomy__ancestors',
          fq_value: 4527,
          name: 'oryza',
          category: 'Taxonomy',
          leftIdx: 3,
          rightIdx: 4,
          negate: false,
          marked: false
        }
      ]
    }
  }
];
const HelpDemo = ({configuration, doToggleGrameneHelp, doReplaceGrameneFilters}) => (
  <Modal
    show={configuration.helpIsOn}
    onHide={doToggleGrameneHelp}
    size='xl'
    fullscreen='true'
  >
    <Modal.Header closeButton>
      <Modal.Title>Search Features</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Container fluid style={{padding: '40px'}}>
        <Row>
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
        <Row>
          <h4>For Example</h4>
        </Row>
        <Row>
          <small>
            You can ask sophisticated questions about the genes:<br/>
            <ul>
              {examples.filter(e => !!e.subsite[configuration.id]).map((e, idx) => (
                <li key={idx}><a onClick={() => {
                  doToggleGrameneHelp();
                  doReplaceGrameneFilters(e.filters)
                }}>{e.text}</a></li>
              ))}
            </ul>
          </small>
        </Row>
      </Container>
    </Modal.Body>
  </Modal>

);

export default connect(
  'selectConfiguration',
  'doToggleGrameneHelp',
  'doReplaceGrameneFilters',
  HelpDemo
);
