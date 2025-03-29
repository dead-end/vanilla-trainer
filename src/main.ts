import './assets/reset.css';
import './assets/style.css';
import { PageLayout } from './components/PageLayout';
import { routeInit, routeRegister } from './lib/route';
import { AdminPage } from './pages/AdminPage';
import { IndexPage } from './pages/IndexPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { Table } from './pages/table';

console.log('Started');

customElements.define('page-layout', PageLayout);
customElements.define('my-table', Table);

customElements.define('not-found-page', NotFoundPage);
customElements.define('index-page', IndexPage);
customElements.define('admin-page', AdminPage);

routeRegister('/', 'index-page');
routeRegister('/admin', 'admin-page');

routeInit();
