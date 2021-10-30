import { createAsyncResourceBundle, createSelector } from 'redux-bundler'
const convert = require('xml-js');
const drupalFeed = createAsyncResourceBundle( {
    name: 'DrupalFeed',
    actionBaseType: 'DRUPAL_FEED',
    persist: false,
    getPromise: ({store}) => {
        return fetch('https://news.gramene.org/blog/feed')
            .then(response => response.text())
            .then(xml => convert.xml2json(xml, {compact: true, spaces: 1}))
            .then(json => JSON.parse(json))
            .then(feed => {
                return feed.rss.channel.item
            })
    }
});

drupalFeed.reactDrupalFeed = createSelector(
    'selectDrupalFeedShouldUpdate',
    (shouldUpdate) => {
        if (shouldUpdate) {
            return { actionCreator: 'doFetchDrupalFeed' }
        }
    }
);

const drupalAliases = createAsyncResourceBundle( {
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
            return { actionCreator: 'doFetchDrupalAliases' }
        }
    }
);
export default [drupalFeed,drupalAliases];