import React from "react";
import {connect} from 'redux-bundler-react'
import {Alert, Container, Row, Col, Card, Button, Carousel} from 'react-bootstrap'
import {NewsFeed} from './News'
import {Link} from 'react-router-dom'
import { Portals, Examples } from './Portals'
import { GithubDoc } from 'gramene-githubdocs'
import italicizeOryza from './italicizeOryza'
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

// Inline rice-stalk motif used as a hero accent. Recolorable, no image asset
// needed. Mirrors src/static/images/oryza19k/rice-stalk.svg.
const RiceStalk = ({className}) => (
  <svg className={className} width="150" viewBox="0 0 200 170"
       xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
    <g stroke="#7fa352" strokeWidth="2.4" fill="none" strokeLinecap="round">
      <path d="M120 168 C118 120 116 80 130 44"/>
      <path d="M120 168 C122 124 132 92 150 64"/>
      <path d="M120 168 C120 130 108 96 92 70"/>
    </g>
    <g fill="#c9a227">
      <g transform="translate(130,44) rotate(20)">
        <ellipse cx="0" cy="0" rx="4.5" ry="9"/><ellipse cx="9" cy="6" rx="4.5" ry="9"/><ellipse cx="-8" cy="8" rx="4.5" ry="9"/><ellipse cx="2" cy="16" rx="4.5" ry="9"/><ellipse cx="11" cy="20" rx="4.5" ry="9"/><ellipse cx="-7" cy="22" rx="4.5" ry="9"/>
      </g>
      <g transform="translate(150,64) rotate(40)">
        <ellipse cx="0" cy="0" rx="4" ry="8"/><ellipse cx="8" cy="5" rx="4" ry="8"/><ellipse cx="-7" cy="7" rx="4" ry="8"/><ellipse cx="2" cy="14" rx="4" ry="8"/><ellipse cx="10" cy="18" rx="4" ry="8"/>
      </g>
      <g transform="translate(92,70) rotate(-30)">
        <ellipse cx="0" cy="0" rx="4" ry="8"/><ellipse cx="8" cy="5" rx="4" ry="8"/><ellipse cx="-7" cy="7" rx="4" ry="8"/><ellipse cx="2" cy="14" rx="4" ry="8"/><ellipse cx="10" cy="18" rx="4" ry="8"/>
      </g>
    </g>
    <g stroke="#d8b94a" strokeWidth="1.2" strokeLinecap="round">
      <line x1="130" y1="44" x2="130" y2="28"/><line x1="150" y1="64" x2="156" y2="48"/><line x1="92" y1="70" x2="84" y2="56"/>
    </g>
  </svg>
);

// "At a glance" rendered as accented stat cards (config-driven). Only sites
// that define config.atAGlance (currently oryza19k) get this treatment.
function AtAGlance({stats, full}) {
  return (
    <div className={`oryza19k-glance${full ? " oryza19k-glance-full" : ""}`}>
      <h3 className="oryza19k-glance-title">At a glance</h3>
      <div className="oryza19k-glance-grid">
        {stats.map((s, idx) =>
          <div key={idx} className={`oryza19k-stat oryza19k-stat-${s.accent || 'green'}`}>
            <div className="oryza19k-stat-value">{s.value}</div>
            <div className="oryza19k-stat-label">{s.label}</div>
          </div>
        )}
      </div>
    </div>
  );
}

