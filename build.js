const {ArgumentParser} = require('argparse');
const fs = require('fs');
const ParcelCore = require("@parcel/core");
const {default: Parcel} = ParcelCore;

const sites = ['main', 'maize', 'grapevine', 'sorghum', 'oryza', 'yeast'];

const parser = new ArgumentParser({
  description: "build a gramene site"
});
parser.add_argument('site', {help: sites.join(', ')});
parser.add_argument('version', {help: 'site version'});
parser.add_argument('deploy', {help: 'dev or live?'});
parser.add_argument('-m', '--mode', {help: 'development or production?'});
const args = parser.parse_args();
const site = args.site;
const version = args.version;
const deploy = args.deploy;
if (!sites.includes(site)) {
  console.error(`INVALID SITE NAME: "${site}"\nChoose one of these: ${sites.join(', ')}`);
}
const mode = args.mode || "production";

(async () => {
  const dest = `${deploy}/${site}/${version}`;
  let bundler = new Parcel({
    entries: `html/${site}.html`,
    defaultConfig: '@parcel/config-default',
    mode: mode,
    defaultTargetOptions: {
      distDir: dest,
      shouldScopeHoist: false,
      publicUrl: deploy === 'dev' ? `/${site}/${version}` : '/'
    },
    env: {
      NODE_ENV: mode,
      SUBSITE: site,
      VERSION: version,
      DEPLOY: deploy
    }
  });

  try {
    console.log("await bundler.run()");
    let {bundleGraph, buildTime} = await bundler.run();
    console.log("bundleGraph.getBundles()");
    let bundles = bundleGraph.getBundles();
    console.log(`✨ Built ${bundles.length} bundles in ${buildTime}ms!`);
    fs.rename(`${dest}/${site}.html`, `${dest}/index.html`, () => {
      console.log(`Renamed ${dest}/${site}.html ${dest}/index.html`);
    });
    fs.copyFile('.htaccess', `${dest}/.htaccess`, () => {
      console.log(`copied .htaccess into ${dest}/`)
    });
    fs.copyFile('robots.txt', `${dest}/robots.txt`, () => {
      console.log(`copied robots.txt into ${dest}/`)
    });
    fs.symlink(`../../../src/static`, `./${dest}/static`, () => {
      console.log('symlinked static content');
    })
  } catch (err) {
    console.log(err.diagnostics);
  }
})();
