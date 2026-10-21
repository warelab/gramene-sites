import {createAsyncResourceBundle, createSelector} from 'redux-bundler'

const drupalAliases = createAsyncResourceBundle({
  name: 'DrupalAliases',
  actionBaseType: 'DRUPAL_ALIASES',
  persist: false,
  getPromise: ({store}) => {
    return fetch('https://gramene.org/urls')
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
export default [drupalAliases];