import './assets/reset.css';
import './assets/style.css';
import { Icons } from './components/Icons';
import { Navigation } from './components/Navigation';
import { PageLayout } from './components/PageLayout';
import { UiInput } from './components/ui/UiInput';
import { routeInit, routeRegister } from './lib/route';
import { AdminPage } from './pages/AdminPage';
import { IndexPage } from './pages/IndexPage';
import { NotFoundPage } from './pages/NotFoundPage';

console.log('Started');

routeRegister('#/', 'Home', 'index-page');
routeRegister('#/admin', 'Admin', 'admin-page');

customElements.define('page-layout', PageLayout);
customElements.define('navi-gation', Navigation);

customElements.define('ui-input', UiInput);
customElements.define('ui-icons', Icons);

customElements.define('not-found-page', NotFoundPage);
customElements.define('index-page', IndexPage);
customElements.define('admin-page', AdminPage);

routeInit();
