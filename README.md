# gramene-sites
Front end of gramene main and subsites

Install dependencies
```shell
npm install
```
This hack is necessary to get Parcel to transpile imported node modules correctly.

Edit <code>node_modules/@parcel/core/lib/summarizeRequest.js</code>

Change <code>return !filePath.includes(NODE_MODULES);</code>
to <code>return true;</code>


Start a site in development mode
```shell
npm run main
npm run maize
npm run grapevine
...
```

Build a site for production
```shell
node build.js [-h] [-m MODE] site
```

When updating the search index for a site, you have to change the ```grameneData``` field in ```conf/site.json``` and the ```gramene.defaultServer``` in ```html/site.html```

Whe you configure a new site, you need to create ```conf/site.json``` and ```html/site.html``` and also add it to ```conf/index.js``` and ```package.json```