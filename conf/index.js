import maize from './maize.json';
import main from './main.json';
import grapevine from './grapevine.json';
import oryza from './oryza.json';
import oryza19k from './oryza19k.json';
import sorghum from './sorghum.json';
import yeast from './yeast.json';

// Firebase web config is loaded from FIREBASE_CONFIG_JSON in the build-time
// env (.env, never committed). If unset, the Auth panel mounts but stays
// inert. A subsite opts in by setting `"auth": true` in its config JSON.
const firebaseConfig = (() => {
  const raw = process.env.FIREBASE_CONFIG_JSON;
  if (!raw) return null;
  try { return JSON.parse(raw); }
  catch (e) { console.warn('FIREBASE_CONFIG_JSON is not valid JSON; Auth disabled.', e); return null; }
})();

const subsites = [main,maize,grapevine,oryza,oryza19k,sorghum,yeast];
if (firebaseConfig) {
  subsites.forEach(s => { if (s.auth) s.firebaseConfig = firebaseConfig; });
}

export default subsites;

