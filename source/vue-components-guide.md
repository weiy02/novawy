---
title: Markdown Vue 组件写作指南
layout: post
---

## 快速用法

在文章中使用如下语法：

```md
&#123;% vue AlertBox %&#125;
{
  "type": "success",
  "title": "发布成功",
  "text": "这是一个 Vue 组件渲染的提示框。"
}
&#123;% endvue %&#125;
```

也可以写成单行（更快）：

```md
&#123;% vue BadgeText text=Vue组件 color=#7c3aed %&#125;&#123;% endvue %&#125;
```

## 实际渲染示例

{% vue AlertBox %}
{
  "type": "info",
  "title": "这是实时渲染",
  "text": "如果你看到了这个提示框，说明 Markdown -> Vue 组件链路已经生效。"
}
{% endvue %}

{% vue BadgeText %}
{
  "text": "Vue组件已启用",
  "color": "#16a34a"
}
{% endvue %}

## 内置组件

### 1) AlertBox

Props:
- `type`: `info | success | warning | danger`
- `title`: 标题
- `text`: 内容

### 2) BadgeText

Props:
- `text`: 文本
- `color`: 文字颜色

### 3) CodeSwitchCard

支持 Python / C++ / Java 三语言切换、高亮、复制。

最便捷写法（推荐）：

```md
&#123;% vue CodeSwitchCard %&#125;
[python]
print("Hello from Python")
[/python]

[cpp]
#include <iostream>
using namespace std;
int main() {
  cout << "Hello from C++" << endl;
  return 0;
}
[/cpp]

[java]
public class Main {
  public static void main(String[] args) {
    System.out.println("Hello from Java");
  }
}
[/java]
&#123;% endvue %&#125;
```

## 说明

- 组件脚本位置：`themes/my-awesome-theme/source/js/md-vue-components.js`
- 你可以继续在该文件中新增组件，然后在 Markdown 里直接用 `&#123;% vue 组件名 %&#125;` 调用。

## CodeSwitchCard 实际效果

{% vue CodeSwitchCard %}
[python]
def add(a, b):
    return a + b

print(add(1, 2))
[/python]

[cpp]
#include <iostream>
using namespace std;

int add(int a, int b) {
  return a + b;
}

int main() {
  cout << add(1, 2) << endl;
  return 0;
}
[/cpp]

[java]
public class Main {
  static int add(int a, int b) {
    return a + b;
  }

  public static void main(String[] args) {
    System.out.println(add(1, 2));
  }
}
[/java]
{% endvue %}
