import React from "react";
import {connect} from 'redux-bundler-react'
import {Alert, Container, Row, Col, Card, CardDeck, Button} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import Portals from './Portals'
import '../styles/welcome.less'

function AlertDismissibleExample({config}) {
    const [show, setShow] = React.useState(true);

    if (show) {
        return (
            <Alert variant="success" onClose={() => setShow(false)} dismissible>
                <Alert.Heading>Welcome to Gramene {config.name}</Alert.Heading>
                <hr/>
                <p>
                    <b>Gramene</b> is a <i>curated, open-source, integrated</i> data resource for comparative functional
                    genomics in crops and model plant species.
                </p>
            </Alert>
        );
    }
    return null; //<Button onClick={() => setShow(true)}>Show Alert</Button>;
}
const DrupalCmp = props => {
    let nid = props.nid;
    if (!nid && props.drupalAliases && props.stub) {
        if (! props.drupalAliases[props.stub]) {
            return <code>node for '{props.stub}' not found</code>
        }
        nid = JSON.stringify(props.drupalAliases[props.stub]).replace(/"/g,"");
    }
    if (nid) {
        const src = `https://news.gramene.org/ww?nid=${+nid}` // nid is a string that includes quotation marks
        return <iframe src={src} frameBorder="0" width="100%" height="650px">
            <p>browser doesn't support iframes</p>
        </iframe>
    }
    return null;
}

const Drupal = connect(
    'selectConfiguration',
    'selectDrupalAliases',
    DrupalCmp
);

const NewsFeedCmp = props => {
    if (props.drupalFeed) {
        return (
            <ul className={"posts list-unstyled"} style={{overflow:'auto', height:"600px", paddingBottom:"15px"}}>
                {props.drupalFeed.map((post,idx) =>
                    <li key={idx}>
                        <Link
                              to={post.link._text.replace(/.*news\.gramene\.org/,'')}>
                            {post.title._text}
                        </Link><br/>
                        <span>{post.pubDate._text.replace(/\s\d\d:\d\d:\d\d.*/,'')}</span>
                    </li>
                )}
                <li key="newslink">
                    <a href="//news.gramene.org/blog">Gramene news blog</a>
                </li>
            </ul>
        )
    }
    else {
        return null;
    }
}
const NewsFeed = connect(
    'selectDrupalFeed',
    NewsFeedCmp
);

const Welcome = props => (
    <div>
        <Container fluid style={{padding: '40px'}}>
            <Row>
                <Col lg={2}/>
                <Col lg={8}>
                    <AlertDismissibleExample config={props.configuration}/>
                </Col>
            </Row>
            <Row>
                <Col lg={2}/>
                <Col lg={6}>
                    { props.match
                        ? <Drupal stub={props.match.params.stub} nid={props.match.params.nid}/>
                        : <Portals/>
                    }
                </Col>
                <Col lg={2}>
                    <h4>Latest News</h4>
                    <NewsFeed/>
                </Col>
                <Col lg={2}/>
            </Row>
        </Container>
    </div>
);

export default connect(
    'selectConfiguration',
    'doToggleGrameneHelp',
    'doReplaceGrameneFilters',
    Welcome
);
