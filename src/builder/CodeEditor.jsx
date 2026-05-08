import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useBuilderStore } from '../store/builderStore';
import { generateHTML, generateCSS, generateJS } from './codeGenerator';
import './CodeEditor.css';

export default function CodeEditor() {
  const components = useBuilderStore((state) => state.components);
  const setComponents = useBuilderStore((state) => state.setComponents);
  const setCustomCode = useBuilderStore((state) => state.setCustomCode);
  const customCode = useBuilderStore((state) => state.customCode);

  const [activeTab, setActiveTab] = useState('schema');
  const [schemaText, setSchemaText] = useState(JSON.stringify(components, null, 2));
  const [validationError, setValidationError] = useState(null);
  const [isSchemaEditing, setIsSchemaEditing] = useState(false);

  const [htmlText, setHtmlText] = useState('');
  const [cssText, setCssText] = useState('');
  const [jsText, setJsText] = useState('');

  // Sync generated code into local state when components change (and user isn't editing)
  useEffect(() => {
    if (!isSchemaEditing) {
      setSchemaText(JSON.stringify(components, null, 2));
    }
  }, [components, isSchemaEditing]);

  useEffect(() => {
    if (!customCode) {
      setHtmlText(generateHTML(components));
      setCssText(generateCSS(components));
      setJsText(generateJS());
      setIsCodeEditing(false);
    }
  }, [components, customCode]);

  // Schema editing — debounce parse and sync to store
  useEffect(() => {
    if (!isSchemaEditing) return undefined;

    const timeout = setTimeout(() => {
      try {
        const parsed = JSON.parse(schemaText);
        if (!Array.isArray(parsed)) {
          setValidationError('Schema must be a top-level array of component objects.');
          return;
        }
        setComponents(parsed);
        setValidationError(null);
      } catch (error) {
        setValidationError(error.message);
      }
    }, 600);

    return () => clearTimeout(timeout);
  }, [schemaText, isSchemaEditing, setComponents]);

  const [isCodeEditing, setIsCodeEditing] = useState(false);

  // Sync HTML/CSS/JS edits to store only when user actually edits (debounced)
  useEffect(() => {
    if (!isCodeEditing) return undefined;
    const timeout = setTimeout(() => {
      setCustomCode({ html: htmlText, css: cssText, js: jsText });
    }, 400);
    return () => clearTimeout(timeout);
  }, [htmlText, cssText, jsText, isCodeEditing, setCustomCode]);

  const code = {
    schema: schemaText,
    html: htmlText,
    css: cssText,
    js: jsText,
  };

  const handleChange = (value) => {
    if (activeTab === 'schema') {
      setSchemaText(value || '[]');
      setIsSchemaEditing(true);
    } else if (activeTab === 'html') {
      setHtmlText(value || '');
      setIsCodeEditing(true);
    } else if (activeTab === 'css') {
      setCssText(value || '');
      setIsCodeEditing(true);
    } else if (activeTab === 'js') {
      setJsText(value || '');
      setIsCodeEditing(true);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code[activeTab] || '');
  };

  const handleDownload = () => {
    const content = code[activeTab] || '';
    const ext = activeTab === 'schema' ? 'json' : activeTab;
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `vibe-code.${ext}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const langMap = { schema: 'json', html: 'html', css: 'css', js: 'javascript' };

  return (
    <div className="code-editor">
      <div className="editor-header">
        <div className="editor-tabs">
          {['schema', 'html', 'css', 'js'].map((tab) => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="editor-actions">
          <button className="action-btn" onClick={handleCopyCode}>📋 Copy</button>
          <button className="action-btn" onClick={handleDownload}>📥 Download</button>
        </div>
      </div>

      <div className="editor-content">
        <Editor
          language={langMap[activeTab]}
          value={code[activeTab]}
          theme="vs-dark"
          onChange={handleChange}
          onBlur={() => activeTab === 'schema' && setIsSchemaEditing(false)}
          options={{
            minimap: { enabled: false },
            fontSize: 12,
            lineHeight: 20,
            wordWrap: 'on',
            readOnly: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            fontFamily: '"Cascadia Code", "Fira Code", Menlo, Monaco, Consolas, monospace',
            fontLigatures: true,
            renderLineHighlight: 'line',
            padding: { top: 8, bottom: 8 },
            lineNumbers: 'on',
            glyphMargin: false,
            folding: true,
            tabSize: 2,
          }}
        />
      </div>

      {activeTab === 'schema' && validationError && (
        <div className="schema-error">JSON error: {validationError}</div>
      )}
    </div>
  );
}
