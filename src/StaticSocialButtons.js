import React from 'react'
import {Nav} from 'react-bootstrap'

export default class StaticSocialButtons extends React.Component {
  componentDidMount() {

    if (twttr && this.twttrEl) {
      twttr.widgets.createFollowButton(
        "GrameneDatabase",
        this.twttrEl,
      );
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <Nav style={{paddingLeft: '40px'}}>
        <iframe
          src="https://www.facebook.com/plugins/like.php?href=https%3A%2F%2Fwww.facebook.com%2FGramene&amp;layout=button_count&amp;show_faces=false&amp;width=80&amp;font=arial&amp;height=20&amp;action=like&amp;colorscheme=light&amp;locale=en_US&amp;send=false&amp;share=false"
          scrolling="no"
          frameBorder="0"
          style={{border: 'none', overflow: 'hidden', width: '100px', height: '20px'}}
          allowtransparency="true">
        </iframe>
        <span ref={(el) => this.twttrEl = el}/>
      </Nav>
    );
  }
}
