import { useBuilderStore } from '../store/builderStore';
import { componentRegistry } from '../registry/componentRegistry';
import './PropertiesPanel.css';

// ── All sub-components OUTSIDE PropertiesPanel to prevent remount on every render ──

function Field({ label, prop, value, onChange, inputType = 'text', full = false }) {
  return (
    <div className={`prop-field${full ? ' full' : ''}`}>
      <label className="prop-label">{label}</label>
      <input
        className="prop-input"
        type={inputType}
        value={value ?? ''}
        onChange={(e) => onChange(prop, e.target.value)}
        placeholder="—"
        spellCheck={false}
      />
    </div>
  );
}

function ColorField({ label, prop, value, onChange }) {
  const hex = /^#[0-9a-fA-F]{3,8}$/.test(value) ? value : '#000000';
  return (
    <div className="prop-field full">
      <label className="prop-label">{label}</label>
      <div className="color-row">
        <input
          type="color"
          className="color-swatch"
          value={hex}
          onChange={(e) => onChange(prop, e.target.value)}
        />
        <input
          className="prop-input"
          type="text"
          value={value ?? ''}
          onChange={(e) => onChange(prop, e.target.value)}
          placeholder="—"
          spellCheck={false}
        />
      </div>
    </div>
  );
}

function SelectField({ label, prop, value, onChange, options }) {
  return (
    <div className="prop-field full">
      <label className="prop-label">{label}</label>
      <select
        className="prop-input"
        value={value ?? ''}
        onChange={(e) => onChange(prop, e.target.value)}
      >
        <option value="">—</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)};
      </select>
    </div>
  );
}

function BooleanField({ label, prop, value, onChange }) {
  return (
    <div className="prop-field full">
      <label className="prop-label">{label}</label>
      <select
        className="prop-input"
        value={value ? 'true' : 'false'}
        onChange={(e) => onChange(prop, e.target.value === 'true')}
      >
        <option value="false">False</option>
        <option value="true">True</option>
      </select>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="prop-section">
      <div className="prop-section-title">{title}</div>
      <div className="prop-grid">{children}</div>
    </div>
  );
}

// ── Helper to find registry component definition ──
function getRegistryComponentDef(component) {
  if (!component.category || !component.type) return null;
  const categoryComponents = componentRegistry[component.category];
  if (!categoryComponents) return null;
  return categoryComponents.find(c => c.id === component.type);
}

// ── Render registry component props ──
function RegistryComponentProps({ component, onChange }) {
  const registryDef = getRegistryComponentDef(component);
  if (!registryDef) return null;

  const props = registryDef.propTypes || {};
  const editableProps = registryDef.editableProps || [];
  const v = (prop) => component.props?.[prop] ?? '';

  return (
    <Section title="Component Properties">
      {editableProps.map((propName) => {
        const propDef = props[propName];
        if (!propDef) return null;

        const handleChange = (val) => {
          const newProps = { ...component.props, [propName]: val };
          onChange('props', newProps);
        };

        switch (propDef.type) {
          case 'string':
            return (
              <Field
                key={propName}
                label={propDef.label}
                prop={propName}
                value={v(propName)}
                onChange={(_, val) => handleChange(val)}
                full
              />
            );
          case 'select':
            return (
              <SelectField
                key={propName}
                label={propDef.label}
                prop={propName}
                value={v(propName)}
                onChange={(_, val) => handleChange(val)}
                options={propDef.options || []}
              />
            );
          case 'boolean':
            return (
              <BooleanField
                key={propName}
                label={propDef.label}
                prop={propName}
                value={v(propName)}
                onChange={(_, val) => handleChange(val)}
              />
            );
          case 'color':
            return (
              <ColorField
                key={propName}
                label={propDef.label}
                prop={propName}
                value={v(propName)}
                onChange={(_, val) => handleChange(val)}
              />
            );
          default:
            return null;
        }
      })}
    </Section>
  );
}

// ── Main panel ────────────────────────────────────────────────

