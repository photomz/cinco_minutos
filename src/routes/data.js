import ROUTES from '../global/routes';
import Home from '../pages/Home';
import Browse from '../pages/Browse';
import Collections from '../pages/Collections';
import Settings from '../pages/Settings';
import About from '../pages/About';
import Translate from '../pages/Translate';
import GitHub from '../pages/GitHub';

export default [
  { path: ROUTES.Home, component: Home, exact: true },
  { path: ROUTES.Conjugate, component: Home },
  { path: ROUTES.Translate, component: Translate },
  { path: ROUTES.Browse, component: Browse },
  { path: ROUTES.Collections, component: Collections },
  { path: ROUTES.Settings, component: Settings },
  { path: ROUTES.About, component: About },
  { path: ROUTES.GitHub, component: GitHub },
];
