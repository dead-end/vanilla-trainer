import reset from '../assets/reset.css?raw';
import style from '../assets/style.css?raw';

const cssReset = new CSSStyleSheet();
cssReset.replace(reset);

const cssStyles = new CSSStyleSheet();
cssStyles.replace(style);

/**
 * see: https://www.mercedes-benz.io/blog/2022-06-29-you-dont-need-a-js-library-for-your-components
 */
export const STYLE_SHEETS = [cssReset, cssStyles];
