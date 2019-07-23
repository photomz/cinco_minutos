const info = require('../globals.json');
const sendMessage = opts => {
  const sw = serviceWorker();
  if (sw) {
    return new Promise((resolve, reject) => {
      let mc = new MessageChannel();
      mc.port1.onmessage = e => {
        if (e.data.error) {
          reject(e.data.error);
        } else {
          resolve(e.data);
        }
      };
      sw.postMessage(JSON.stringify(opts), [mc.port2]);
    });
  }
  return new Promise(r => r(null));
};
const checkOffline = () =>
  fetch(info.SERVER_URL).then(res => res.text().then(val => !val.length), () => true);
const serviceWorker = () =>
  ('serviceWorker' in navigator && navigator.serviceWorker.controller) || null;
export default sendMessage;
export { serviceWorker };
export { checkOffline };
