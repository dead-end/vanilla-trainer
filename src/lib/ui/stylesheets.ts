import reset from '../assets/reset.css?raw';
import style from '../assets/style.css?raw';

const cssReset = new CSSStyleSheet();
cssReset.replace(reset);

const cssStyles = new CSSStyleSheet();
cssStyles.replace(style);

export const STYLES = [cssReset, cssStyles];
