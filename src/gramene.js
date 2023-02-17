import React from 'react'
import {Provider, connect} from 'redux-bundler-react'
import {render} from 'react-dom'
import {composeBundles, createCacheBundle} from "redux-bundler";
import {getConfiguredCache} from 'money-clip';
import {DebounceInput} from 'react-debounce-input'
import {Alert, Navbar, Nav, NavDropdown, Tab, Row, Col, FormControl, InputGroup, Button} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import {Status, Filters, Results, Views, suggestions as GrameneSuggestions, bundles} from 'gramene-search';
import Feedback from './Feedback';
import Welcome from './Welcome';
import { PortalsDropdown } from './Portals'
import StaticSocialButtons from './StaticSocialButtons';
import HelpModal from './HelpModal';
import panSites from '../conf';
import UIbundle from './bundles/UIbundle';
import drupalBundles from './bundles/Drupal';
import {
  BrowserRouter,
  Switch,
  Route,
  NavLink
} from "react-router-dom";
import MDView from 'gramene-mdview';
import Alerts from 'gramene-alerts';
import {keyBy} from 'lodash';

const subsite = process.env.SUBSITE;
const baseURL = process.env.DEPLOY === 'dev' ? `/${subsite}/${process.env.VERSION}` : `/`;
const panSiteIdx = keyBy(panSites, 'id');
const initialState = Object.assign({helpIsOn: false, linkSet: 'Portals'}, panSiteIdx[subsite]);

const cache = getConfiguredCache({
  maxAge: 100 * 60 * 60,
  version: `${initialState.id}_${initialState.version}`
});

const config = {
  name: 'config',
  getReducer: () => {
    return (state = initialState, {type, payload}) => {
      let newState;
      switch (type) {
        case 'GRAMENE_HELP_TOGGLED':
          newState = Object.assign({}, state);
          newState.helpIsOn = !newState.helpIsOn;
          return newState;
        default:
          return state;
      }
    }
  },
  doToggleGrameneHelp: () => ({dispatch}) => {
    dispatch({type: 'GRAMENE_HELP_TOGGLED', payload: null})
  },
  selectGrameneAPI: state => state.config.grameneData,
  selectTargetTaxonId: state => state.config.targetTaxonId,
  selectCuration: state => state.config.curation,
  selectConfiguration: state => state.config
};

const getStore = composeBundles(
  ...bundles, ...drupalBundles,
  UIbundle,
  config,
  createCacheBundle(cache.set)
);

const AlertCmp = ({configuration}) => (
  <div className={"col-md-12 no-padding"}>
    <Alerts
      org='warelab'
      repo='release-notes'
      path='alerts'
      site={configuration.id}
    />
  </div>
);

const Alerter = connect(
  'selectConfiguration',
  AlertCmp
);

const SearchViews = props => (
  <div className="row no-margin no-padding" style={{backgroundColor: "#fff"}}>
    <div className="col-md-2 no-padding">
      <div className="gramene-sidebar">
        <Status/>
        <Filters/>
        {/*<Views/>*/}
      </div>
    </div>
    <div className="col-md-10" style={{paddingBottom: '100px'}}>
      <Results/>
    </div>
  </div>
);

const MainViewCmp = props => {
  return props.grameneFilters.rightIdx > 1 ? <SearchViews/> : <Welcome/>;
}

const MainView = connect(
  'selectGrameneFilters',
  MainViewCmp
);

const handleKey = (e, props) => {
  if (e.key === "Escape") {
    props.doClearSuggestions();
  }
  if (e.key === "Tab") {
    if (props.grameneSuggestionsReady) {
      e.preventDefault();
      document.getElementById('0-0').focus();
    }
  }
};

const SearchBarCmp = props =>
  <div>
    <InputGroup size='sm'>
      <DebounceInput
        minLength={0}
        debounceTimeout={300}
        onChange={e => props.doChangeSuggestionsQuery(e.target.value)}
        onKeyDown={e => handleKey(e, props)}
        // onKeyUp={e => handleKey(e.key,props)}
        className="form-control"
        value={props.suggestionsQuery || ''}
        placeholder="Search for genes by id, name, pathway, domain, etc."
        id="search-input"
        autoComplete="off"
        spellCheck="false"
        style={{borderBottomRightRadius: 0, borderTopRightRadius: 0}}
      />
      <Button size='sm' variant="success" style={{borderBottomLeftRadius: 0, borderTopLeftRadius: 0}}
              onClick={props.doToggleGrameneHelp}><strong>?</strong></Button>
    </InputGroup>
    <HelpModal/>
  </div>

const SearchBar = connect(
  'selectSuggestionsQuery',
  'doChangeSuggestionsQuery',
  'doClearSuggestions',
  'doToggleGrameneHelp',
  'selectGrameneSuggestionsReady',
  SearchBarCmp
);
const SuggestionsCmp = props => (
  props.suggestionsQuery &&
  <div className="search-suggestions">
    <GrameneSuggestions/>
  </div>
)

const Suggestions = connect(
  'selectSuggestionsQuery',
  'selectGrameneSuggestionsStatus',
  SuggestionsCmp
);

