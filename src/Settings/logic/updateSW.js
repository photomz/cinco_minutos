const sendMessage = (key, value) => {
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
      sw.postMessage(
        JSON.stringify({
          category: 'settings',
          type: key,
          value: value,
        }),
        [mc.port2],
      );
    });
  }
  return new Promise(r => r(null));
};
const serviceWorker = () =>
  ('serviceWorker' in navigator && navigator.serviceWorker.controller) || null;
export default sendMessage;
export { serviceWorker };
