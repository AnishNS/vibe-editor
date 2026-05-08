const sanitizeClassName = (id) => `component-${String(id).replace(/[^a-zA-Z0-9_-]/g, '-')}`;

const toCssProperty = (key) => key.replace(/([A-Z])/g, '-$1').toLowerCase();

const buildStyles = (props) => {
  const styleKeys = [
    'position',
    'top',
    'left',
    'width',
    'height',
    'display',
    'flexDirection',
    'gridTemplateColumns',
    'gridTemplateRows',
    'alignItems',
    'justifyContent',
    'gap',
    'padding',
    'margin',
    'backgroundColor',
    'border',
    'borderRadius',
    'boxShadow',
    'color',
    'fontSize',
    'fontWeight',
    'lineHeight',
    'textAlign',
    'opacity',
    'overflow',
    'borderTop',
    'borderRight',
    'borderBottom',
    'borderLeft',
    'cursor',
    'objectFit',
  ];

  return styleKeys
    .filter((key) => props[key] !== undefined && props[key] !== null && props[key] !== '')
    .map((key) => `${toCssProperty(key)}: ${props[key]};`)
    .join(' ');
};

const renderComponent = (component, level = 2) => {
  const indent = '  '.repeat(level);
  const type = component.type || component.id;
  const className = sanitizeClassName(component.id);
  const childHTML = (component.children || []).map((child) => renderComponent(child, level + 1)).join('\n');

  const componentMap = {
    button: `<button class="${className}">${component.text || 'Button'}</button>`,
    'button-outlined': `<button class="${className}">${component.text || 'Button'}</button>`,
    heading: `<h1 class="${className}">${component.text || 'Heading'}</h1>`,
    subheading: `<h2 class="${className}">${component.text || 'Subheading'}</h2>`,
    paragraph: `<p class="${className}">${component.text || 'Paragraph'}</p>`,
    label: `<label class="${className}">${component.text || 'Label'}</label>`,
    input: `<input class="${className}" type="text" placeholder="${component.placeholder || 'Enter text...'}" />`,
    textarea: `<textarea class="${className}" placeholder="${component.placeholder || 'Enter text...'}"></textarea>`,
    checkbox: `<input class="${className}" type="checkbox" />`,
    radio: `<input class="${className}" type="radio" />`,
    select: `<select class="${className}">\n${indent}  <option>Option 1</option>\n${indent}  <option>Option 2</option>\n${indent}  <option>Option 3</option>\n${indent}</select>`,
    image: `<img class="${className}" src="${component.src || 'https://via.placeholder.com/300x200'}" alt="Image" />`,
    badge: `<span class="${className}">${component.text || 'Badge'}</span>`,
    chip: `<span class="${className}">${component.text || 'Chip'}</span>`,
    alert: `<div class="${className}">${component.text || 'Alert message'}</div>`,
    toast: `<div class="${className}">${component.text || 'Toast message'}</div>`,
    progress: `<div class="${className}"><div class="${className}__track"></div></div>`,
    spinner: `<div class="${className}"></div>`,
    divider: `<div class="${className}"></div>`,
    navbar: `<nav class="${className}">\n${indent}  <div class="${className}__brand">Brand</div>\n${indent}  <div class="${className}__items">\n${indent}    <a href="#">Home</a>\n${indent}    <a href="#">About</a>\n${indent}  </div>\n${indent}</nav>`,
    breadcrumb: `<div class="${className}">\n${indent}  <a href="#">Home</a> / <a href="#">Page</a>\n${indent}</div>`,
    tabs: `<div class="${className}">\n${indent}  <button>Tab 1</button>\n${indent}  <button>Tab 2</button>\n${indent}</div>`,
    menu: `<div class="${className}">\n${indent}  <a href="#">Item 1</a>\n${indent}  <a href="#">Item 2</a>\n${indent}</div>`,
  };

  if (componentMap[type]) {
    return `${indent}${componentMap[type]}`;
  }

  const wrapperTag = 'div';
  const content = component.text || type;

  if (childHTML) {
    return `${indent}<${wrapperTag} class="${className}">\n${childHTML}\n${indent}</${wrapperTag}>`;
  }

  return `${indent}<${wrapperTag} class="${className}">${content}</${wrapperTag}>`;
};

export const generateHTML = (components) => {
  const componentHTML = components.map((component) => renderComponent(component)).join('\n');

  return `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Vibe Editor Preview</title>\n  <link rel="stylesheet" href="styles.css">\n</head>\n<body>\n  <div class="vibe-app">\n${componentHTML}\n  </div>\n  <script src="script.js"></script>\n</body>\n</html>`;
};

export const generateCSS = (components) => {
  const componentStyles = components.map((component) => generateComponentCSS(component)).join('\n\n');

  return `* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}\n\nbody {\n  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;\n  background: #f8fafc;\n  color: #111827;\n  min-height: 100vh;\n}\n\n.vibe-app {\n  width: 100%;\n  min-height: 100vh;\n  padding: 24px;\n}\n\n${componentStyles}`;
};

export const generateJS = () => {
  return `// Vibe Editor generated script\nwindow.addEventListener('DOMContentLoaded', () => {\n  console.log('Vibe Editor page loaded');\n});`;
};

const generateComponentCSS = (component) => {
  const selector = `.${sanitizeClassName(component.id)}`;
  const baseStyles = buildStyles(component);

  if (component.type === 'progress') {
    return `${selector} { ${baseStyles} }\n${selector}__track { width: 100%; height: 100%; background: #e5e7eb; border-radius: 999px; overflow: hidden; }\n${selector}__track::before { content: ''; display: block; width: 60%; height: 100%; background: #2563eb; }`;
  }

  if (component.type === 'spinner') {
    return `${selector} { ${baseStyles} animation: rotate-360 1s linear infinite; }\n@keyframes rotate-360 { to { transform: rotate(360deg); } }`;
  }

  return `${selector} { ${baseStyles} }`;
};
