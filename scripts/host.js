const express = require('express');
const http = require('http');
const https = require('https');
const path = require('path');
const fs = require('fs');
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
  let httpRedirect = { close: () => undefined };
  let server = null;
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
  return [server, httpRedirect];
};

const hostApp = (dev = false, secure = !dev) => {
  bundler = new Bundler(path.join(__dirname, '..', 'public', 'index.html'), {
    watch: dev,
    sourceMaps: false,
  });
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
  bundler.bundle().then(() => {
    let app = createExpressApp(getDistDir());
    let [staticServer, httpRedirect] = createServer(app, secure);
    server.start();
    if (dev) {
      bundler.on('buildEnd', () => {
        staticServer.close();
        httpRedirect.close();
        app = createExpressApp(getDistDir());
        [staticServer, httpRedirect] = createServer(app, secure);
      });
    }
  });
};
hostApp(
  !(process.argv.includes('prod') || process.env.NODE_ENV === 'production') ||
    process.argv.includes('dev'),
  (process.argv.includes('secure') || process.env.NODE_ENV === 'production') &&
    !process.argv.includes('dev'),
);
