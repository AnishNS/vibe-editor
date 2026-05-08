import { useState, useRef, useCallback } from 'react';
import { useBuilderStore } from '../store/builderStore';
import Canvas from './Canvas';
import ComponentSidebar from './ComponentSidebar';
import PropertiesPanel from './PropertiesPanel';
import CodeEditor from './CodeEditor';
import BuilderToolbar from './BuilderToolbar';
import './BuilderLayout.css';

export default function BuilderLayout() {
  const { leftSidebarOpen, rightSidebarOpen, toggleLeftSidebar, toggleRightSidebar } = useBuilderStore();
  const [centerTab, setCenterTab] = useState('canvas'); // 'canvas' | 'code'
  const [rightWidth, setRightWidth] = useState(240);
  const resizing = useRef(false);

  const startResize = useCallback((e) => {
    e.preventDefault();
    resizing.current = true;
    const startX = e.clientX;
    const startW = rightWidth;

    const onMove = (me) => {
      if (!resizing.current) return;
      const delta = startX - me.clientX;
      setRightWidth(Math.min(400, Math.max(180, startW + delta)));
    };
    const onUp = () => {
      resizing.current = false;
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }, [rightWidth]);

  return (
    <div className="builder-layout">
      <BuilderToolbar
        onToggleLeftSidebar={toggleLeftSidebar}
        onToggleRightSidebar={toggleRightSidebar}
        centerTab={centerTab}
        onTabChange={setCenterTab}
      />

      <div className="builder-content">
        {leftSidebarOpen && <ComponentSidebar />}

        <main className="builder-center">
          {centerTab === 'canvas' && <Canvas />}
          {centerTab === 'code'   && <CodeEditor />}
        </main>

        {rightSidebarOpen && (
          <>
            <div className="resize-divider" onPointerDown={startResize} />
            <div style={{ width: rightWidth, minWidth: rightWidth, flexShrink: 0 }}>
              <PropertiesPanel />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
