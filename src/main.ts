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
import { ChapterListPage } from './pages/chapter/ChapterListPage';
import { ChapterCreatePage } from './pages/chapter/ChapterCreatePage';
import { ChapterUpdatePage } from './pages/chapter/ChapterUpdatePage';
import { ConfirmDialog } from './components/ConfirmDialog';
import { QuestionListPage } from './pages/question/QuestionListPage';
import { QuestionShow } from './components/QuestionShow';
import { QuestionCreatePage } from './pages/question/QuestionCreatePage';
import { QuestionUpdatePage } from './pages/question/QuestionUpdatePage';
import { PreviewField } from './components/ui/PreviewField';
import { LessionPreparePage } from './pages/lession/LessionPreparePage';
import { LessionProcessPage } from './pages/lession/LessionProcessPage';
import { InfoTable } from './components/InfoTable';
import { CachePage } from './pages/misc/CachePage';
import { SearchPage } from './pages/misc/SearchPage';

console.log('Started');

document.adoptedStyleSheets = STYLES;

routeRegister(/^#\/$/, 'index-page');
routeRegister(/^#\/admin$/, 'admin-page');
routeRegister(/^#\/books$/, 'book-list-page');
routeRegister(/^#\/books\/create$/, 'book-create-page');
routeRegister(/^#\/books\/update\/(?<bookId>[^\/]+)$/, 'book-update-page');
routeRegister(/^#\/book\/(?<bookId>[^\/]+)\/chapters$/, 'chapter-list-page');
routeRegister(
  /^#\/book\/(?<bookId>[^\/]+)\/chapters\/create$/,
  'chapter-create-page'
);
routeRegister(
  /^#\/book\/(?<bookId>[^\/]+)\/chapter\/(?<chapterId>[^\/]+)\/update$/,
  'chapter-update-page'
);
routeRegister(
  /^#\/book\/(?<bookId>[^\/]+)\/chapter\/(?<chapterId>[^\/]+)\/questions$/,
  'question-list-page'
);
routeRegister(
  /^#\/book\/(?<bookId>[^\/]+)\/chapter\/(?<chapterId>[^\/]+)\/questions\/create$/,
  'question-create-page'
);
routeRegister(
  /^#\/book\/(?<bookId>[^\/]+)\/chapter\/(?<chapterId>[^\/]+)\/question\/(?<idx>[^\/]+)\/update$/,
  'question-update-page'
);
routeRegister(
  /^#\/book\/(?<bookId>[^\/]+)\/chapter\/(?<chapterId>[^\/]+)\/lession-prepare$/,
  'lession-prepare-page'
);
routeRegister(/^#\/lession-process$/, 'lession-process-page');
routeRegister(/^#\/misc\/cache$/, 'cache-page');
routeRegister(/^#\/misc\/search(\/(?<searchStr>[^\/]+))?$/, 'search-page');

customElements.define('navi-gation', Navigation);
customElements.define('error-msg', ErrorMsg);
customElements.define('confirm-dialog', ConfirmDialog);
customElements.define('question-show', QuestionShow);
customElements.define('info-table', InfoTable);

customElements.define('ui-field', UiField);
customElements.define('preview-field', PreviewField);
customElements.define('ui-icons', Icons);

customElements.define('not-found-page', NotFoundPage);
customElements.define('index-page', IndexPage);
customElements.define('admin-page', AdminPage);

customElements.define('cache-page', CachePage);
customElements.define('search-page', SearchPage);

customElements.define('book-list-page', BookListPage);
customElements.define('book-create-page', BookCreatePage);
customElements.define('book-update-page', BookUpdatePage);

customElements.define('chapter-list-page', ChapterListPage);
customElements.define('chapter-create-page', ChapterCreatePage);
customElements.define('chapter-update-page', ChapterUpdatePage);

customElements.define('question-list-page', QuestionListPage);
customElements.define('question-create-page', QuestionCreatePage);
customElements.define('question-update-page', QuestionUpdatePage);

customElements.define('lession-prepare-page', LessionPreparePage);
customElements.define('lession-process-page', LessionProcessPage);

routeInit('#/', '#/admin', 'not-found-page');

adminInit();
