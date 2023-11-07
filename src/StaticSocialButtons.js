import React from 'react'
import {Nav} from 'react-bootstrap'

export default class StaticSocialButtons extends React.Component {
  render() {
    return (
      <Nav style={{paddingLeft: '40px'}}>
        <iframe src="static/socialMedia.html" width="320" height="40" style={{border:'none',overflow:'hidden'}} scrolling="no" frameBorder="0" allowFullScreen={true} allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"/>
      </Nav>
    );
  }
}
