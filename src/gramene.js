import './suppressDevWarnings'
import React from 'react'
import ReactGA from 'react-ga'
import {Provider, connect} from 'redux-bundler-react'
import {createRoot} from 'react-dom/client'
import {composeBundles, createCacheBundle} from "redux-bundler";
import {getConfiguredCache} from 'money-clip';
import {DebounceInput} from 'react-debounce-input'
import {Navbar, Nav, NavDropdown, InputGroup, Button} from 'react-bootstrap'
import {FiSun, FiMoon} from 'react-icons/fi'
import 'bootstrap/dist/css/bootstrap.min.css';
import {Status, Filters, Facets, Results, Views, Auth, suggestions as GrameneSuggestions, bundles} from 'gramene-search';
import {SiteTour, TourPage} from './tour/SiteTour';
import {StaticPage, STATIC_PAGES} from './StaticPage';
import Feedback from './Feedback';
import Welcome from './Welcome';
import { PortalsDropdown } from './Portals'
import StaticSocialButtons from './StaticSocialButtons';
import HelpModal from './HelpModal';
import panSites from '../conf';
import UIbundle from './bundles/UIbundle';
import drupalBundles from './bundles/Drupal';
import newsBundles from './bundles/news';
import {PostsPage, PostPage} from './News';
import {
  BrowserRouter,
  Switch,
  Route,
  NavLink,
  useLocation
} from "react-router-dom";
import GithubDocs, { GithubDoc, useGithubDocList } from 'gramene-githubdocs';
import italicizeOryza from './italicizeOryza';
import Alerts from 'gramene-alerts';
import {keyBy} from 'lodash';
import '../styles/oryza19k-theme.less';

const subsite = process.env.SUBSITE;
const baseURL = process.env.DEPLOY === 'dev' ? `/${subsite}/${process.env.VERSION}` : `/`;
// Root for static assets referenced from components. A bare relative path
// ("static/...") breaks on nested routes such as /post/:slug.
const assetBase = baseURL.endsWith('/') ? baseURL : `${baseURL}/`;
// Builds that opt in (oryza19k) split the landing page: "/" is a site-specific
// home, while the generic Gramene portals + gene search move to "/gramene".
// Every other subsite keeps the original combined home at "/".
const splitHome = panSites.find(s => s.id === subsite)?.splitHome === true;

// Selectable colour palettes for the dark oryza19k theme. The active palette is
// persisted in localStorage and applied by ThemedRoot via a `palette-<id>`
// class; the matching CSS variable overrides live in styles/oryza19k-theme.less.
const PALETTES = [
  { id: 'paddy',      label: 'Rice Paddy',    swatch: '#3f6b2e' },
  { id: 'midnight',   label: 'Midnight Blue', swatch: '#2f5e94' },
  { id: 'terracotta', label: 'Terracotta',    swatch: '#b3502a' },
  { id: 'plum',       label: 'Plum',          swatch: '#6a4fb0' },
  { id: 'slate',      label: 'Slate',         swatch: '#2f8f7f' },
];
const PALETTE_KEY = 'oryza19k-palette';
const MODE_KEY = 'oryza19k-mode';
const PaletteContext = React.createContext({ palette: 'paddy', setPalette: () => {}, mode: 'dark', setMode: () => {} });
const PaletteProvider = ({ children }) => {
  const [palette, setPaletteState] = React.useState(() => {
    try { return localStorage.getItem(PALETTE_KEY) || 'paddy'; } catch (e) { return 'paddy'; }
  });
  const [mode, setModeState] = React.useState(() => {
    try { return localStorage.getItem(MODE_KEY) || 'dark'; } catch (e) { return 'dark'; }
  });
  const setPalette = (p) => {
    setPaletteState(p);
    try { localStorage.setItem(PALETTE_KEY, p); } catch (e) { /* ignore */ }
  };
  const setMode = (m) => {
    setModeState(m);
    try { localStorage.setItem(MODE_KEY, m); } catch (e) { /* ignore */ }
  };
  return (
    <PaletteContext.Provider value={{ palette, setPalette, mode, setMode }}>
      {children}
    </PaletteContext.Provider>
  );
};

