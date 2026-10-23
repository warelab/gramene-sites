import React from 'react'
import {connect} from 'redux-bundler-react'
import {Spinner} from 'react-bootstrap'
import {NewsSidebarLayout} from './News'

// Static pages moved from news.gramene.org. Each is an HTML fragment in
// src/static/pages/<name>.html, fetched at runtime (src/static ships with
// every build), shown beside the Latest News sidebar at /<name>.
// {{grameneData}} in a page becomes the site's data API base
// (config grameneData) and {{grameneDataPath}} its path, so links to the
// current release's API need no edit at each release.
export const STATIC_PAGES = ['cite', 'outreach', 'ftp-download', 'archive'];

const subsite = process.env.SUBSITE;
const assetBase = process.env.DEPLOY === 'dev' ? `/${subsite}/${process.env.VERSION}/` : '/';

const fillPlaceholders = (html, config) => {
  const api = (config.grameneData || '').replace(/\/$/, '');
  let path = '';
  try { path = new URL(api).pathname.replace(/\/$/, ''); } catch (e) { /* no API configured */ }
  return html
    .replace(/\{\{grameneData\}\}/g, api)
    .replace(/\{\{grameneDataPath\}\}/g, path);
};

const StaticPageCmp = ({match, configuration}) => {
  const page = match.params.page;
  const [loaded, setLoaded] = React.useState({page: null, html: null, error: null});

  React.useEffect(() => {
    let cancelled = false;
    window.scrollTo(0, 0);
    fetch(`${assetBase}static/pages/${page}.html`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then(html => {
        // A dev server answers unknown paths with the app's own index.html.
        if (/<!doctype html|<html[\s>]/i.test(html)) throw new Error('page not found');
        if (!cancelled) setLoaded({page, html, error: null});
      })
      .catch(e => {
        if (!cancelled) setLoaded({page, html: null, error: e.message});
      });
    return () => { cancelled = true; };
  }, [page]);

  const current = loaded.page === page ? loaded : {};
  return (
    <NewsSidebarLayout>
      <div className="gramene-static-page">
        {!current.html && !current.error && <Spinner animation="border" size="sm"/>}
        {current.error && <p>This page could not be loaded ({current.error}).</p>}
        {current.html && <div dangerouslySetInnerHTML={{__html: fillPlaceholders(current.html, configuration)}}/>}
      </div>
    </NewsSidebarLayout>
  );
};

export const StaticPage = connect(
  'selectConfiguration',
  StaticPageCmp
);
