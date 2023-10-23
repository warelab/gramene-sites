import React from "react";
import {connect} from 'redux-bundler-react'
import {Alert, Container, Row, Col, Card, Button, Collapse, Carousel} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import { Portals } from './Portals'
import closest from 'component-closest';
import '../styles/welcome.less'
// import { TwitterTimelineEmbed } from 'react-twitter-embed'
// var loadjs = require('loadjs');
// loadjs(['https://platform.twitter.com/widgets.js'], 'twitter');
//
// var haveTwitter = false;
// var Timeline = null;
// loadjs.ready('twitter', function() {
//   /* twitter loaded */
//   haveTwitter = true;
//   Timeline = require('react-twitter-widgets').Timeline;
// });

function WelcomeBanner({config}) {
  const key = `gramene-${config.name}-${config.version}-alerted`;
  const [hide, setShow] = React.useState(localStorage.getItem(key) || '');
  const show = hide === "yes" ? "no" : "yes";
  const haveSlides = config.slides.length > 0;
  return (
    <>
      <Alert variant="success">
        <Alert.Heading>
          Welcome to {config.name} <span style={{fontSize:"smaller"}}><Link to="/News">release {config.version.replace('v','')}</Link></span>
          {haveSlides && <Button onClick={() => {
            setShow(show);
            localStorage.setItem(key, show)
          }}
                                 variant="secondary"
                                 size="sm"
                                 style={{float: "right"}}
          >{show === "no" ? "Show" : "Hide"} Slideshow</Button>
          }
        </Alert.Heading>
        {config.description}
      </Alert>
      <Collapse in={ show === "yes" }>
        <div>
        <Carousel interval={5000} fade={true}>
          {config.slides.map((slide, idx) =>
            <Carousel.Item key={idx} style={{ backgroundColor: '#557b74'}}>
              <Card bg="dark" text="white" style={{
                width: '70%',
                marginLeft: '15%',
                marginRight: '15%',
                marginTop: '10px',
                marginBottom: '5%',
                padding: '5px'
              }}>
                <Card.Img variant="top" src={slide.img}/>
                <Card.Body>
                  <Card.Title>{slide.label}</Card.Title>
                  <Card.Text>{slide.text}</Card.Text>
                </Card.Body>
                {slide.credit &&
                  <Card.Footer>
                    <i>{slide.credit}</i>
                  </Card.Footer>
                }
              </Card>
            </Carousel.Item>
          )}
        </Carousel>
        </div>
      </Collapse>
    </>
  )
}

function AlertDismissibleExample({config}) {
  const key = `gramene-${config.name}-${config.version}-alerted`;
  const [hide, setShow] = React.useState(localStorage.getItem(key) || '');

  if (hide !== 'yes') {
    return (
      <Alert variant="success" onClose={() => {
        setShow('yes');
        localStorage.setItem(key, 'yes');
      }} dismissible>
        <Alert.Heading>Welcome to {config.name} <span style={{fontSize:"smaller"}}><Link to="/News">release {config.version.replace('v','')}</Link></span></Alert.Heading>
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

class DrupalPage extends React.Component {
  constructor(props) {
    super(props);
    this.iframeRef = React.createRef();
    this.state = {
    }
  }

  componentDidMount() {
    window.scrollTo(0,0);
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    window.scrollTo(0,0);
  }

  initListener() {
    let iframe = this.iframeRef.current;
    let iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    if (typeof iframeDoc.addEventListener !== "undefined") {
      iframeDoc.addEventListener("click", this.iframeClickHandler.bind(this), true);
    } else if (typeof iframeDoc.attachEvent !== "undefined") {
      iframeDoc.attachEvent("onclick", this.iframeClickHandler.bind(this));
    }
  }

  iframeClickHandler(e) {
    let target = e.target;
    target = closest(target, 'a');
    let href = target.getAttribute('href');
    let drupalLink;
    let matches = href.match(/(node\/\d+)$/);
    if (!matches) {
      matches = href.match(/gramene\.org\/(.+)/);
      if (matches && this.props.drupalAliases[matches[1]] && matches[1] ) {
        drupalLink = matches[1];
      }
    }
    else {
      drupalLink = matches[1];
    }
    if (drupalLink) {
      e.preventDefault();
      window.history.pushState({},undefined, `/${drupalLink}`)
    }
  }

  render() {
    let nid = this.props.nid;
    if (!nid && this.props.drupalAliases && this.props.stub) {
      if (!this.props.drupalAliases[this.props.stub]) {
        return <code>node for '{this.props.stub}' not found</code>
      }
      nid = JSON.stringify(this.props.drupalAliases[this.props.stub]).replace(/"/g, "");
    }
    if (nid) {
      const src = `/ww?nid=${+nid}`;
      return <iframe src={src} frameBorder="0" width="100%" height="650px" ref={this.iframeRef} onLoad={this.initListener.bind(this)}>
        <p>browser doesn't support iframes</p>
      </iframe>
    }
    return null;
  }
}

const Drupal = connect(
  'selectConfiguration',
  'selectDrupalAliases',
  DrupalPage
);

const NewsFeedCmp = props => {
  if (props.drupalFeed) {
    return (
      <div style={{backgroundColor:'white', padding:'0px', marginBottom:'20px', borderRadius:'5px'}}>
        <h4 style={{padding:'10px',marginBottom:'0px'}}>Latest News</h4>
        <ul className={"posts list-unstyled"} style={{overflow: 'auto', minHeight: "250px", height: "265px", padding: "0px", marginBottom: '0px'
        ,borderBottomStyle:'solid', borderBottomColor:'#e3e8ec', borderBottomWidth:'thin',borderTopStyle:'solid',borderTopColor:'#e3e8ec',borderTopWidth:'thin'}}>
          {props.drupalFeed.map((post, idx) =>
            <li key={idx} style={{padding:"10px"}}>
              <Link
                to={post.link._text.replace(/.*news\.gramene\.org/, '')}>
                {post.title._text}
              </Link><br/>
              <span>{post.pubDate._text.replace(/\s\d\d:\d\d:\d\d.*/, '')}</span>
            </li>
          )}
        </ul>
        <div style={{padding:"10px",fontSize:"small"}}>
          Read more at <a href="//news.gramene.org/blog">Gramene news</a>
        </div>
      </div>
    )
  } else {
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
      <Row style={{paddingBottom:'50px'}} lg={12} xl={12} md={12}>
        <Col xxl={1} xl={1} lg={0}>
        </Col>
        <Col xxl={6} xl={7} lg={9}>
          {/*<AlertDismissibleExample config={props.configuration}/>*/}
          <WelcomeBanner config={props.configuration}/>
          {props.match && (props.match.params.stub || props.match.params.nid)
            ? <Drupal stub={props.match.params.stub} nid={props.match.params.nid}/>
            : <Portals location={props.location}/>
          }
        </Col>
        <Col xxl={3} xl={3} lg={3}>
          <div>{ props.configuration.showFeed && <NewsFeed/> }</div>
          <div>{ props.configuration.showTweets &&
            <a className="twitter-timeline" data-height="500" data-dnt="true"
               href="https://twitter.com/GrameneDatabase?ref_src=twsrc%5Etfw">Tweets by GrameneDatabase</a>
          }</div>
        </Col>
        <Col xxl={2} xl={1} lg={0}/>
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
