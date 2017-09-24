

import Home from './routes/home.js';
import About from './routes/about.js';

const routes = [
  { path: '/', component: Home, label: 'Home', visible: false },
  { path: '/about', component: About, label: 'About', visible: true },
];

const router = new VueRouter({ routes });

export default router;