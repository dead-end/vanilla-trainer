import './assets/reset.css';
import './assets/style.css';
import { PageLayout } from './components/PageLayout';
import { IndexPage } from './pages/IndexPage';
import { Table } from './pages/table';

console.log('Started');

customElements.define('page-layout', PageLayout);
customElements.define('my-table', Table);
customElements.define('index-page', IndexPage);
