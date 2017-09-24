

import Home from './routes/home.js';
import About from './routes/about.js';
import Create from './routes/create.js';
import Dons from './routes/dons.js';
import Don from './routes/don.js';

const routes = [
  { path: '/', component: Home, label: 'Home', visible: false },
  { path: '/about', component: About, label: 'About', visible: true },
  { path: '/create', component: Create, label: 'Create', visible: true },
  { path: '/dons', component: Dons, label: 'Dons', visible: true },
  { path: '/don/:id', component: Don, label: 'Don', visible: false },
];

const router = new VueRouter({ routes });

export default router;