export default function PropertiesPanel() {
  const component = useBuilderStore((s) => {
    const id = s.selectedComponentId;
    if (!id) return null;
    const find = (items) => {
      for (const item of items) {
        if (item.id === id) return item;
        if (item.children?.length) { const f = find(item.children); if (f) return f; }
      }
      return null;
    };
    return find(s.components);
  });

  const updateComponent = useBuilderStore((s) => s.updateComponent);

  if (!component) {
    return (
      <div className="properties-panel">
        <div className="panel-header"><span className="panel-title">Properties</span></div>
        <div className="properties-empty">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.3">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
          </svg>
          <p>Select a component<br/>to edit its properties</p>
        </div>
      </div>
    );
  }

  const onChange = (prop, val) => updateComponent(component.id, { [prop]: val });
  const v = (prop) => component[prop] ?? '';
  const type = component.type || component.id;

  const isText   = ['heading','subheading','paragraph','label','badge','chip','alert','toast','link'].includes(type);
  const isButton = type.startsWith('button') || type.includes('button');
  const isInput  = ['input','password-input','textarea','select','autocomplete'].includes(type);
  const isLayout = ['container','section','flex','grid','card','navbar','sidebar','footer','menu'].includes(type);
  const isImage  = type === 'image';
  const isFlex   = ['flex','container','section'].includes(type);
  const isGrid   = type === 'grid';
  const isRegistry = component.component && typeof component.component === 'function';

  return (
    <div className="properties-panel">
      <div className="panel-header">
        <span className="panel-title">Properties</span>
        <span className="panel-badge">{type}</span>
      </div>

      <div className="properties-content">

        <Section title="Position & Size">
          <Field label="Left"   prop="left"   value={v('left')}   onChange={onChange} />
          <Field label="Top"    prop="top"    value={v('top')}    onChange={onChange} />
          <Field label="Width"  prop="width"  value={v('width')}  onChange={onChange} />
          <Field label="Height" prop="height" value={v('height')} onChange={onChange} />
        </Section>

        {isRegistry && (
          <RegistryComponentProps component={component} onChange={onChange} />
        )}

        {(isText || isButton) && !isRegistry && (
          <Section title="Content">
            <Field label="Text" prop="text" value={v('text')} onChange={onChange} full />
          </Section>
        )}

        {isInput && (
          <Section title="Content">
            <Field label="Placeholder" prop="placeholder" value={v('placeholder')} onChange={onChange} full />
          </Section>
        )}

        {isImage && (
          <Section title="Image">
            <Field label="Source URL" prop="src" value={v('src')} onChange={onChange} full />
            <SelectField label="Object Fit" prop="objectFit" value={v('objectFit')} onChange={onChange}
              options={['cover','contain','fill','none','scale-down']} />
          </Section>
        )}

        {(isText || isButton) && !isRegistry && (
          <Section title="Typography">
            <Field label="Font Size"   prop="fontSize"   value={v('fontSize')}   onChange={onChange} />
            <Field label="Font Weight" prop="fontWeight" value={v('fontWeight')} onChange={onChange} />
            <Field label="Line Height" prop="lineHeight" value={v('lineHeight')} onChange={onChange} />
            <SelectField label="Text Align" prop="textAlign" value={v('textAlign')} onChange={onChange}
              options={['left','center','right','justify']} />
            <ColorField label="Color" prop="color" value={v('color')} onChange={onChange} />
          </Section>
        )}

        {(isButton || isLayout || isText || isInput) && !isRegistry && (
          <Section title="Appearance">
            <ColorField label="Background" prop="backgroundColor" value={v('backgroundColor')} onChange={onChange} />
            <Field label="Border"        prop="border"       value={v('border')}       onChange={onChange} full />
            <Field label="Border Radius" prop="borderRadius" value={v('borderRadius')} onChange={onChange} />
            <Field label="Opacity"       prop="opacity"      value={v('opacity')}      onChange={onChange} />
            <Field label="Box Shadow"    prop="boxShadow"    value={v('boxShadow')}    onChange={onChange} full />
          </Section>
        )}

        <Section title="Spacing">
          <Field label="Padding" prop="padding" value={v('padding')} onChange={onChange} />
          <Field label="Margin"  prop="margin"  value={v('margin')}  onChange={onChange} />
          <Field label="Gap"     prop="gap"     value={v('gap')}     onChange={onChange} />
        </Section>

        {isFlex && (
          <Section title="Flex">
            <SelectField label="Direction" prop="flexDirection" value={v('flexDirection')} onChange={onChange}
              options={['row','row-reverse','column','column-reverse']} />
            <SelectField label="Align Items" prop="alignItems" value={v('alignItems')} onChange={onChange}
              options={['flex-start','center','flex-end','stretch','baseline']} />
            <SelectField label="Justify" prop="justifyContent" value={v('justifyContent')} onChange={onChange}
              options={['flex-start','center','flex-end','space-between','space-around','space-evenly']} />
          </Section>
        )}

        {isGrid && (
          <Section title="Grid">
            <Field label="Columns" prop="gridTemplateColumns" value={v('gridTemplateColumns')} onChange={onChange} full />
            <Field label="Rows"    prop="gridTemplateRows"    value={v('gridTemplateRows')}    onChange={onChange} full />
          </Section>
        )}

      </div>
    </div>
  );
}
