import React from "react";
import {connect} from "redux-bundler-react";
import {ListGroup, Row, Col, Card} from "react-bootstrap";
import {Link} from "react-router-dom";
import { FiExternalLink } from 'react-icons/fi'


const tools = {
    browser: {
        title: "Genome Browser",
        description: "Browse genomes with annotations, variation and comparative tools",
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
        title: "Tools",
        description: "Tools for processing both our data and yours",
        ensemblPath: "/tools.html",
        imgSrc: "static/images/welcome/tools.png"
    },
    atlas: {
        title: "Plant Expression ATLAS",
        description: "Browse plant expression results at EBI ATLAS",
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
        description: "An advanced query interface powered by BioMart",
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
        drupalLink: "/outreach",
        imgSrc: "static/images/welcome/noun_553934.png"
    },
    downloads: {
        title: "Bulk Downloads",
        description: "FTP download of our data",
        drupalLink: "/ftp-download",
        imgSrc: "static/images/welcome/download.png"
    },
    archive: {
        title: "Archive",
        description: "Legacy tools and data (markers, Cyc pathways, etc)",
        drupalLink: "/archive",
        imgSrc: "static/images/welcome/archive.jpg"
    }
};

const GrameneTool = ({title, description, imgSrc, link, drupalLink, ensemblPath, isExternal, ensemblURL}) => {
    let external;
    if (isExternal) {
        external = <small title="This link opens a page from an external site"><FiExternalLink /></small>;
    }
    if (!link) {
        if (drupalLink) {
            link = drupalLink;
        }
        if (ensemblPath) {
            link = ensemblURL + ensemblPath;
        }
    }
    return (
        <Col onClick={() => window.location.href = link}>
            <Row className="gramene-tool">
                <Col md="auto">
                    <img style={{width:"96px"}} src={imgSrc} alt={title} />
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


const Portals = props => (
    <div className="tools-wrapper">
        <h3>Portals</h3>
        <Row xs={1} md={2} className="g-4">
            {props.configuration.portals.map((portal, idx) =>
                <GrameneTool {...tools[portal]} key={idx} ensemblURL={props.configuration.ensemblURL}/>
            )}
        </Row>
    </div>
);

export default connect(
    'selectConfiguration',
    Portals
);
