import ROUTES from '../global/routes';
import nanoid from 'nanoid/non-secure';
import Landing from '../pages/Landing';
import Conjugate from '../pages/Conjugate';
import Browse from '../pages/Browse';
import Collections from '../pages/Collections';
import Settings from '../pages/Settings';
import About from '../pages/About';
import Translate from '../pages/Translate';
import GitHub from '../pages/GitHub';

export default [
  { path: ROUTES.Landing, component: Landing, exact: true, key: nanoid() },
  { path: ROUTES.Conjugate + '/:slug', component: Conjugate, key: nanoid() },
  { path: ROUTES.Translate + '/:slug?', component: Translate, key: nanoid() },
  { path: ROUTES.Browse, component: Browse, key: nanoid() },
  { path: ROUTES.Collections, component: Collections, key: nanoid() },
  { path: ROUTES.Settings, component: Settings, key: nanoid() },
  { path: ROUTES.About, component: About, key: nanoid() },
  { path: ROUTES.GitHub, component: GitHub, key: nanoid() },
];
