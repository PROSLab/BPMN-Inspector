# React Node Key

[![size](https://img.shields.io/bundlephobia/minzip/react-node-key.svg)](https://github.com/CJY0208/react-node-key)
[![dm](https://img.shields.io/npm/dm/react-node-key.svg)](https://github.com/CJY0208/react-node-key)

English | [中文说明](./README_CN.md)

Automatic key-marked for React nodes, generate an unique identifier by render location

---

## Compatibility

- React v16+

- Preact v10+

---

## Install

```bash
yarn add react-node-key
# or
npm install react-node-key
```

---

## Usage

#### 1. Add `react-node-key/babel` plugins in `.babelrc`

[Why is it needed?](https://github.com/CJY0208/react-activation/issues/18#issuecomment-564360695)

The plugin adds a `_nk` attribute to each JSX element during compilation to help the `react-node-key` runtime **generate an unique identifier by render location**.

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