// Theme/palette picker for the navbar (top right of the dark oryza19k pages).
const ThemeSelector = () => {
  const { palette, setPalette, mode, setMode } = React.useContext(PaletteContext);
  const current = PALETTES.find(p => p.id === palette) || PALETTES[0];
  const swatch = (color) => (
    <span className="oryza19k-swatch" style={{ backgroundColor: color }}/>
  );
  return (
    <Nav className="ms-auto oryza19k-theme-selector align-items-center">
      <button type="button" className={`o19-mode-switch o19-mode-${mode}`}
              role="switch" aria-checked={mode === 'dark'}
              aria-label="Toggle light or dark mode"
              title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}>
        <span className="o19-mode-knob">{mode === 'dark' ? <FiMoon/> : <FiSun/>}</span>
      </button>
      <NavDropdown id="palette-dropdown" align="end"
                   title={<>{swatch(current.swatch)}Theme</>}>
        {PALETTES.map(p => (
          <NavDropdown.Item key={p.id} active={p.id === palette}
                            onClick={() => setPalette(p.id)}>
            {swatch(p.swatch)}{p.label}
          </NavDropdown.Item>
        ))}
      </NavDropdown>
    </Nav>
  );
};
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
  selectEnsemblAPI: state => state.config.ensemblRest,
  selectTargetTaxonId: state => state.config.targetTaxonId,
  selectCuration: state => state.config.curation,
  selectConfiguration: state => state.config
};

const getStore = composeBundles(
  ...bundles, ...drupalBundles, ...newsBundles,
  UIbundle,
  config,
  createCacheBundle(cache.set)
);

const AlertCmp = ({configuration}) => (
  <div className={"col-md-12 no-padding"}>
    { !configuration.hideAlerts && <Alerts
      org='warelab'
      repo='release-notes'
      path='alerts'
      site={configuration.id}
    /> }
  </div>
);

const Alerter = connect(
  'selectConfiguration',
  AlertCmp
);

const SearchViewsCmp = props => (
  <div className="no-margin no-padding search-views-layout" style={{backgroundColor: "#fff"}}>
    <div className="gramene-sidebar">
      <Status/>
      <Filters/>
      <Facets/>
      {props.configuration.showViews && <Views/>}
      <Auth/>
    </div>
    <div className="search-views-content" style={{paddingBottom: '100px'}}>
      <Results/>
    </div>
  </div>
);
const SearchViews = connect(
  'selectConfiguration',
  SearchViewsCmp
);

// Default combined home ("/") for non-split builds: search results when a
// query is active, otherwise the full Welcome (banner + portals + examples).
const MainViewCmp = props => {
  return props.grameneFilters.rightIdx > 1 ? <SearchViews/> : <Welcome/>;
}
const MainView = connect(
  'selectGrameneFilters',
  MainViewCmp
);

// Home ("/"): oryza19k-specific landing only (hero + at a glance + examples).
const OryzaHome = () => <Welcome mode="home"/>;

// Gramene portal sub-pages (/pansites, /videotutorials) on a split build: render
// just the portal content (no oryza hero), under the light Gramene theme.
const PortalsSubPage = ({location}) => <Welcome mode="gramene" location={location}/>;

// "/gramene": the generic Gramene portals + gene search. Shows search results
// once a query is active, otherwise the portals grid. Rendered on a light theme.
const GrameneMainCmp = props =>
  props.grameneFilters.rightIdx > 1
    ? <SearchViews/>
    : <Welcome mode="gramene" location={props.location}/>;

const GrameneMain = connect(
  'selectGrameneFilters',
  GrameneMainCmp
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
  <div id="searchbar-parent" className="navbar-search">
    <div id="searchbar">
      <SearchBar/>
    </div>
  </div>
)

