import { create } from 'zustand';

const getSystemTheme = () => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const createComponentId = () => `cmp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const normalizeComponent = (component) => {
  const normalized = {
    ...component,
    id: component.id || createComponentId(),
    position: component.position || 'absolute',
    children: Array.isArray(component.children)
      ? component.children.map(normalizeComponent)
      : [],
  };

  return normalized;
};

const updateComponentById = (components, id, updater) => {
  return components.map((component) => {
    if (component.id === id) {
      return updater(component);
    }

    if (component.children && component.children.length > 0) {
      return {
        ...component,
        children: updateComponentById(component.children, id, updater),
      };
    }

    return component;
  });
};

const removeComponentById = (components, id) => {
  return components
    .filter((component) => component.id !== id)
    .map((component) => ({
      ...component,
      children: component.children ? removeComponentById(component.children, id) : [],
    }));
};

const addChildComponent = (components, parentId, child) => {
  return components.map((component) => {
    if (component.id === parentId) {
      return {
        ...component,
        children: [...(component.children || []), normalizeComponent(child)],
      };
    }

    if (component.children && component.children.length > 0) {
      return {
        ...component,
        children: addChildComponent(component.children, parentId, child),
      };
    }

    return component;
  });
};

const pushHistory = (state, newComponents) => {
  const history = state.history.slice(0, state.historyIndex + 1);
  history.push(newComponents);
  return {
    components: newComponents,
    history,
    historyIndex: history.length - 1,
    lastUpdateTime: Date.now(),
  };
};

export const useBuilderStore = create((set, get) => ({
  components: [],
  selectedComponentId: null,
  hoveredComponentId: null,
  history: [[]],
  historyIndex: 0,
  lastUpdateTime: 0,
  theme: getSystemTheme(),
  zoom: 100,
  leftSidebarOpen: true,
  rightSidebarOpen: true,
  customCode: null, // { html, css, js } when user edits code tabs directly

  setCustomCode: (customCode) => set({ customCode }),
  clearCustomCode: () => set({ customCode: null }),

  addComponent: (component, parentId = null) =>
    set((state) => {
      const newComponent = normalizeComponent(component);
      const components = parentId
        ? addChildComponent(state.components, parentId, newComponent)
        : [...state.components, newComponent];

      return pushHistory(state, components);
    }),

  setComponents: (components) =>
    set((state) => {
      const normalized = components.map(normalizeComponent);
      return pushHistory(state, normalized);
    }),

  updateComponent: (id, updates) =>
    set((state) => {
      const newComponents = updateComponentById(state.components, id, (component) => ({
        ...component,
        ...updates,
      }));
      const now = Date.now();
      const timeSinceLastUpdate = now - state.lastUpdateTime;
      let history = state.history;
      let historyIndex = state.historyIndex;

      if (timeSinceLastUpdate > 500) {
        history = state.history.slice(0, state.historyIndex + 1);
        history.push(newComponents);
        historyIndex = history.length - 1;
      }

      return {
        components: newComponents,
        history,
        historyIndex,
        lastUpdateTime: now,
      };
    }),

  deleteComponent: (id) =>
    set((state) => {
      const newComponents = removeComponentById(state.components, id);
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push(newComponents);

      return {
        components: newComponents,
        selectedComponentId: state.selectedComponentId === id ? null : state.selectedComponentId,
        history: newHistory,
        historyIndex: newHistory.length - 1,
        lastUpdateTime: Date.now(),
      };
    }),

  loadTemplate: (templateComponents) =>
    set((state) => {
      const newComponents = templateComponents.map((comp) => normalizeComponent(comp));
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push(newComponents);
      return {
        components: newComponents,
        history: newHistory,
        historyIndex: newHistory.length - 1,
        selectedComponentId: null,
        lastUpdateTime: Date.now(),
      };
    }),

  clearCanvas: () =>
    set((state) => {
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push([]);
      return {
        components: [],
        history: newHistory,
        historyIndex: newHistory.length - 1,
        selectedComponentId: null,
        lastUpdateTime: Date.now(),
      };
    }),

  undo: () =>
    set((state) => {
      if (state.historyIndex > 0) {
        const newIndex = state.historyIndex - 1;
        return {
          components: state.history[newIndex],
          historyIndex: newIndex,
          selectedComponentId: null,
        };
      }
      return state;
    }),

  redo: () =>
    set((state) => {
      if (state.historyIndex < state.history.length - 1) {
        const newIndex = state.historyIndex + 1;
        return {
          components: state.history[newIndex],
          historyIndex: newIndex,
          selectedComponentId: null,
        };
      }
      return state;
    }),

  selectComponent: (id) => set({ selectedComponentId: id }),

  hoverComponent: (id) => set({ hoveredComponentId: id }),

  setTheme: (theme) => set({ theme }),

  setZoom: (zoom) => set({ zoom }),

  toggleLeftSidebar: () => set((state) => ({
    leftSidebarOpen: !state.leftSidebarOpen,
  })),

  toggleRightSidebar: () => set((state) => ({
    rightSidebarOpen: !state.rightSidebarOpen,
  })),

  getSelectedComponent: () => {
    const state = get();
    const find = (items) => {
      for (const item of items) {
        if (item.id === state.selectedComponentId) {
          return item;
        }
        if (item.children) {
          const found = find(item.children);
          if (found) return found;
        }
      }
      return null;
    };

    return find(state.components);
  },

  getComponentTree: () => get().components,

  canUndo: () => get().historyIndex > 0,

  canRedo: () => get().historyIndex < get().history.length - 1,
}));
