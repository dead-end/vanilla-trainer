import './assets/reset.css';
import './assets/style.css';
import { Icons } from './components/Icons';
import { Navigation } from './components/Navigation';
import { UiInput } from './components/ui/UiInput';
import { adminInit } from './lib/admin';
import { routeInit, routeRegister } from './lib/route';
import { AdminPage } from './pages/AdminPage';
import { BookListPage } from './pages/book/BookListPage';
import { IndexPage } from './pages/IndexPage';
import { NotFoundPage } from './pages/NotFoundPage';

console.log('Started');

routeRegister('#/', 'index-page');
routeRegister('#/admin', 'admin-page');
routeRegister('#/books', 'book-list-page');
//routeRegister('*', 'not-found-page');

customElements.define('navi-gation', Navigation);

customElements.define('ui-input', UiInput);
customElements.define('ui-icons', Icons);

customElements.define('not-found-page', NotFoundPage);
customElements.define('index-page', IndexPage);
customElements.define('admin-page', AdminPage);
customElements.define('book-list-page', BookListPage);

routeInit();

adminInit();