const NewsCmp = ({configuration}) => (
    <GithubDocs
      org='warelab'
      repo='release-notes'
      path={subsite}
      heading='News'
      sort='date'
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
    <GithubDocs
      org='warelab'
      repo='release-notes'
      path={subsite + '-genomes'}
      heading='Genomes'
      sort='date'
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
    <GithubDocs
      org='warelab'
      repo='release-notes'
      path={subsite + '-guides'}
      heading='Guides'
      sort='date'
      ifEmpty='A user guide is being developed.'
      date={configuration.date}
    />
  </div>
)
const Guides = connect(
  'selectConfiguration',
  GuidesCmp
);

// Config-driven sections (e.g. oryza19k's Start here / Platforms / Workflows /
// API / Resources / Cite). Each `sections` entry { label, route, path, repo? }
// is served from a GitHub repo dir via GithubDocs; subdirectories become nav
// levels. Returns a route component for the given section.
const SectionDocs = (section) => ({location}) => {
  const doc = new URLSearchParams((location && location.search) || '').get('doc') || undefined;
  // Expandable sections (e.g. Platforms) are navigated from the navbar's inline
  // links (see SectionMenu), so the GithubDocs sidebar is redundant — render
  // just the selected document with no navigation chrome.
  if (section.expand) {
    return <ExpandedSectionDoc section={section} doc={doc}/>;
  }
  // Other sections keep the full tree+sidebar browser. Feed the router's ?doc=
  // through so deep links resolve even though react-router keeps this component
  // mounted across query-only changes.
  return (
    <div style={{paddingBottom: '100px'}}>
      <GithubDocs
        org='warelab'
        repo={section.repo || 'oryza-19k-rgp'}
        path={section.path}
        branch='main'
        heading={section.label}
        offset={160}
        doc={doc}
        ifEmpty={`${section.label} content is coming soon.`}
      />
    </div>
  )
}

// Single-document view for an expandable section: shows the doc named by ?doc=,
// or the first top-level doc by default. Navigation lives in the navbar
// (SectionMenu), so there's no sidebar.
const ExpandedSectionDoc = ({section, doc}) => {
  const docs = useGithubDocList({
    org: 'warelab',
    repo: section.repo || 'oryza-19k-rgp',
    path: section.path,
    branch: 'main',
  });
  const path = doc || (docs[0] && docs[0].fullPath);
  if (!path) return null; // tree not loaded yet
  return (
    <div style={{paddingBottom: '100px'}}>
      <GithubDoc
        org='warelab'
        repo={section.repo || 'oryza-19k-rgp'}
        path={path}
        branch='main'
        showTitle
        toc
        offset={100}
        renderTitle={italicizeOryza}
      />
    </div>
  );
}

// A navbar section. When the section config has `expand: true`, the label is a
// dropdown toggle ("Platforms") whose menu links to each top-level doc under the
// section's repo path (SNP-Seek v3, GrameneOryza, Oryza CLIMtools, …).
const ExpandedSectionMenu = ({section}) => {
  const docs = useGithubDocList({
    org: 'warelab',
    repo: section.repo || 'oryza-19k-rgp',
    path: section.path,
    branch: 'main',
  });
  // Not loaded yet (or empty): fall back to a plain link to the section.
  if (docs.length === 0) {
    return <NavLink className="nav-link" to={section.route}>{section.label}</NavLink>;
  }
  return (
    <NavDropdown id={`section-dropdown-${section.route}`} title={section.label}
                 className="gramene-section-dropdown">
      {docs.map((d) => (
        <NavDropdown.Item key={d.fullPath} as={NavLink}
                          to={`${section.route}?doc=${encodeURIComponent(d.fullPath)}`}>
          {italicizeOryza(d.title || d.label)}
        </NavDropdown.Item>
      ))}
    </NavDropdown>
  );
}

const SectionMenu = ({section}) =>
  section.expand
    ? <ExpandedSectionMenu section={section}/>
    : <NavLink className="nav-link" to={section.route}>{section.label}</NavLink>;

