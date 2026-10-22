import React from 'react'
import {connect} from 'redux-bundler-react'
import {Link} from 'react-router-dom'
import {Container, Row, Col, Spinner} from 'react-bootstrap'

// News from the grameneNews bundle (bundles/news.js): the home page's
// "Latest News" sidebar, the /posts list and a /post/:slug page. Titles,
// excerpts and content are WordPress-rendered HTML.

const html = s => ({__html: s || ''});

const formatDate = iso => {
  const d = new Date(iso);
  return isNaN(d) ? '' : d.toLocaleDateString('en-US', {
    weekday: 'short', day: '2-digit', month: 'short', year: 'numeric'
  });
};

// Pages reached directly (a shared /post link) may beat the bundle's reactor,
// which only runs on sites that show the feed; ask for the data ourselves.
const useNews = ({grameneNews, siteNews, doFetchGrameneNews}) => {
  React.useEffect(() => {
    if (!grameneNews) doFetchGrameneNews();
  }, []);
  return siteNews;
};

const NewsFeedCmp = ({siteNews}) => {
  if (!siteNews) return null;
  return (
    <div style={{backgroundColor:'white', padding:'0px', marginBottom:'20px', borderRadius:'5px'}}>
      <h4 style={{padding:'10px',marginBottom:'0px'}}>Latest News</h4>
      <ul className={"posts list-unstyled"} style={{overflow: 'auto', minHeight: "550px", height: "565px", padding: "0px", marginBottom: '0px'
      ,borderBottomStyle:'solid', borderBottomColor:'#e3e8ec', borderBottomWidth:'thin',borderTopStyle:'solid',borderTopColor:'#e3e8ec',borderTopWidth:'thin'}}>
        {siteNews.length === 0 && <li style={{padding:"10px"}}>No news yet.</li>}
        {siteNews.map(post =>
          <li key={post.id} style={{padding:"10px"}}>
            <Link to={`/post/${post.slug}`} dangerouslySetInnerHTML={html(post.title)}/><br/>
            <span>{formatDate(post.date)}</span>
          </li>
        )}
      </ul>
      <div style={{padding:"10px",fontSize:"small"}}>
        <Link to="/posts">All news</Link>
      </div>
    </div>
  );
};

export const NewsFeed = connect(
  'selectSiteNews',
  NewsFeedCmp
);

const PostsPageCmp = props => {
  const posts = useNews(props);
  return (
    <Container style={{paddingTop: '20px', paddingBottom: '100px', maxWidth: '900px'}}>
      <h3>News</h3>
      {!posts && <Spinner animation="border" size="sm"/>}
      {posts && posts.length === 0 && <p>No news yet.</p>}
      {posts && posts.map(post =>
        <div key={post.id} className="gramene-news-item" style={{padding: '12px 0', borderBottom: '1px solid #e3e8ec'}}>
          <h5 style={{marginBottom: '2px'}}>
            <Link to={`/post/${post.slug}`} dangerouslySetInnerHTML={html(post.title)}/>
          </h5>
          <div style={{color: '#6c757d', fontSize: 'small'}}>{formatDate(post.date)}</div>
          <div className="gramene-news-excerpt" dangerouslySetInnerHTML={html(post.excerpt)}/>
        </div>
      )}
    </Container>
  );
};

export const PostsPage = connect(
  'selectGrameneNews',
  'selectSiteNews',
  'doFetchGrameneNews',
  PostsPageCmp
);

// A post beside the Latest News sidebar, laid out like the home page's
// columns so the sidebar stays put as visitors move between posts.
const PostPageCmp = props => {
  const posts = useNews(props);
  const slug = props.match.params.slug;
  const post = posts && posts.find(p => p.slug === slug);
  return (
    <Container fluid style={{paddingLeft: '20px', paddingRight: '20px', paddingTop: '20px', paddingBottom: '100px'}}>
      <Row>
        <Col xxl={10} xl={9} lg={9}>
          <div style={{maxWidth: '900px'}}>
            {!posts && <Spinner animation="border" size="sm"/>}
            {posts && !post && <p>That news post was not found. <Link to="/posts">All news</Link></p>}
            {post && <article className="gramene-news-post">
              <h2 dangerouslySetInnerHTML={html(post.title)}/>
              <div style={{color: '#6c757d', marginBottom: '16px'}}>{formatDate(post.date)}</div>
              {post.featuredUrl && <img src={post.featuredUrl} alt="" style={{maxWidth: '100%', marginBottom: '16px'}}/>}
              <div className="gramene-news-content" dangerouslySetInnerHTML={html(post.content)}/>
              <p style={{marginTop: '24px'}}><Link to="/posts">All news</Link></p>
            </article>}
          </div>
        </Col>
        <Col xxl={2} xl={3} lg={3}>
          {props.configuration.showFeed && <NewsFeed/>}
        </Col>
      </Row>
    </Container>
  );
};

export const PostPage = connect(
  'selectGrameneNews',
  'selectSiteNews',
  'selectConfiguration',
  'doFetchGrameneNews',
  PostPageCmp
);
