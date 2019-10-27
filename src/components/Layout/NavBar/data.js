import ROUTES from '../../../global/routes';
export default {
  title: { name: 'ℭ𝔦𝔫𝔠𝔬𝔐𝔦𝔫𝔲𝔱𝔬𝔰', icon: 'chess' },
  github: { name: 'github', icon: 'github', route: ROUTES.GitHub },
  navLinks: [
    { name: 'landing', icon: 'home', route: ROUTES.Landing },
    { name: 'translate', icon: 'language', route: ROUTES.Translate },
    { name: 'browse', icon: 'book', route: ROUTES.Browse },
    { name: 'collections', icon: 'archive', route: ROUTES.Collections },
    { name: 'settings', icon: 'settings', route: ROUTES.Settings },
    { name: 'about', icon: 'code', route: ROUTES.About },
  ],
};