// The oryza19k-branded pages (dark theme, "ORYZA 19K-RGP" brand, palette picker,
// no footer): just the home, cite and platforms pages. Every other route on a
// split build is a generic Gramene page (light theme, Gramene logo, footer).
const oryzaRoutes = ['/', '/cite', '/platforms'];
const isOryzaRoute = (pathname) =>
  oryzaRoutes.some(r => pathname === r || (r !== '/' && pathname.startsWith(r + '/')));

const GrameneMenuCmp = ({configuration}) => {
  const oryzaRoute = isOryzaRoute(useLocation().pathname);
  // oryza19k pages drop the "Gramene" wordmark and show only the site sub-brand
  // ("ORYZA 19K-RGP"); the Gramene pages keep the full Gramene Oryza logo.
  const useSubBrand = configuration.brand && oryzaRoute;
  // On the Gramene pages of a split build, the navbar drops the oryza sections
  // (Platforms / Cite) and instead offers a link back to the oryza19k homepage.
  const gramenePage = splitHome && !oryzaRoute;
  return (
  <Navbar bg="light" expand="lg" sticky='top' className="gramene-navbar-outer">
    <div style={{width: '100%', borderBottomColor: '#c7c7c7', borderBottomStyle: 'solid', marginLeft: '15px', marginRight: '15px'}}>
      <Navbar className="gramene-navbar" bg="light" expand="lg">
        <Navbar.Brand className="gramene-navbar">
          <a href={gramenePage ? "/gramene" : "/"}>
            {useSubBrand
              ? <span className="oryza19k-brand oryza19k-brand--solo">
                  <span className="oryza19k-brand-sub">{italicizeOryza(configuration.brand.sub)}</span>
                </span>
              : <img src={configuration.logo || `${assetBase}static/images/${subsite}_logo.svg`}
                     height={80}
                />
            }
          </a>
        </Navbar.Brand>
        {splitHome
          ? <Switch>
              {/* Only /gramene gets the search bar. Every other page navigates
                  home via the brand logo (dark pages) or the "Oryza 19K-RGP"
                  nav item (gramene pages), so no separate Home link is needed. */}
              <Route path="/gramene" component={SearchMenu}/>
              <Route render={() => null}/>
            </Switch>
          : <Switch>
              <Route exact path="/" component={SearchMenu}/>
              <Route>
                <NavLink className="nav-link" to="/">Home</NavLink>
              </Route>
            </Switch>
        }
        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            { gramenePage
              ? <NavLink className="nav-link gramene-back-link" to="/">{italicizeOryza('Oryza 19K-RGP')}</NavLink>
              : configuration.sections
              ? configuration.sections.map((s, i) =>
                  <SectionMenu key={i} section={s}/>)
              : <>
                  <Nav.Link href={initialState.ensemblSite}>
                    <img style={{height: '25px', verticalAlign: 'bottom'}}
                         src={`${assetBase}static/images/e_bang.png`}
                         alt={"ensembl"}/>
                    Genome browser
                  </Nav.Link>
                  { configuration.showNews && <NavLink className="nav-link" to="/news">News</NavLink> }
                  { configuration.showGuides && <NavLink className="nav-link" to="/guides">Guides</NavLink> }
                  { configuration.tour && <NavLink className="nav-link" to="/tour">Tour</NavLink> }
                  <NavLink className="nav-link" to={() => ({
                    pathname: '/feedback',
                    state: {search: document.location.href}
                  })}>Feedback</NavLink>
                </>
            }
          </Nav>
          {/* palette picker, pinned to the right on the dark oryza19k pages */}
          {splitHome && oryzaRoute && <ThemeSelector/>}
        </Navbar.Collapse>
      </Navbar>
    </div>
  </Navbar>
  );
};

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
          <PortalsDropdown/>
          <NavDropdown id={"gramene-sites"} title={"Gramene Sites"} className={"dropup"}>
            {panSites.filter(site => site.id !== subsite && site.showInMenu).map((site, idx) =>
              <NavDropdown.Item key={idx} href={site.url}>{site.name}</NavDropdown.Item>
            )}
          </NavDropdown>
        </Nav>
        <StaticSocialButtons/>
      </Navbar>
    </div>
  </Navbar>
);

