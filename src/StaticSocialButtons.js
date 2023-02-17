import React from 'react'
import {Nav} from 'react-bootstrap'

export default class StaticSocialButtons extends React.Component {
  // componentDidMount() {

  //   if (window.twttr && this.twttrEl) {
  //     twttr.widgets.createFollowButton(
  //       "GrameneDatabase",
  //       this.twttrEl,
  //     );
  //   }
  //   if (window.FB && this.fbEl) {
  //     this.fbEl.innerHTML = '<iframe src="https://www.facebook.com/plugins/like.php?href=https%3A%2F%2Fwww.facebook.com%2FGramene&width=90&layout=button_count&action=like&size=small&share=false&height=21&appId" width="90" height="21" style="border:none;overflow:hidden" scrolling="no" frameBorder="0" allowFullScreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>'
  //   }
  // }

  // shouldComponentUpdate() {
  //   return false;
  // }

  render() {
    return (
      <Nav style={{paddingLeft: '40px'}}>
        {/*<span ref={(el) => this.fbEl = el}/>*/}
        {/*<span ref={(el) => this.twttrEl = el}/>*/}
        <iframe src="static/socialMedia.html" width="500" height="40" style={{border:'none',overflow:'hidden'}} scrolling="no" frameBorder="0" allowFullScreen={true} allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"/>
      </Nav>
    );
  }
}
