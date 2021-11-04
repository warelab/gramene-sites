import {createAsyncResourceBundle, createSelector} from 'redux-bundler'

const convert = require('xml-js');
const drupalFeed = createAsyncResourceBundle({
  name: 'DrupalFeed',
  actionBaseType: 'DRUPAL_FEED',
  persist: false,
  getPromise: ({store}) => {
    const state = store.getState();
    const site = state.config.id;
    return fetch('https://news.gramene.org/blog/feed')
      .then(response => response.text())
      .then(xml => convert.xml2json(xml, {compact: true, spaces: 1}))
      .then(json => JSON.parse(json))
      .then(feed => feed.rss.channel.item)
      .then(posts => posts.filter(post => {
        const slug = post.link._text.replace(/.*news\.gramene\.org\//, '');
        const targetSites = slug.split('__');
        if (targetSites.length === 1) {
          return (site === "main");
        }
        const filtered = targetSites.filter(targetSite => targetSite === site);
        return filtered.length === 1;
      }))
  }
});

drupalFeed.reactDrupalFeed = createSelector(
  'selectDrupalFeedShouldUpdate',
  (shouldUpdate) => {
    if (shouldUpdate) {
      return {actionCreator: 'doFetchDrupalFeed'}
    }
  }
);

const drupalAliases = createAsyncResourceBundle({
  name: 'DrupalAliases',
  actionBaseType: 'DRUPAL_ALIASES',
  persiste: false,
  getPromise: ({store}) => {
    return fetch('https://gramene.org/aliases')
      .then(res => res.json())
  }
});
drupalAliases.reactDrupalAliases = createSelector(
  'selectDrupalAliasesShouldUpdate',
  (shouldUpdate) => {
    if (shouldUpdate) {
      return {actionCreator: 'doFetchDrupalAliases'}
    }
  }
);
export default [drupalFeed, drupalAliases];