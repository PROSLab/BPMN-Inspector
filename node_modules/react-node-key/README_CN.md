# React Node Key

[![size](https://img.shields.io/bundlephobia/minzip/react-node-key.svg)](https://github.com/CJY0208/react-node-key)
[![dm](https://img.shields.io/npm/dm/react-node-key.svg)](https://github.com/CJY0208/react-node-key)

[English](./README.md) | 中文说明

自动生成 React 组件 key 值，按渲染位置标记

## 兼容性

- React v16+

- Preact v10+

---

## 安装

```bash
yarn add react-node-key
# 或者
npm install react-node-key
```

---

## 使用方式

#### 1. babel 配置文件 `.babelrc` 中增加 `react-node-key/babel` 插件

[为什么需要它？](https://github.com/CJY0208/react-activation/issues/18#issuecomment-564360695)

该插件会于编译阶段在各 JSX 元素上增加 `_nk` 属性，帮助 `react-node-key` 在运行时**按渲染位置生成唯一的缓存 id 标识**

```javascript
{
  "plugins": [
    "react-node-key/babel"
  ]
}
```

#### 2. Use `<NodeKey>` as your component's wrapper

```javascript
import React from 'react'
import ReactDOM from 'react-dom'
import NodeKey from 'react-node-key'

import Test from './Test'

ReactDOM.render(
  <NodeKey>{nodeKey => <Test key={nodeKey} />}</NodeKey>,
  document.getElementById('root')
)
```
