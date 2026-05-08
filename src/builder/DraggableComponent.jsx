import { useState, useRef, useEffect } from 'react';
import { useBuilderStore } from '../store/builderStore';
import './DraggableComponent.css';

const LAYOUT_TYPES = new Set(['container', 'section', 'card', 'flex', 'grid', 'navbar', 'sidebar', 'menu', 'footer']);

// Wrapper so nested children subscribe to selectedComponentId reactively
function ChildComponent({ child, selectComponent }) {
  const selectedComponentId = useBuilderStore((s) => s.selectedComponentId);
  return (
    <DraggableComponent
      component={child}
      isSelected={selectedComponentId === child.id}
      onSelect={() => selectComponent(child.id)}
    />
  );
}

// 8 resize handles: direction → cursor
const HANDLES = [
  { dir: 'n',  cursor: 'n-resize'  },
  { dir: 'ne', cursor: 'ne-resize' },
  { dir: 'e',  cursor: 'e-resize'  },
  { dir: 'se', cursor: 'se-resize' },
  { dir: 's',  cursor: 's-resize'  },
  { dir: 'sw', cursor: 'sw-resize' },
  { dir: 'w',  cursor: 'w-resize'  },
  { dir: 'nw', cursor: 'nw-resize' },
];

export function DraggableComponent({ component, isSelected, onSelect, parentSelected }) {
  const { updateComponent, deleteComponent, addComponent, selectComponent } = useBuilderStore();
  const [isDragging, setIsDragging] = useState(false);
  const [editingText, setEditingText] = useState(false);
  const [editValue, setEditValue] = useState(component.text || '');
  const dragRef = useRef(null);

  useEffect(() => { setEditValue(component.text || ''); }, [component.text]);

  // ── Style ────────────────────────────────────────────────────
  const style = {
    position: component.position || 'absolute',
    left:   component.left   || '0px',
    top:    component.top    || '0px',
    width:  typeof component.width  === 'number' ? `${component.width}px`  : (component.width  || 'auto'),
    height: typeof component.height === 'number' ? `${component.height}px` : (component.height || 'auto'),
    display:         component.display        || 'inline-flex',
    flexDirection:   component.flexDirection,
    alignItems:      component.alignItems,
    justifyContent:  component.justifyContent,
    gap:             component.gap,
    padding:         component.padding,
    margin:          component.margin,
    backgroundColor: component.backgroundColor,
    color:           component.color,
    border:          component.border,
    borderRadius:    component.borderRadius,
    boxShadow:       component.boxShadow,
    textAlign:       component.textAlign,
    fontSize:        component.fontSize,
    fontWeight:      component.fontWeight,
    lineHeight:      component.lineHeight,
    overflow:        component.overflow || 'visible',
    cursor:          isDragging ? 'grabbing' : 'grab',
    zIndex:          isSelected ? 10 : 1,
    minWidth:        component.minWidth,
    minHeight:       component.minHeight,
    gridTemplateColumns: component.gridTemplateColumns,
    gridTemplateRows:    component.gridTemplateRows,
  };

  // ── Drag to move ─────────────────────────────────────────────
  useEffect(() => {
    if (!isDragging) return;

    const onMove = (e) => {
      const el = dragRef.current;
      if (!el) return;
      e.preventDefault();
      const parent = el.parentElement;
      const rect = parent.getBoundingClientRect();
      updateComponent(component.id, {
        left: `${Math.max(0, e.clientX - rect.left - el.offsetWidth / 2)}px`,
        top:  `${Math.max(0, e.clientY - rect.top  - el.offsetHeight / 2)}px`,
      });
    };

    const onUp = () => setIsDragging(false);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [isDragging, component.id, updateComponent]);

  const handlePointerDown = (e) => {
    if (e.button !== 0) return;
    if (e.target.dataset.resize) return;
    if (editingText) return;
    e.stopPropagation();
    onSelect();
    setIsDragging(true);
  };

  // ── 8-direction resize ───────────────────────────────────────
  const handleResizeStart = (dir) => (e) => {
    e.preventDefault();
    e.stopPropagation();

    const el = dragRef.current;
    const startX = e.clientX;
    const startY = e.clientY;
    const startW = el.offsetWidth;
    const startH = el.offsetHeight;
    const startL = parseFloat(component.left) || 0;
    const startT = parseFloat(component.top)  || 0;

    const onMove = (me) => {
      const dx = me.clientX - startX;
      const dy = me.clientY - startY;
      const updates = {};

      if (dir.includes('e'))  { updates.width  = `${Math.max(30, startW + dx)}px`; }
      if (dir.includes('s'))  { updates.height = `${Math.max(20, startH + dy)}px`; }
      if (dir.includes('w'))  {
        const w = Math.max(30, startW - dx);
        updates.width = `${w}px`;
        updates.left  = `${startL + startW - w}px`;
      }
      if (dir.includes('n'))  {
        const h = Math.max(20, startH - dy);
        updates.height = `${h}px`;
        updates.top    = `${startT + startH - h}px`;
      }

      updateComponent(component.id, updates);
    };

    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  // ── Text editing ─────────────────────────────────────────────
  const handleTextSave = () => {
    setEditingText(false);
    const updates = { text: editValue };
    // Also update props.text for registry components
    if (component.props) {
      updates.props = { ...component.props, text: editValue };
    }
    updateComponent(component.id, updates);
  };

  const renderEditableText = () => {
    if (!editingText) {
      return (
        <div className="draggable-text-content" onDoubleClick={(e) => { e.stopPropagation(); setEditingText(true); }}>
          {component.text || 'Double-click to edit'}
        </div>
      );
    }
    return (
      <input
        className="draggable-text-input"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleTextSave}
        onKeyDown={(e) => {
          e.stopPropagation();
          if (e.key === 'Enter') handleTextSave();
          if (e.key === 'Escape') { setEditingText(false); setEditValue(component.text || ''); }
        }}
        onClick={(e) => e.stopPropagation()}
        autoFocus
      />
    );
  };

  // ── Content renderer ─────────────────────────────────────────
  const renderContent = () => {
    const type = component.type || component.id;

    if (['heading', 'subheading', 'paragraph', 'label', 'badge', 'chip', 'alert', 'toast', 'link'].includes(type)) {
      return renderEditableText();
    }

    // Handle registry components (contained-button, outlined-button, etc.)
    if (component.component && typeof component.component === 'function') {
      const Component = component.component;
      return (
        <div 
          style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onDoubleClick={(e) => { e.stopPropagation(); setEditingText(true); }}
        >
          {editingText ? (
            <input
              className="draggable-text-input"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleTextSave}
              onKeyDown={(e) => {
                e.stopPropagation();
                if (e.key === 'Enter') handleTextSave();
                if (e.key === 'Escape') { setEditingText(false); setEditValue(component.text || ''); }
              }}
              onClick={(e) => e.stopPropagation()}
              autoFocus
            />
          ) : (
            <Component {...(component.props || {})} text={component.text} />
          )}
        </div>
      );
    }

    switch (type) {
      case 'button':
      case 'button-outlined':
      case 'button-gradient':
      case 'button-icon':
      case 'button-loading':
      case 'button-danger':
        return (
          <button
            className="canvas-button"
            style={{
              width: '100%', height: '100%',
              backgroundColor: component.backgroundColor,
              color: component.color,
              border: component.border,
              borderRadius: component.borderRadius,
              fontSize: component.fontSize,
              fontWeight: component.fontWeight,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: component.boxShadow,
              padding: 0,
            }}
            onDoubleClick={(e) => { e.stopPropagation(); setEditingText(true); }}
            onClick={(e) => e.stopPropagation()}
          >
            {editingText ? (
              <input
                className="draggable-text-input"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={handleTextSave}
                onKeyDown={(e) => {
                  e.stopPropagation();
                  if (e.key === 'Enter') handleTextSave();
                  if (e.key === 'Escape') { setEditingText(false); setEditValue(component.text || ''); }
                }}
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            ) : (component.text || 'Button')}
          </button>
        );

      case 'input':
      case 'password-input':
        return (
          <input
            type={type === 'password-input' ? 'password' : 'text'}
            className="canvas-input"
            placeholder={component.placeholder}
            style={{ width: '100%', height: '100%', padding: component.padding, border: component.border, borderRadius: component.borderRadius, fontSize: component.fontSize, boxSizing: 'border-box' }}
            onClick={(e) => e.stopPropagation()}
          />
        );

      case 'textarea':
        return (
          <textarea
            className="canvas-textarea"
            placeholder={component.placeholder}
            style={{ width: '100%', height: '100%', padding: component.padding, border: component.border, borderRadius: component.borderRadius, fontSize: component.fontSize, fontFamily: 'inherit', resize: 'none', boxSizing: 'border-box' }}
            onClick={(e) => e.stopPropagation()}
          />
        );

      case 'select':
      case 'autocomplete':
        return (
          <select
            className="canvas-select"
            style={{ width: '100%', height: '100%', padding: component.padding, border: component.border, borderRadius: component.borderRadius, fontSize: component.fontSize, boxSizing: 'border-box' }}
            onClick={(e) => e.stopPropagation()}
          >
            <option>Option 1</option>
            <option>Option 2</option>
            <option>Option 3</option>
          </select>
        );

      case 'image':
        return (
          <img
            src={component.src || 'https://placehold.co/300x200/21262d/8b949e?text=Image'}
            alt="canvas"
            style={{ width: '100%', height: '100%', borderRadius: component.borderRadius, objectFit: component.objectFit || 'cover', display: 'block' }}
            onClick={(e) => e.stopPropagation()}
          />
        );

      case 'checkbox':
      case 'radio':
        return (
          <input type={type} style={{ width: '18px', height: '18px', cursor: 'pointer' }} onClick={(e) => e.stopPropagation()} />
        );

      case 'divider':
        return <div style={{ width: '100%', height: '100%', backgroundColor: component.backgroundColor || '#30363d' }} />;

      case 'progress':
        return (
          <div style={{ width: '100%', height: '100%', backgroundColor: component.backgroundColor || '#30363d', borderRadius: component.borderRadius || '4px', overflow: 'hidden' }}>
            <div style={{ width: '60%', height: '100%', backgroundColor: component.color || '#2f81f7' }} />
          </div>
        );

      case 'spinner':
        return (
          <div style={{ width: '100%', height: '100%', borderRadius: '50%', border: `3px solid ${component.backgroundColor || '#30363d'}`, borderTopColor: component.color || '#2f81f7', animation: 'spin 1s linear infinite' }} />
        );

      // ── Layout containers — render children recursively ──────
      case 'section':
      case 'container':
      case 'flex':
      case 'grid':
      case 'card':
      case 'navbar':
      case 'sidebar':
      case 'footer':
      case 'menu': {
        const children = component.children || [];
        return (
          <div className="layout-inner" style={{ position: 'relative', width: '100%', height: '100%', minHeight: '60px' }}>
            {children.length === 0
              ? <div className="layout-empty">Drop components inside</div>
              : children.map((child) => (
                  <ChildComponent key={child.id} child={child} selectComponent={selectComponent} />
                ))
            }
          </div>
        );
      }

      default:
        return <div style={{ width: '100%', height: '100%' }}>{component.text || type}</div>;
    }
  };

  // ── Drop into layout containers ──────────────────────────────
  const handleDrop = (e) => {
    if (!LAYOUT_TYPES.has(component.type)) return;
    const json = e.dataTransfer.getData('application/json');
    if (!json) return;
    e.preventDefault();
    e.stopPropagation();
    try {
      const child = JSON.parse(json);
      const bounds = dragRef.current.getBoundingClientRect();
      child.position = 'absolute';
      child.left = `${Math.max(0, e.clientX - bounds.left)}px`;
      child.top  = `${Math.max(0, e.clientY - bounds.top)}px`;
      addComponent(child, component.id);
    } catch (err) { console.error('Drop failed', err); }
  };

  return (
    <div
      ref={dragRef}
      className={`draggable-component ${isSelected ? 'selected' : ''}`}
      style={style}
      onPointerDown={handlePointerDown}
      onClick={(e) => { e.stopPropagation(); onSelect(); }}
      onDrop={handleDrop}
      onDragOver={(e) => { if (LAYOUT_TYPES.has(component.type)) e.preventDefault(); }}
    >
      {renderContent()}

      {isSelected && (
        <>
          <div className="selection-outline" />
          <button
            className="delete-btn"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); deleteComponent(component.id); }}
            title="Delete"
          >✕</button>

          {HANDLES.map(({ dir, cursor }) => (
            <div
              key={dir}
              className={`resize-handle rh-${dir}`}
              style={{ cursor }}
              data-resize={dir}
              onPointerDown={handleResizeStart(dir)}
            />
          ))}
        </>
      )}
    </div>
  );
}
