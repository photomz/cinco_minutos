const express = require('express');
const http = require('http');
const https = require('https');
const path = require('path');
const fs = require('fs');
//eslint-disable-next-line
const distDir = fs.readdirSync(path.join(__dirname, '../dist'));
let app = express();
let httpRedirect = express();
//eslint-disable-next-line
httpRedirect.get('*', (req, res) => {
  res.redirect('https://' + req.get('Host') + req.url);
});
distDir.map(el =>
  app.get('/' + el, (req, res) => {
    // eslint-disable-next-line
    res.sendFile(path.resolve(__dirname, '../dist/' + el));
  }),
);

app.get('*', (req, res) => {
  // eslint-disable-next-line
  res.sendFile(path.resolve(__dirname, '../dist/index.html'));
});
/* Following only if SSL certificate exists
http.createServer(httpRedirect).listen(80);
https.createServer(app).listen(443); */
http.createServer(app).listen(80);
