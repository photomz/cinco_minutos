const express = require('express');
const http = require('http');
const https = require('https');
const path = require('path');
const fs = require('fs');
const watch = require('node-watch');
const compression = require('compression');
const Bundler = require('parcel-bundler');
const server = require('../server/server.js');
//eslint-disable-next-line

const createExpressApp = distDir => {
  let app = express();
  app.use(compression());
  distDir.map(el => {
    app.get('/' + el, (req, res) => {
      if (el === 'sw.js') res.set('Service-Worker-Allowed', '/');
      // eslint-disable-next-line
      res.sendFile(path.resolve(__dirname, '..', 'dist', el));
    });
  });
  app.get('*', (req, res) => {
    // eslint-disable-next-line
    res.sendFile(path.resolve(__dirname, '..', 'dist', 'index.html'));
  });
  return app;
};

const createServer = (app, secure = false) => {
  let httpRedirect = { close: () => undefined, on: () => undefined };
  let server = null;
  let connections = [];
  if (secure) {
    httpRedirectApp = express();
    httpRedirectApp.get('*', (req, res) => {
      res.redirect('https://' + req.get('Host') + req.url);
    });
    httpRedirect = http.createServer(httpRedirectApp);
    httpRedirect.listen(80);
    server = https.createServer(
      {
        cert: fs.readFileSync(path.join(__dirname, '../cert.pem')),
        key: fs.readFileSync(path.join(__dirname, '../privkey.pem')),
      },
      app,
    );
    server.listen(443);
  } else {
    server = http.createServer(app);
    server.listen(80);
  }
  server.on(secure ? 'secureConnection' : 'connection', conn => {
    connections.push(conn);
    conn.on('close', () => (connections = connections.filter(el => el !== conn)));
  });
  return [server, connections, httpRedirect];
};

const hostApp = (dev = false, secure = !dev) => {
  const getDistDir = () => fs.readdirSync(path.join(__dirname, '..', 'dist'));
  const removeDist = () => {
    const distDir = getDistDir().map(el => path.join(__dirname, '..', 'dist', el));
    for (val of distDir) {
      fs.unlinkSync(val);
    }
  };
  if (fs.existsSync(path.join(__dirname, '..', 'dist'))) {
    removeDist();
  }
  server.start();
  const start = (firstRun = true) => {
    removeDist();
    bundler = new Bundler(path.join(__dirname, '..', 'public', 'index.html'), {
      watch: false,
      sourceMaps: false,
      publicUrl: '/',
      logLevel: firstRun ? 3 : 2,
    });
    bundler.bundle().then(bundle => {
      const recurseOverBundle = bundle => {
        let assets = [];
        for (let asset of bundle.assets) {
          if (!asset.name.split(path.sep).includes('node_modules')) assets.push(asset.name);
        }
        for (let childBundle of bundle.childBundles) {
          assets.push(...recurseOverBundle(childBundle));
        }
        return new Set(assets);
      };
      const possPaths = recurseOverBundle(bundle);
      if (!firstRun) console.log('Finished building');
      let app = createExpressApp(getDistDir());
      let [staticServer, connections, httpRedirect] = createServer(app, secure);
      if (dev) {
        let watcher = { close: () => undefined };
        watcher = watch(
          path.join(__dirname, '..'),
          { recursive: true, filter: path => possPaths.has(path) },
          (e, fn) => {
            console.log(fn + ' changed, restarting');
            watcher.close();
            httpRedirect.close();
            staticServer.close(() => {
              for (let conn of connections) {
                console.log('Forcibly closing connection to ' + conn.remoteAddress);
                conn.destroy();
              }
              start(false);
            });
          },
        );
      }
    });
  };
  start();
};
hostApp(
  !(process.argv.includes('prod') || process.env.NODE_ENV === 'production') ||
    process.argv.includes('dev'),
  (process.argv.includes('secure') || process.env.NODE_ENV === 'production') &&
    !process.argv.includes('dev'),
);
