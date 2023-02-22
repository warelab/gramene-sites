import React from "react";
import {connect} from "redux-bundler-react";
import {ListGroup, Row, Col, Card, NavDropdown, Tabs, Tab} from "react-bootstrap";
import {Link} from "react-router-dom";
import {FiExternalLink} from 'react-icons/fi'
import panSites from '../conf';
import {NavLink} from 'react-router-dom';


const tools = {
  browser: {
    title: "Genome Browser",
    description: "Genome annotations, variation and comparative tools",
    ensemblPath: "/index.html",
    imgSrc: "static/images/welcome/ensemblgramene.png"
  },
  reactome: {
    title: "Plant Reactome",
    description: "Browse and analyze metabolic and regulatory pathways",
    link: "//plantreactome.gramene.org",
    imgSrc: "static/images/welcome/plantReactome.svg"
  },
  tools: {
    title: "Ensembl Tools",
    description: "Tools for fetching and searching genomic data",
    ensemblPath: "/tools.html",
    imgSrc: "static/images/welcome/tools.png"
  },
  atlas: {
    title: "Plant Expression Atlas",
    description: "Browse plant expression results at EBI",
    link: "//www.ebi.ac.uk/gxa/plant/experiments",
    imgSrc: "static/images/welcome/ExpressionAtlas.png",
    isExternal: true
  },
  blast: {
    title: "BLAST",
    description: "Query our genomes with a DNA or protein sequence",
    ensemblPath: "/Tools/Blast?db=core",
    imgSrc: "static/images/welcome/BLAST.png"
  },
  mart: {
    title: "Gramene Mart",
    description: "An advanced genomic query interface powered by BioMart",
    ensemblPath: "/biomart/martview",
    imgSrc: "static/images/welcome/Biomart250.png"
  },
  trackhub: {
    title: "Track Hub Registry",
    description: "A global centralised collection of publicly accessible track hubs",
    link: "//trackhubregistry.org",
    imgSrc: "static/images/welcome/TrackHub.png",
    isExternal: true
  },
  outreach: {
    title: "Outreach and Training",
    description: "Education resources and webinars",
    drupalLink: "outreach",
    imgSrc: "static/images/welcome/noun_553934.png"
  },
  downloads: {
    title: "Bulk Downloads",
    description: "FTP download of our data",
    drupalLink: "ftp-download",
    imgSrc: "static/images/welcome/download.png"
  },
  ftp: {
    title: "Bulk Downloads",
    description: "FTP download of our data",
    link: "ftp",
    imgSrc: "static/images/welcome/download.png"
  },
  archive: {
    title: "Archive",
    description: "Legacy tools and data (markers, Cyc pathways, etc)",
    drupalLink: "archive",
    imgSrc: "static/images/welcome/archive.jpg"
  },
  climtools: {
    title: "CLIMtools",
    description: "Environment x Genome x Phenotype Associations in A. thaliana",
    link: "https://www.gramene.org/CLIMtools",
    imgSrc: "static/images/welcome/climtools.png"
  },
  pansites: {
    title: "Plant Pan Genomes",
    description: "Gramene-powered sites focused on specific crops",
    link: "pansites",
    imgSrc: "static/images/welcome/pangenomes.svg"
  },
  curated: {
    title: "Curated Gene Function",
    description: "Genes described in the literature",
    link: "?fq_field=capabilities&fq_value=pubs&category=Curated&name=publication",
    imgSrc: "static/images/welcome/curated.png"
  }
};

const GrameneTool = ({title, description, imgSrc, link, drupalLink, ensemblPath, isExternal, ensemblURL, id, version}) => {
  let external;
  if (isExternal) {
    external = <small title="This link opens a page from an external site"><FiExternalLink/></small>;
  }
  if (!link) {
    if (drupalLink) {
      link = drupalLink;
    }
    if (ensemblPath) {
      link = ensemblURL + ensemblPath;
    }
  }
  else {
    if (link === 'pansites') {
      return (
        <NavLink to="/pansites" style={{textDecoration:'none'}}>
          <Col>
            <Row className="gramene-tool">
              <Col md="auto">
                <img style={{width: "96px"}} src={imgSrc} alt={title}/>
              </Col>
              <Col>
                <h5 style={{color:'#212529'}}>
                  {title}{external}
                </h5>
                <p className="gramene-tool-desc">{description}</p>
              </Col>
            </Row>
          </Col>
        </NavLink>
      )
    }
    if (link === 'ftp') {
      link = `https://ftp.gramene.org/${id}/${version}`
    }
  }
  return (
    <Col onClick={() => window.location.href = link}>
      <Row className="gramene-tool">
        <Col md="auto">
          <img style={{width: "96px"}} src={imgSrc} alt={title}/>
        </Col>
        <Col>
          <h5>
            {title}{external}
          </h5>
          <p className="gramene-tool-desc">{description}</p>
        </Col>
      </Row>
    </Col>
  );
};

const GrameneToolLink = ({title, description, imgSrc, link, drupalLink, ensemblPath, isExternal, ensemblURL, id, version}) => {
  let external;
  if (isExternal) {
    external = <small title="This link opens a page from an external site"><FiExternalLink/></small>;
  }
  if (!link) {
    if (drupalLink) {
      link = drupalLink;
    }
    if (ensemblPath) {
      link = ensemblURL + ensemblPath;
    }
  }
  else {
    if (link === 'ftp') {
      link = `https://ftp.gramene.org/${id}/${version}`
    }
  }
  return <NavDropdown.Item href={link}><img style={{width: "32px"}} src={imgSrc}/>&nbsp;&nbsp;{title}</NavDropdown.Item>
};

const PortalsCmp = props => (
  <div className="tools-wrapper">
    {props.location && props.location.pathname === '/pansites' && <h3>Plant Pan Genome sites</h3>}
    {props.location && props.location.pathname === '/pansites' ?
      <Row xs={1} md={2} className="g-4">
        {panSites.filter(site => site.id !== props.configuration.id && site.showInMenu).map((site, idx) =>
          <Col key={idx} onClick={() => window.location.href = site.url}>
            <Row className="gramene-tool">
              <Col md="auto">
                <img style={{width:"165px"}} src={`static/images/${site.id}_logo.svg`}/>
              </Col>
              <Col>
                {/*<h5>{site.name}&nbsp;{site.version}</h5>*/}
                <p className="gramene-tool-desc">{site.description}</p>
              </Col>
            </Row>
          </Col>
        )}
      </Row>
      :
      <Row xs={1} md={2} className="g-4">
        {props.configuration.portals.map((portal, idx) =>
          <GrameneTool {...tools[portal]} key={idx} ensemblURL={props.configuration.ensemblURL} {...props.configuration}/>
        )}
      </Row>
    }
  </div>
);

export const Portals = connect(
  'selectConfiguration',
  PortalsCmp
);

const PortalsDropdownCmp = ({configuration}) => {
  if (configuration.portals2) {
    return (
      <NavDropdown id={'portals-dropdown'} title={'Links'} className={"dropup"}>
        { configuration.portals2.map((portal, idx) =>
          <GrameneToolLink {...tools[portal]} key={idx} ensemblURL={configuration.ensemblURL} {...configuration}/>
        )}
      </NavDropdown>
    )
  }
}

export const PortalsDropdown = connect(
  'selectConfiguration',
  PortalsDropdownCmp
);

