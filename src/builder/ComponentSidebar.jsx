import { useState } from 'react';
import { componentRegistry } from '../registry/componentRegistry';
import ComponentPreview from './ComponentPreview';
import TemplatesPanel from './TemplatesPanel';
import './ComponentSidebar.css';

export default function ComponentSidebar() {
  const [expandedCategory, setExpandedCategory] = useState('buttons');
  const [activeTab, setActiveTab] = useState('components');

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

  const toggleCategory = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  return (
    <div className="component-sidebar">
      <div className="sidebar-tabs">
        <button
          className={`tab-btn ${activeTab === 'components' ? 'active' : ''}`}
          onClick={() => setActiveTab('components')}
        >
          Components
        </button>
        <button
          className={`tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
          onClick={() => setActiveTab('preview')}
        >
          Preview
        </button>
        <button
          className={`tab-btn ${activeTab === 'templates' ? 'active' : ''}`}
          onClick={() => setActiveTab('templates')}
        >
          Templates
        </button>
      </div>

      {activeTab === 'components' && (
        <>
          <div className="sidebar-header">
            <h3>Components</h3>
          </div>

          <div className="categories">
            {Object.entries(componentRegistry).map(([categoryKey, components]) => (
              <div key={categoryKey} className="category">
                <button
                  className="category-header"
                  onClick={() => toggleCategory(categoryKey)}
                >
                  <span className="toggle-icon">
                    {expandedCategory === categoryKey ? '▼' : '▶'}
                  </span>
                  <span className="category-icon">
                    {components[0]?.icon || '📦'}
                  </span>
                  <span className="category-name">
                    {categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1)}
                  </span>
                  <span className="component-count">
                    {components.length}
                  </span>
                </button>

                {expandedCategory === categoryKey && (
                  <div className="components-list">
                    {components.map((component) => (
                      <div
                        key={component.id}
                        className="component-item"
                        draggable
                        onDragStart={(e) => handleDragStart(e, component, categoryKey)}
                        title={`Drag to add ${component.name}`}
                      >
                        <span className="component-icon">{component.icon}</span>
                        <span className="component-name">{component.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'preview' && <ComponentPreview />}
      {activeTab === 'templates' && <TemplatesPanel />}
    </div>
  );
}
