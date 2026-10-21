import {createAsyncResourceBundle, createSelector} from 'redux-bundler'

// Gramene sites' news, from SorghumBase's cache of its WordPress content
// (sorghum-webapp wp_cache resource `gramene_posts`). Editors file a post
// under a child of the WordPress "Gramene" category: `all` for every Gramene
// site, or a site id (main, maize, oryza, grapevine) for just those; each
// cached post lists them in `sites`. A site config may set `newsApi` to read
// from another sorghum-webapp deployment.
const DEFAULT_NEWS_API = 'https://www.sorghumbase.org';
const RESOURCE = 'gramene_posts';

const newsApi = config => (config.newsApi || DEFAULT_NEWS_API).replace(/\/$/, '');

const grameneNews = createAsyncResourceBundle({
  name: 'grameneNews',
  actionBaseType: 'GRAMENE_NEWS',
  persist: true,
  staleAfter: 10 * 60 * 1000,
  retryAfter: 60 * 1000,
  // Data is {posts, fetchedAt}. The server stamps each refill with
  // fetched_at and keeps it when WordPress hasn't changed, so comparing it
  // with /_timestamps lets a returning visitor skip the download.
  getPromise: async ({store}) => {
    const api = newsApi(store.selectConfiguration());
    const cached = store.selectGrameneNews();
    if (cached && cached.posts) {
      try {
        const stamps = await fetch(`${api}/api/wp_cache/_timestamps`).then(res => res.json());
        const serverAt = Number(stamps[RESOURCE]) || 0;
        if (serverAt && serverAt <= cached.fetchedAt) return cached;
      } catch (e) {
        return cached;
      }
    }
    const res = await fetch(`${api}/api/wp_cache/${RESOURCE}`);
    if (!res.ok) throw new Error(`news: HTTP ${res.status}`);
    const posts = await res.json();
    return {posts, fetchedAt: Number(res.headers.get('X-Wp-Cache-Fetched-At')) || 0};
  }
});

grameneNews.reactGrameneNews = createSelector(
  'selectGrameneNewsShouldUpdate',
  'selectConfiguration',
  (shouldUpdate, config) => {
    if (shouldUpdate && config.showFeed) {
      return {actionCreator: 'doFetchGrameneNews'}
    }
  }
);

// This site's posts, newest first: those filed under `all` or its own id.
grameneNews.selectSiteNews = createSelector(
  'selectGrameneNews',
  'selectConfiguration',
  (news, config) => news && news.posts
    ? news.posts.filter(post => (post.sites || []).some(site => site === 'all' || site === config.id))
    : null
);

export default [grameneNews];