function WelcomeBanner({config, location}) {
  const key = `gramene-${config.name}-${config.version}-alerted`;
  const [hide, setShow] = React.useState(localStorage.getItem(key) || '');
  const show = hide === "yes" ? "no" : "yes";
  const haveSlides = config.slides.length > 0;
  const showSlideshow = haveSlides && show === "yes";
  // Home ("/") renders <Welcome/> with no location; other Welcome routes
  // (/videotutorials, /pansites, …) pass one. Tutorial videos are shown only on
  // /videotutorials, by Portals.
  const isHome = !location || location.pathname === '/';
  const description = config.description_continued ? config.description + config.description_continued : config.description;
  return (
    <>
      <Alert variant="success" className={config.hero ? "oryza19k-hero" : undefined}>
        {config.hero && config.hero.eyebrow &&
          <div className="oryza19k-hero-eyebrow">{config.hero.eyebrow}</div>
        }
        {config.hero && <RiceStalk className="oryza19k-hero-graphic"/>}
        <Alert.Heading>
          {config.hero ? italicizeOryza(config.name) : <>Welcome to {italicizeOryza(config.name)}</>} {config.showRelease !== false && <span style={{fontSize:"smaller"}}><Link to="/News">release {config.version.replace('v','')}</Link></span>}
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
        <div dangerouslySetInnerHTML={{ __html: description }}/>
        {config.hero && config.hero.links &&
          <div className="oryza19k-hero-actions">
            {config.hero.links.map((l, idx) => {
              const cls = `oryza19k-hero-btn${l.primary ? " oryza19k-hero-btn-primary" : ""}`;
              return l.url.startsWith('/')
                ? <Link key={idx} to={l.url} className={cls}>{l.label}</Link>
                : <a key={idx} href={l.url} target="_blank" rel="noopener noreferrer" className={cls}>{l.label}</a>;
            })}
          </div>
        }
      </Alert>
      {/* Overview and slideshow side by side; the overview takes the full width
          when the slideshow is hidden. */}
      <Row style={{marginBottom: '20px'}}>
        {config.atAGlance
          ? <Col md={showSlideshow ? 6 : 12} className="welcome-overview-col">
              <AtAGlance stats={config.atAGlance} full={!showSlideshow}/>
            </Col>
          : config.welcomeDoc &&
            <Col md={showSlideshow ? 6 : 12} className="welcome-overview-col">
              <GithubDoc
                org="warelab"
                repo={config.welcomeDoc.repo}
                path={config.welcomeDoc.path}
                branch={config.welcomeDoc.branch || 'main'}
              />
            </Col>
        }
        {showSlideshow &&
          <Col md={config.welcomeDoc ? 6 : 12} className="welcome-slideshow-col">
            <Carousel interval={5000} fade={true}>
              {config.slides.map((slide, idx) =>
                <Carousel.Item key={idx} style={{ backgroundColor: '#557b74'}}>
                  <Card bg="dark" text="white" style={{
                    width: '90%',
                    marginLeft: '5%',
                    marginRight: '5%',
                    marginTop: '10px',
                    marginBottom: '5%',
                    padding: '5px'
                  }}>
                    <Card.Img variant="top" src={slide.img}/>
                    <Card.Body>
                      <Card.Title>{italicizeOryza(slide.label)}</Card.Title>
                      <Card.Text>{italicizeOryza(slide.text)}</Card.Text>
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
          </Col>
        }
      </Row>
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
      return <iframe src={src}
                     ref={this.iframeRef}
                     style={{ width: '100%', height: '650px', maxHeight: '80vh' }}
                     onLoad={this.initListener.bind(this)}>
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

// mode:
//   'home'    -> oryza19k-specific landing (hero + at a glance + examples)
//   'gramene' -> generic Gramene portals grid (served at /gramene, light theme)
//   undefined -> legacy combined view (pansites / videotutorials / drupal stubs)
const Welcome = props => {
  const cfg = props.configuration;
  const mode = props.mode;
  const isDrupal = props.match && (props.match.params.stub || props.match.params.nid);
  const path = (props.location && props.location.pathname) || '';
  // /pansites and /videotutorials are Gramene portal sub-pages: Portals renders
  // its own heading and content for these, so skip the "Gramene Portals" header,
  // the examples, and (always) the oryza hero.
  const isPortalSubPage = path === '/pansites' || path === '/videotutorials';
  return (
  <div>
    <Container fluid style={{paddingLeft: '20px', paddingRight: '20px', paddingBottom: '80px', paddingTop: '0px'}}>
      <Row style={{paddingBottom:'50px'}} lg={12} xl={12} xxl={12} md={12}>
        <Col xxl={10} xl={9} lg={9}>
          {mode !== 'gramene' && <WelcomeBanner config={cfg} location={props.location}/>}
          {mode === 'gramene' && (isPortalSubPage
            ? <Portals location={props.location}/>
            : <>
                <h3 className="gramene-portals-heading">{cfg.portalsHeading || 'Gramene Portals'}</h3>
                <Portals location={props.location}/>
                {cfg.examples && <Examples/>}
              </>)
          }
          {mode === undefined && (isDrupal
            ? <Drupal stub={props.match.params.stub} nid={props.match.params.nid}/>
            : <>
                <Portals location={props.location}/>
                {cfg.examples && !isPortalSubPage && <Examples/>}
              </>)
          }
        </Col>
        <Col xxl={2} xl={3} lg={3}>
          <div>{ cfg.showFeed && <NewsFeed/> }</div>
        </Col>
      </Row>
    </Container>
  </div>
  );
};

export default connect(
  'selectConfiguration',
  'doToggleGrameneHelp',
  'doReplaceGrameneFilters',
  Welcome
);