const SearchMenu = props => (
  <div id="searchbar-parent" style={{width: '400px', alignSelf:'center'}}>
    <div id="searchbar">
      <SearchBar/>
    </div>
  </div>
)

const NewsCmp = ({configuration}) => (
    <MDView
      org='warelab'
      repo='release-notes'
      path={subsite}
      heading='News'
      date={configuration.date}
      offset={160}
    />
)
const News = connect(
  'selectConfiguration',
  NewsCmp
);

const GenomesCmp = ({configuration}) => (
  <div style={{paddingBottom: '100px'}}>
    <MDView
      org='warelab'
      repo='release-notes'
      path={subsite + '-genomes'}
      heading='Genomes'
      date={configuration.date}
    />
  </div>
)
const Genomes = connect(
  'selectConfiguration',
  GenomesCmp
);

const GuidesCmp = ({configuration}) => (
  <div style={{paddingBottom: '100px'}}>
    <MDView
      org='warelab'
      repo='release-notes'
      path={subsite + '-guides'}
      heading='Guides'
      ifEmpty='A user guide is being developed.'
      date={configuration.date}
    />
  </div>
)
const Guides = connect(
  'selectConfiguration',
  GuidesCmp
);

const GrameneMenuCmp = ({configuration}) => (
  <Navbar bg="light" expand="lg" sticky='top'>
    <div style={{width: '100%', borderBottomColor: '#c7c7c7', borderBottomStyle: 'solid', marginLeft: '15px', marginRight: '15px'}}>
      <Navbar className="gramene-navbar" bg="light" expand="lg">
        <Navbar.Brand className="gramene-navbar">
          <a href="/">
            <img src={`static/images/${subsite}_logo.svg`}
                 height={80}
            />
          </a>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Switch>
              <Route exact path="/" component={SearchMenu}/>
              <Route>
                <NavLink className="nav-link" to="/">Search</NavLink>
              </Route>
            </Switch>
            <Nav.Link href={initialState.ensemblSite}>
              <img style={{height: '25px', verticalAlign: 'bottom'}}
                   src={`static/images/e_bang.png`}
                   alt={"ensembl"}/>
              Genome browser
            </Nav.Link>
            { configuration.showNews && <NavLink className="nav-link" to="/news">News</NavLink> }
            {/*<NavLink className="nav-link" to="/genomes">Genomes</NavLink>*/}
            { configuration.showGuides && <NavLink className="nav-link" to="/guides">Guides</NavLink> }
            <NavLink className="nav-link" to={() => ({
              pathname: '/feedback',
              state: {search: document.location.href}
            })}>Feedback</NavLink>
            {/*<NavDropdown id={"gramene-sites"} title={"Gramene Sites"}>*/}
            {/*  {panSites.filter(site => site.id !== subsite && site.showInMenu).map((site, idx) =>*/}
            {/*    <NavDropdown.Item key={idx} href={site.url}>{site.name}</NavDropdown.Item>*/}
            {/*  )}*/}
            {/*</NavDropdown>*/}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  </Navbar>
)

const GrameneMenu = connect(
  'selectConfiguration',
  GrameneMenuCmp
);


const Footer = props => (
  <Navbar fixed="bottom" bg="light">
    <div style={{width: "100%", borderTopColor: "#c7c7c7", borderTopStyle: "solid"}}>
      <Navbar bg="light">
        <Nav className="mr-auto">
          <NavLink className="nav-link" to="/cite">Cite</NavLink>
          <NavLink className="nav-link" to="/personal-data-privacy">Privacy</NavLink>
          <NavLink className="nav-link" to="/funding">Funding</NavLink>
          <PortalsDropdown/>
          <NavDropdown id={"gramene-sites"} title={"Gramene Sites"} className={"dropup"}>
            {panSites.filter(site => site.id !== subsite && site.showInMenu).map((site, idx) =>
              <NavDropdown.Item key={idx} href={site.url}>{site.name}</NavDropdown.Item>
            )}
          </NavDropdown>
        </Nav>
        <hr/>
        <StaticSocialButtons/>
      </Navbar>
    </div>
  </Navbar>
);

const Gramene = (store) => (
  <Provider store={store}>
    <BrowserRouter basename={baseURL}>
      <div>
        <GrameneMenu/>
        <Alerter/>
        <Route exact path="/" component={Suggestions}/>
        <Switch>
          <Route path="/feedback" component={Feedback}/>
          <Route path="/news" component={News}/>
          {/*<Route path="/genomes" component={Genomes} />*/}
          <Route path="/guides" component={Guides}/>
          <Route path="/pansites" component={Welcome}/>
          <Route path="/node/:nid" component={Welcome}/>
          <Route path="/:stub" component={Welcome}/>
          <Route path="/" component={MainView}/>
        </Switch>
        <Footer/>
      </div>
    </BrowserRouter>
  </Provider>
)

cache.getAll().then(initialData => {
  if (initialData) {
    if (initialData.hasOwnProperty('searchUI')) initialData.searchUI.suggestions_query = "";
    console.log('starting with locally cached data:', initialData)
  }
  const store = getStore(initialData);
  let element = document.getElementById('gramene');
  element && render(Gramene(store), element);
});
