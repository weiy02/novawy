/* global hexo */

function escapeAttr(input) {
  return String(input)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function safeJsonParse(text) {
  if (!text) return {};
  try {
    const parsed = JSON.parse(text);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (e) {
    const compact = String(text).trim();
    if (compact.startsWith('{') && compact.endsWith('}')) {
      const body = compact.slice(1, -1).trim();
      if (!body) return {};

      const result = {};
      body.split(',').forEach(function(pair) {
        const index = pair.indexOf(':');
        if (index < 0) return;
        const key = pair.slice(0, index).trim().replace(/^['"]|['"]$/g, '');
        const value = pair.slice(index + 1).trim().replace(/^['"]|['"]$/g, '');
        if (key) result[key] = value;
      });
      if (Object.keys(result).length) return result;
    }

    return { text: compact };
  }
}

function parseInlineProps(args) {
  if (!args || !args.length) return {};

  const keyValueProps = {};
  let hasKeyValue = false;

  args.forEach(function(token) {
    const index = token.indexOf('=');
    if (index > 0) {
      hasKeyValue = true;
      const key = token.slice(0, index).trim();
      const value = token.slice(index + 1).trim().replace(/^['"]|['"]$/g, '');
      if (key) keyValueProps[key] = value;
    }
  });

  if (hasKeyValue) return keyValueProps;
  return safeJsonParse(args.join(' ').trim());
}

hexo.extend.tag.register(
  'vue',
  function(args, content) {
    const componentName = (args[0] || '').trim();
    if (!componentName) {
      return '<!-- vue tag error: missing component name -->';
    }

    const blockPropsText = (content || '').trim();
    const props = blockPropsText
      ? safeJsonParse(blockPropsText)
      : parseInlineProps(args.slice(1));

    return '<div class="md-vue-root" data-component="' +
      escapeAttr(componentName) +
      '" data-props="' +
      escapeAttr(JSON.stringify(props)) +
      '"></div>';
  },
  { ends: true }
);
