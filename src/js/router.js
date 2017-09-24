

import Home from './routes/home.js';
import About from './routes/about.js';
import Create from './routes/create.js';

const routes = [
  { path: '/', component: Home, label: 'Home', visible: false },
  { path: '/about', component: About, label: 'About', visible: true },
  { path: '/create', component: Create, label: 'Create', visible: true },
];

const router = new VueRouter({ routes });

export default router;