import { useState } from 'react';
import { useBuilderStore } from '../store/builderStore';
import { getAllTemplates, getTemplate } from './templates';
import './TemplatesPanel.css';

export default function TemplatesPanel() {
  const { loadTemplate, clearCanvas } = useBuilderStore();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const templates = getAllTemplates();

  const handleLoadTemplate = (templateId) => {
    const template = getTemplate(templateId);
    if (template) {
      clearCanvas();
      setTimeout(() => {
        loadTemplate(template.components);
      }, 100);
      setSelectedTemplate(templateId);
    }
  };

  return (
    <div className="templates-panel">
      <div className="templates-header">
        <h3>Templates</h3>
        <p>Choose a template to get started</p>
      </div>

      <div className="templates-grid">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`template-card ${selectedTemplate === template.id ? 'selected' : ''}`}
            onClick={() => handleLoadTemplate(template.id)}
          >
            <div className="template-icon">{template.icon}</div>
            <div className="template-info">
              <h4>{template.name}</h4>
              <p>{template.description}</p>
            </div>
            <button className="template-btn">Load</button>
          </div>
        ))}
      </div>

      <div className="templates-footer">
        <button
          className="clear-btn"
          onClick={() => {
            clearCanvas();
            setSelectedTemplate(null);
          }}
        >
          Clear Canvas
        </button>
      </div>
    </div>
  );
}
