import { useBuilderStore } from '../store/builderStore';
import './BuilderToolbar.css';

export default function BuilderToolbar({ onToggleLeftSidebar, onToggleRightSidebar, centerTab, onTabChange }) {
  const { zoom, setZoom, theme, setTheme, undo, redo, canUndo, canRedo } = useBuilderStore();

  return (
    <div className="builder-toolbar">
      <div className="toolbar-left">
        <button className="toolbar-btn" onClick={onToggleLeftSidebar} title="Toggle sidebar">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path d="M1 2.75A.75.75 0 0 1 1.75 2h12.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 2.75Zm0 5A.75.75 0 0 1 1.75 7h12.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 7.75ZM1.75 12h12.5a.75.75 0 0 1 0 1.5H1.75a.75.75 0 0 1 0-1.5Z"/>
          </svg>
        </button>
        <div className="toolbar-divider" />
        <div className="toolbar-brand">
          <div className="toolbar-logo">V</div>
          <span className="toolbar-label">Vibe Editor</span>
        </div>
      </div>

      <div className="toolbar-center">
        <div className="tab-switcher">
          <button
            className={`tab-switch-btn ${centerTab === 'canvas' ? 'active' : ''}`}
            onClick={() => onTabChange('canvas')}
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
              <rect x="1" y="1" width="14" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5"/>
              <rect x="4" y="4" width="3" height="3" rx="0.5"/>
              <rect x="9" y="4" width="3" height="3" rx="0.5"/>
              <rect x="4" y="9" width="3" height="3" rx="0.5"/>
              <rect x="9" y="9" width="3" height="3" rx="0.5"/>
            </svg>
            Canvas
          </button>
          <button
            className={`tab-switch-btn ${centerTab === 'code' ? 'active' : ''}`}
            onClick={() => onTabChange('code')}
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
              <path d="M4.72 3.22a.75.75 0 0 1 1.06 1.06L2.06 8l3.72 3.72a.75.75 0 1 1-1.06 1.06L.47 8.53a.75.75 0 0 1 0-1.06l4.25-4.25Zm6.56 0a.75.75 0 0 0-1.06 1.06L13.94 8l-3.72 3.72a.75.75 0 1 0 1.06 1.06l4.25-4.25a.75.75 0 0 0 0-1.06l-4.25-4.25Z"/>
            </svg>
            Code
          </button>
        </div>
        <div className="toolbar-divider" />
        <button
          className="toolbar-btn"
          title="Undo (Ctrl+Z)"
          onClick={undo}
          disabled={!canUndo()}
        >
          <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
            <path d="M1.22 6.28a.75.75 0 0 0 1.06 0l3.5-3.5a.75.75 0 0 0-1.06-1.06L2.5 3.94V2.75a.75.75 0 0 0-1.5 0v3.5c0 .199.079.39.22.53ZM2.5 6.25V5.06l1.22 1.22H2.5ZM13.78 9.72a.75.75 0 0 0-1.06 0l-3.5 3.5a.75.75 0 1 0 1.06 1.06l2.22-2.22v1.19a.75.75 0 0 0 1.5 0v-3.5a.75.75 0 0 0-.22-.53Z"/>
            <path d="M3.25 9A5.75 5.75 0 0 1 9 3.25h.25a.75.75 0 0 1 0 1.5H9A4.25 4.25 0 0 0 4.75 9v.25a.75.75 0 0 1-1.5 0V9Z"/>
          </svg>
          Undo
        </button>
        <button
          className="toolbar-btn"
          title="Redo (Ctrl+Shift+Z)"
          onClick={redo}
          disabled={!canRedo()}
        >
          <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
            <path d="M14.78 6.28a.75.75 0 0 1-1.06 0l-3.5-3.5a.75.75 0 0 1 1.06-1.06L13.5 3.94V2.75a.75.75 0 0 1 1.5 0v3.5a.75.75 0 0 1-.22.53ZM13.5 6.25V5.06l-1.22 1.22h1.22ZM2.22 9.72a.75.75 0 0 1 1.06 0l3.5 3.5a.75.75 0 1 1-1.06 1.06L3.5 12.06v1.19a.75.75 0 0 1-1.5 0v-3.5c0-.199.079-.39.22-.53Z"/>
            <path d="M12.75 9A5.75 5.75 0 0 0 7 3.25h-.25a.75.75 0 0 0 0 1.5H7A4.25 4.25 0 0 1 11.25 9v.25a.75.75 0 0 0 1.5 0V9Z"/>
          </svg>
          Redo
        </button>
        <div className="toolbar-divider" />
        <div className="zoom-control">
          <button className="toolbar-btn" onClick={() => setZoom(Math.max(25, zoom - 10))} title="Zoom out">−</button>
          <span className="zoom-value">{zoom}%</span>
          <button className="toolbar-btn" onClick={() => setZoom(Math.min(200, zoom + 10))} title="Zoom in">+</button>
        </div>
        <button className="toolbar-btn" onClick={() => setZoom(100)} title="Reset zoom" style={{ fontSize: '11px' }}>
          Reset
        </button>
      </div>

      <div className="toolbar-right">
        <button
          className="toolbar-btn"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          title="Toggle theme"
        >
          {theme === 'dark'
            ? <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor"><path d="M8 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm0-1.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM8 .75a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-1.5 0v-1A.75.75 0 0 1 8 .75Zm0 12a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-1.5 0v-1A.75.75 0 0 1 8 12.75ZM.75 8a.75.75 0 0 1 .75-.75h1a.75.75 0 0 1 0 1.5h-1A.75.75 0 0 1 .75 8Zm12 0a.75.75 0 0 1 .75-.75h1a.75.75 0 0 1 0 1.5h-1A.75.75 0 0 1 12.75 8Z"/></svg>
            : <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor"><path d="M9.598 1.591a.749.749 0 0 1 .785-.175 7 7 0 1 1-8.967 8.967.75.75 0 0 1 .961-.96 5.5 5.5 0 0 0 7.046-7.046.75.75 0 0 1 .175-.786Z"/></svg>
          }
        </button>
        <div className="toolbar-divider" />
        <button
          className="toolbar-btn"
          onClick={onToggleRightSidebar}
          title="Toggle properties"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path d="M6.5 1A1.5 1.5 0 0 0 5 2.5V3H1.75a.75.75 0 0 0 0 1.5H5v.5a1.5 1.5 0 0 0 3 0V3h6.25a.75.75 0 0 0 0-1.5H8v-.5A1.5 1.5 0 0 0 6.5 1ZM6 2.5a.5.5 0 0 1 1 0v2a.5.5 0 0 1-1 0v-2ZM11 8a1.5 1.5 0 0 0-1.5 1.5v.5H1.75a.75.75 0 0 0 0 1.5H9.5v.5a1.5 1.5 0 0 0 3 0V9.5h1.75a.75.75 0 0 0 0-1.5H12.5V8A1.5 1.5 0 0 0 11 8Zm-.5 1.5a.5.5 0 0 1 1 0v2a.5.5 0 0 1-1 0v-2Z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
