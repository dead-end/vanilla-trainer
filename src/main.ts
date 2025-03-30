import './assets/reset.css';
import './assets/style.css';
import { FieldInput } from './components/form/FieldInput';
import { FieldLabel } from './components/form/FieldLabel';
import { Navigation } from './components/Navigation';
import { PageLayout } from './components/PageLayout';
import { routeInit, routeRegister } from './lib/route';
import { AdminPage } from './pages/AdminPage';
import { IndexPage } from './pages/IndexPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { FormWrapper } from './components/form/FormWrapper';
import { Button } from './components/ui/Button';

console.log('Started');

routeRegister('#/', 'Home', 'index-page');
routeRegister('#/admin', 'Admin', 'admin-page');

routeInit();

customElements.define('page-layout', PageLayout);
customElements.define('navi-gation', Navigation);

customElements.define('ui-button', Button);

customElements.define('form-wrapper', FormWrapper);
customElements.define('field-input', FieldInput);
customElements.define('field-label', FieldLabel);

customElements.define('not-found-page', NotFoundPage);
customElements.define('index-page', IndexPage);
customElements.define('admin-page', AdminPage);
