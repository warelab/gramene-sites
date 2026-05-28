import maize from './maize.json';
import main from './main.json';
import grapevine from './grapevine.json';
import oryza from './oryza.json';
import sorghum from './sorghum.json';
import yeast from './yeast.json';

// Firebase web config is loaded from FIREBASE_CONFIG_JSON in the build-time
// env (.env, never committed). If unset, the Auth panel mounts but stays
// inert. Attached to sites that use gramene-auth.
const firebaseConfig = (() => {
  const raw = process.env.FIREBASE_CONFIG_JSON;
  if (!raw) return null;
  try { return JSON.parse(raw); }
  catch (e) { console.warn('FIREBASE_CONFIG_JSON is not valid JSON; Auth disabled.', e); return null; }
})();
if (firebaseConfig) {
  main.firebaseConfig = firebaseConfig;
}

export default [main,maize,grapevine,oryza,sorghum,yeast];

