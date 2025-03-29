import './assets/reset.css';
import './assets/style.css';
import { Navigation } from './components/Navigation';
import { PageLayout } from './components/PageLayout';
import { routeInit, routeRegister } from './lib/route';
import { AdminPage } from './pages/AdminPage';
import { IndexPage } from './pages/IndexPage';
import { NotFoundPage } from './pages/NotFoundPage';

console.log('Started');

routeRegister('/', 'index-page');
routeRegister('/admin', 'admin-page');

routeInit();

customElements.define('page-layout', PageLayout);
customElements.define('navi-gation', Navigation);

customElements.define('not-found-page', NotFoundPage);
customElements.define('index-page', IndexPage);
customElements.define('admin-page', AdminPage);