// The footer is generic Gramene content, so on a split build it appears only on
// the Gramene pages (/gramene, /pansites, /videotutorials) and is hidden on the
// oryza19k-branded pages.
const RoutedFooter = () => {
  const oryzaRoute = isOryzaRoute(useLocation().pathname);
  if (splitHome && oryzaRoute) return null;
  return <Footer/>;
};

// Applies the dark oryza19k theme on the oryza routes (/, /cite, /platforms) and
// the light Gramene styling everywhere else. Only active on themed builds.
const ThemedRoot = ({children}) => {
  const oryzaRoute = isOryzaRoute(useLocation().pathname);
  const { palette, mode } = React.useContext(PaletteContext);
  if (initialState.theme === 'dark') {
    const oryzaClass = `oryza19k-theme palette-${palette}${mode === 'light' ? ' mode-light' : ''}`;
    return <div className={oryzaRoute ? oryzaClass : 'oryza19k-light'}>{children}</div>;
  }
  return <div>{children}</div>;
};

const Gramene = (store) => (
  <Provider store={store}>
    <PaletteProvider>
    <BrowserRouter basename={baseURL}>
      <ThemedRoot>
        <GrameneMenu/>
        <Alerter/>
        {splitHome
          ? <Route path="/gramene" component={Suggestions}/>
          : <Route exact path="/" component={Suggestions}/>}
        {/* The tour drives the search bar, so it lives where the search bar does. */}
        {splitHome
          ? <Route path="/gramene" component={SiteTour}/>
          : <Route exact path="/" component={SiteTour}/>}
        <Switch>
          <Route path="/feedback" component={Feedback}/>
          <Route path="/news" component={News}/>
          <Route path="/guides" component={Guides}/>
          <Route path="/tour" component={TourPage}/>
          <Route path="/posts" component={PostsPage}/>
          <Route path="/post/:slug" component={PostPage}/>
          {(initialState.sections || []).map((s, i) =>
            <Route key={i} path={s.route} component={SectionDocs(s)}/>)}
          {splitHome && <Route path="/gramene" component={GrameneMain}/>}
          <Route path="/pansites" component={splitHome ? PortalsSubPage : Welcome}/>
          <Route path="/node/:nid" component={Welcome}/>
          <Route path="/videotutorials" component={splitHome ? PortalsSubPage : Welcome}/>
          {/* Pages moved from news.gramene.org; after the config sections so a
              site's own section (oryza19k's /cite) wins. */}
          <Route path={`/:page(${STATIC_PAGES.join('|')})`} component={StaticPage}/>
          <Route path="/:stub" component={Welcome}/>
          <Route path="/" component={splitHome ? OryzaHome : MainView}/>
        </Switch>
        <RoutedFooter/>
      </ThemedRoot>
    </BrowserRouter>
    </PaletteProvider>
  </Provider>
)

cache.getAll().then(initialData => {
  if (initialData) {
    if (initialData.hasOwnProperty('searchUI')) initialData.searchUI.suggestions_query = "";
    console.log('starting with locally cached data:', initialData)
  }
  const store = getStore(initialData);
  const config = store.selectConfiguration();
  ReactGA.initialize(config.ga);

  if (initialData.hasOwnProperty('grameneMaps')) {
    // check for hidden genomes
    let notHidden = {};
    let haveHidden = false;
    Object.values(initialData.grameneMaps.data).forEach(m => {
      if (m.hidden) {
        haveHidden=true;
      }
      else {
        notHidden[m.taxon_id]=true;
      }
    })
    if (haveHidden) {
      store.doInitializeGrameneGenomes(notHidden)
    }
  }

  let element = document.getElementById('gramene');
  if (element) {
    createRoot(element).render(Gramene(store));
  }
});
