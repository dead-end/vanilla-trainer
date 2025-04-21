import { Icons } from './components/Icons';
import { Navigation } from './components/Navigation';
import { adminInit } from './lib/admin';
import { routeInit, routeRegister } from './lib/route';
import { IndexPage } from './pages/IndexPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AdminPage } from './pages/AdminPage';
import { BookListPage } from './pages/book/BookListPage';
import { BookCreatePage } from './pages/book/BookCreatePage';
import { ErrorMsg } from './components/ErrorMsg';
import { BookUpdatePage } from './pages/book/BookUpdatePage';
import { UiField } from './components/ui/UiField';
import { STYLES } from './lib/ui/stylesheets';

console.log('Started');

document.adoptedStyleSheets = STYLES;

routeRegister(/^#\/$/, 'index-page');
routeRegister(/^#\/admin$/, 'admin-page');
routeRegister(/^#\/books$/, 'book-list-page');
routeRegister(/^#\/books\/create$/, 'book-create-page');
routeRegister(/^#\/book\/update\/(?<bookId>[^\/]+)$/, 'book-update-page');

customElements.define('navi-gation', Navigation);
customElements.define('error-msg', ErrorMsg);

customElements.define('ui-field', UiField);
customElements.define('ui-icons', Icons);

customElements.define('not-found-page', NotFoundPage);
customElements.define('index-page', IndexPage);
customElements.define('admin-page', AdminPage);
customElements.define('book-list-page', BookListPage);
customElements.define('book-create-page', BookCreatePage);
customElements.define('book-update-page', BookUpdatePage);

routeInit('#/', '#/admin', 'not-found-page');

adminInit();
