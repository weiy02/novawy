(function() {
  const colorMap = {
    info: '#2563eb',
    success: '#16a34a',
    warning: '#d97706',
    danger: '#dc2626'
  };

  function escapeHtml(code) {
    return String(code)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function parseCodeFromTaggedText(rawText) {
    const text = String(rawText || '');
    const get = function(lang) {
      const reg = new RegExp('\\\\[' + lang + '\\\\]([\\\\s\\\\S]*?)\\\\[\\\\/' + lang + '\\\\]', 'i');
      const matched = text.match(reg);
      return matched ? matched[1].replace(/^\n+|\n+$/g, '') : '';
    };

    return {
      python: get('python'),
      cpp: get('cpp'),
      java: get('java')
    };
  }

  function highlightCode(code, language) {
    const prismLangMap = {
      python: 'python',
      cpp: 'cpp',
      java: 'java'
    };
    const lang = prismLangMap[language] || 'clike';
    if (window.Prism && window.Prism.languages) {
      const grammar = window.Prism.languages[lang]
        || (lang === 'cpp' ? window.Prism.languages.c : null)
        || window.Prism.languages.clike;
      if (grammar) {
        return window.Prism.highlight(String(code || ''), grammar, lang);
      }
    }
    return escapeHtml(code || '');
  }

  function copyText(text) {
    const value = String(text || '');
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(value);
    }

    return new Promise(function(resolve, reject) {
      try {
        const input = document.createElement('textarea');
        input.value = value;
        input.style.position = 'fixed';
        input.style.opacity = '0';
        document.body.appendChild(input);
        input.focus();
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  window.MDVueComponents = {
    AlertBox: {
      props: {
        type: { type: String, default: 'info' },
        title: { type: String, default: '提示' },
        text: { type: String, default: '' }
      },
      computed: {
        barColor() {
          return colorMap[this.type] || colorMap.info;
        }
      },
      template: `
        <div style="margin:12px 0;padding:10px 12px;border:1px solid var(--line);border-left:4px solid" :style="{ borderLeftColor: barColor, background: 'var(--surface)', borderRadius: '8px' }">
          <strong>{{ title }}</strong>
          <div style="margin-top:6px;line-height:1.7;">{{ text }}</div>
        </div>
      `
    },

    BadgeText: {
      props: {
        text: { type: String, default: '标签' },
        color: { type: String, default: '#2563eb' }
      },
      template: `
        <span :style="{ display:'inline-block', padding:'2px 8px', borderRadius:'999px', border:'1px solid var(--line)', color: color, background:'var(--surface)', fontSize:'0.85rem' }">{{ text }}</span>
      `
    },

    CodeSwitchCard: {
      props: {
        title: { type: String, default: '多语言代码示例' },
        defaultLang: { type: String, default: 'python' },
        python: { type: String, default: '' },
        cpp: { type: String, default: '' },
        java: { type: String, default: '' },
        text: { type: String, default: '' }
      },
      data() {
        return {
          activeLang: this.defaultLang,
          hovering: false,
          copied: false
        };
      },
      computed: {
        codes() {
          const parsed = parseCodeFromTaggedText(this.text);
          return {
            python: this.python || parsed.python || 'print("Hello, World!")',
            cpp: this.cpp || parsed.cpp || '#include <iostream>\nusing namespace std;\n\nint main() {\n  cout << "Hello, World!" << endl;\n  return 0;\n}',
            java: this.java || parsed.java || 'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, World!");\n  }\n}'
          };
        },
        tabs() {
          return [
            { key: 'python', label: 'Python' },
            { key: 'cpp', label: 'C++' },
            { key: 'java', label: 'Java' }
          ];
        },
        currentCode() {
          return this.codes[this.activeLang] || '';
        },
        highlightedCode() {
          return highlightCode(this.currentCode, this.activeLang);
        },
        lineNumbers() {
          const count = Math.max(1, String(this.currentCode || '').split('\n').length);
          return Array.from({ length: count }, function(_, index) {
            return index + 1;
          });
        }
      },
      methods: {
        selectLang(lang) {
          this.activeLang = lang;
          this.copied = false;
        },
        copyCurrentCode() {
          const self = this;
          copyText(this.currentCode).then(function() {
            self.copied = true;
            setTimeout(function() {
              self.copied = false;
            }, 1500);
          });
        },
        handleCardClick(event) {
          const target = event.target;
          if (target.closest('.md-code-switch-tab') || target.closest('.md-code-switch-copy')) {
            return;
          }
          this.copyCurrentCode();
        }
      },
      mounted() {
        if (!this.codes[this.activeLang]) {
          this.activeLang = 'python';
        }
      },
      template: `
        <section class="md-code-switch-card" @mouseenter="hovering = true" @mouseleave="hovering = false" @click="handleCardClick">
          <header class="md-code-switch-header">
            <div class="md-code-switch-title">{{ title }}</div>
            <button
              class="md-code-switch-copy"
              type="button"
              @click.stop="copyCurrentCode"
              :style="{ opacity: hovering ? 1 : 0, pointerEvents: hovering ? 'auto' : 'none' }"
            >{{ copied ? '已复制' : '复制' }}</button>
          </header>

          <div class="md-code-switch-tabs">
            <button
              v-for="tab in tabs"
              :key="tab.key"
              type="button"
              class="md-code-switch-tab"
              :class="{ active: activeLang === tab.key }"
              @click.stop="selectLang(tab.key)"
            >{{ tab.label }}</button>
          </div>

          <div class="md-code-switch-body">
            <div class="md-code-switch-gutter" aria-hidden="true">
              <span v-for="line in lineNumbers" :key="line" class="md-code-switch-line-no">{{ line }}</span>
            </div>
            <pre class="md-code-switch-pre" :class="'language-' + activeLang"><code class="md-code-switch-code" v-html="highlightedCode"></code></pre>
          </div>
        </section>
      `
    }
  };
})();
