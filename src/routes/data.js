import ROUTES from '../global/routes';
import nanoid from 'nanoid/non-secure';

import Landing from '../pages/landing';
import Conjugate from '../pages/conjugate';
import Browse from '../pages/browse';
import Collections from '../pages/collections';
import Settings from '../pages/settings';
import About from '../pages/about';
import Translate from '../pages/translate';
import GitHub from '../pages/github';

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
