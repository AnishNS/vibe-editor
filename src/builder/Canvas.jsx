import { useRef, useState } from 'react';
import { useBuilderStore } from '../store/builderStore';
import { componentRegistry } from '../registry/componentRegistry';
import { DraggableComponent } from './DraggableComponent';
import './Canvas.css';

export default function Canvas() {
  const { components, selectedComponentId, selectComponent, zoom, addComponent, customCode, clearCustomCode } = useBuilderStore();
  const [draggedOver, setDraggedOver] = useState(false);
  const canvasRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDraggedOver(true);
  };

  const handleDragLeave = (e) => {
    if (!canvasRef.current?.contains(e.relatedTarget)) {
      setDraggedOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDraggedOver(false);

    const componentData = e.dataTransfer.getData('application/json');
    if (!componentData) return;

    try {
      const data = JSON.parse(componentData);
      
      // Find component in registry
      const categoryComponents = componentRegistry[data.category];
      if (!categoryComponents) {
        console.error('Category not found:', data.category);
        return;
      }

      const componentDef = categoryComponents.find(c => c.id === data.id);
      if (!componentDef) {
        console.error('Component not found:', data.id);
        return;
      }

      const rect = canvasRef.current.getBoundingClientRect();
      const scale = zoom / 100;
      // Correct for zoom scale so drop lands where cursor is
      const x = Math.max(0, (e.clientX - rect.left) / scale);
      const y = Math.max(0, (e.clientY - rect.top) / scale);

      // Create component object with registry data
      const component = {
        id: `${data.id}-${Date.now()}`,
        type: data.id,
        name: data.name,
        category: data.category,
        component: componentDef.component,
        props: { ...componentDef.defaultProps },
        position: 'absolute',
        left: `${Math.round(x)}px`,
        top: `${Math.round(y)}px`,
      };

      addComponent(component);
    } catch (err) {
      console.error('Drop failed:', err);
    }
  };

  const handleCanvasClick = (e) => {
    if (e.target === e.currentTarget) selectComponent(null);
  };

  return (
    <div className="canvas-panel">
      <div className="canvas-bar">
        <div className="canvas-bar-left">
          <span className="canvas-bar-title">Canvas</span>
          {!customCode && (
            <span className="canvas-bar-hint">Drag components to place them</span>
          )}
        </div>
        {customCode && (
          <button className="canvas-back-btn" onClick={clearCustomCode}>
            ← Back to Canvas
          </button>
        )}
        {!customCode && (
          <span className="canvas-component-count">
            {components.length} {components.length === 1 ? 'element' : 'elements'}
          </span>
        )}
      </div>

      <div className="canvas-viewport">
        {customCode ? (
          <iframe
            title="canvas-preview"
            className="canvas-iframe"
            srcDoc={`<!DOCTYPE html><html><head><style>${customCode.css}</style></head><body>${
              customCode.html.includes('<body')
                ? customCode.html.replace(/[\s\S]*<body[^>]*>([\s\S]*)<\/body>[\s\S]*/i, '$1')
                : customCode.html
            }<script>${customCode.js}<\/script></body></html>`}
          />
        ) : (
          <div
            ref={canvasRef}
            className={`canvas-surface ${draggedOver ? 'drag-over' : ''}`}
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleCanvasClick}
          >
            {components.length === 0 ? (
              <div className="canvas-empty">
                <div className="canvas-empty-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <path d="M12 8v8M8 12h8"/>
                  </svg>
                </div>
                <p className="canvas-empty-title">Drop components here</p>
                <p className="canvas-empty-sub">Drag any component from the left panel to get started</p>
              </div>
            ) : (
              components.map((component) => (
                <DraggableComponent
                  key={component.id}
                  component={component}
                  isSelected={selectedComponentId === component.id}
                  onSelect={() => selectComponent(component.id)}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
