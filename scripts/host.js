/* eslint-disable no-console */
const path = require('path');
const express = require('express');
const Bundler = require('parcel-bundler');
const server = require('../server');
let api = server.createExpressApp();
let app = express();
app.use('/api', api);
const prod = process.argv.includes('prod') || process.env.NODE_ENV === 'production';
let bundler = new Bundler(path.resolve(__dirname, '..', 'public', 'index.html'), {
  scopeHoist: prod,
  minify: prod,
  sourceMaps: !prod,
  detailedReport: prod,
  watch: !prod,
});
const port = require('../globals.json').HOST_PORT || 1234;
app.use(bundler.middleware());
bundler.on('buildEnd', () => console.log(`Starting server at http://localhost:${port}`));
app.listen(port);
