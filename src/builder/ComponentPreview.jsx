import { useState } from 'react';
import { componentRegistry } from '../registry/componentRegistry';
import './ComponentPreview.css';

export default function ComponentPreview() {
  const [selectedCategory, setSelectedCategory] = useState('buttons');
  const [expandedComponent, setExpandedComponent] = useState(null);

  const handleDragStart = (e, component, categoryId) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('application/json', JSON.stringify({
      id: component.id,
      name: component.name,
      category: categoryId,
      component: component.component.name,
      defaultProps: component.defaultProps,
    }));
  };

  const renderComponentPreview = (component) => {
    if (component.component && typeof component.component === 'function') {
      const Component = component.component;
      return (
        <div style={{ padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60px' }}>
          <Component {...component.defaultProps} />
        </div>
      );
    }

    return (
      <div
        style={{
          width: '100%',
          height: '60px',
          backgroundColor: '#f0f0f0',
          border: '1px solid #e0e0e0',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#999',
          fontSize: '12px',
        }}
      >
        {component.name} Preview
      </div>
    );
  };

  const categories = Object.entries(componentRegistry);
  const selectedCategoryData = componentRegistry[selectedCategory] || [];

  return (
    <div className="component-preview-panel">
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div className="preview-header">
        <h3>Component Library</h3>
      </div>

      <div className="preview-categories">
        {categories.map(([key, components]) => (
          <button
            key={key}
            className={`category-btn ${selectedCategory === key ? 'active' : ''}`}
            onClick={() => setSelectedCategory(key)}
          >
            <span className="cat-icon">{components[0]?.icon || '📦'}</span>
            <span className="cat-label">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
          </button>
        ))}
      </div>

      <div className="preview-components">
        {selectedCategoryData.map((component) => (
          <div key={component.id} className="preview-item">
            <div
              className="preview-header-item"
              onClick={() =>
                setExpandedComponent(
                  expandedComponent === component.id ? null : component.id
                )
              }
            >
              <span className="comp-icon">{component.icon}</span>
              <span className="comp-name">{component.name}</span>
              <span className="expand-icon">
                {expandedComponent === component.id ? '▼' : '▶'}
              </span>
            </div>

            {expandedComponent === component.id && (
              <div className="preview-content">
                <div className="preview-description">
                  {component.description}
                </div>
                <div
                  className="preview-render"
                  draggable
                  onDragStart={(e) => handleDragStart(e, component, selectedCategory)}
                  title={`Drag to add ${component.name}`}
                  style={{ cursor: 'grab' }}
                >
                  {renderComponentPreview(component)}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
