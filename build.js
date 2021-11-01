const {ArgumentParser} = require('argparse');
const fs = require('fs');
const ParcelCore = require("@parcel/core");
const {default: Parcel} = ParcelCore;

const sites = ['main','maize','grapevine','sorghum','oryza'];

const parser = new ArgumentParser({
    description: "build a gramene site"
});
parser.add_argument('site', {help: sites.join(', ')});
parser.add_argument('-m','--mode', {help: 'development or production?'});
const args = parser.parse_args();
const site = args.site;
if (!sites.includes(site)) {
    console.error(`INVALID SITE NAME: "${site}"\nChoose one of these: ${sites.join(', ')}`);
}
const mode = args.mode || "production";

(async () => {
    let bundler = new Parcel({
        entries: `html/${site}.html`,
        defaultConfig: '@parcel/config-default',
        mode: mode,
        defaultTargetOptions: {
            distDir: site,
            shouldScopeHoist: false
        },
        env: {
            NODE_ENV: mode,
            SUBSITE: site
        }
    });

    try {
        console.log("await bundler.run()");
        let {bundleGraph, buildTime} = await bundler.run();
        console.log("bundleGraph.getBundles()");
        let bundles = bundleGraph.getBundles();
        console.log(`✨ Built ${bundles.length} bundles in ${buildTime}ms!`);
        fs.rename(`${site}/${site}.html`,`${site}/index.html`, () => {
            console.log(`Renamed ${site}/${site}.html ${site}/index.html`);
        });
        fs.copyFile('.htaccess',`${site}/.htaccess`, () => {
            console.log(`copied .htaccess into ${site}/`)
        });
        fs.symlink(`../src/static`, `./${site}/static`, () => {
            console.log('synlinked static content');
        })
    } catch (err) {
        console.log(err.diagnostics);
    }
})();
