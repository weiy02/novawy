(function() {
  function parseProps(raw) {
    if (!raw) return {};
    try {
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (e) {
      return {};
    }
  }

  function mountAllMarkdownVueComponents() {
    if (!window.Vue || !window.MDVueComponents) return;

    const roots = document.querySelectorAll('.md-vue-root');
    roots.forEach(function(el) {
      if (el.dataset.mounted === '1') return;

      const componentName = (el.dataset.component || '').trim();
      const component = window.MDVueComponents[componentName];
      if (!component) {
        el.innerHTML = '<div style="padding:8px 10px;border:1px dashed var(--line);border-radius:8px;color:var(--muted);">未找到组件：' + componentName + '</div>';
        return;
      }

      const props = parseProps(el.dataset.props || '{}');
      window.Vue.createApp(component, props).mount(el);
      el.dataset.mounted = '1';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountAllMarkdownVueComponents);
  } else {
    mountAllMarkdownVueComponents();
  }
})();
