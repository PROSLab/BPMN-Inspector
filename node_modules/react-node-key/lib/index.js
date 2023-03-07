'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _run = _interopDefault(require('szfe-tools/lib/run'));
var react = require('react');
var _isFunction = _interopDefault(require('szfe-tools/lib/isFunction'));
var _isString = _interopDefault(require('szfe-tools/lib/isString'));
var _get = _interopDefault(require('szfe-tools/lib/get'));

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();

  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
        result;

    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function getKey2Id() {
  var uuid = 0;
  var map = new Map(); // 对每种 NodeType 做编号处理

  return function key2Id(key) {
    var id = map.get(key);

    if (!id) {
      id = (++uuid).toString(32);
      map.set(key, id);
    }

    return id;
  };
}

var isArrReg = /^iAr/; // 对每种 NodeType 做编号处理

var key2Id = getKey2Id(); // 获取节点的渲染路径，作为节点的 X 坐标

var genRenderPath = function genRenderPath(node) {
  return node["return"] ? [node].concat(_toConsumableArray(genRenderPath(node["return"]))) : [node];
}; // 使用节点 _nk 属性或下标与其 key/index 作为 Y 坐标


var getNodeId = function getNodeId(fiberNode) {
  // FIXME: 使用 index 作为 Y 坐标是十分不可靠的行为，待想出更好的法子替代
  var id = _get(fiberNode, 'key') || fiberNode.index;

  var nodeKey = _get(fiberNode, 'memoizedProps._nk') || _get(fiberNode, 'pendingProps._nk');

  var isArray = _isString(nodeKey) && isArrReg.test(nodeKey);
  return isArray ? "".concat(nodeKey, ".").concat(id) : nodeKey || id;
};

var markNode = function markNode(node) {
  var x = key2Id(_get(node, 'type.$$typeof', node.type));
  var y = getNodeId(node);
  return "".concat(x, ",").concat(y);
}; // 根据 X,Y 坐标生成 Key


var getKeyByCoord = function getKeyByCoord(nodes, handleNode) {
  return nodes.map(function (node) {
    var mark = markNode(node);
    return _isFunction(handleNode) ? _run(handleNode, undefined, node, mark) : mark;
  }).filter(Boolean).join('|');
};

var getKeyByFiberNode = function getKeyByFiberNode(fiberNode, handleNode) {
  var key = getKeyByCoord(genRenderPath(fiberNode), handleNode);
  return key2Id(key);
};

var isArrReg$1 = /^iAr/; // 对每种 NodeType 做编号处理

var key2Id$1 = getKey2Id(); // 获取节点的渲染路径，作为节点的 X 坐标

var genRenderPath$1 = function genRenderPath(node) {
  return node.__ ? [node].concat(_toConsumableArray(genRenderPath(node.__))) : [node];
}; // 使用节点 _nk 属性或下标与其 key/index 作为 Y 坐标


var getNodeId$1 = function getNodeId(node) {
  // FIXME: Preact 无 index 属性，无 key 与 _nk 之下 Y 坐标不可靠，待修正
  var id = _get(node, 'key') || node.index;

  var nodeKey = _get(node, 'props._nk');

  var isArray = _isString(nodeKey) && isArrReg$1.test(nodeKey);
  return isArray ? "".concat(nodeKey, ".").concat(id) : nodeKey || id;
};

var markNode$1 = function markNode(node) {
  var x = key2Id$1(node.type);
  var y = getNodeId$1(node);
  return "".concat(x, ",").concat(y);
}; // 根据 X,Y 坐标生成 Key


var getKeyByCoord$1 = function getKeyByCoord(nodes, handleNode) {
  return nodes.map(function (node) {
    var mark = markNode$1(node);
    return _isFunction(handleNode) ? _run(handleNode, undefined, node, mark) : mark;
  }).filter(Boolean).join('|');
};

var getKeyByNode = function getKeyByNode(node, handleNode) {
  var key = getKeyByCoord$1(genRenderPath$1(node), handleNode);
  return key2Id$1(key);
};

var type; // 根据 FiberNode 所处位置来确定 nodeKey

var NodeKey = /*#__PURE__*/function (_Component) {
  _inherits(NodeKey, _Component);

  var _super = _createSuper(NodeKey);

  function NodeKey() {
    var _this;

    _classCallCheck(this, NodeKey);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "key", null);

    _defineProperty(_assertThisInitialized(_this), "genKey", function (onHandleNode) {
      if (!type) {
        // _reactInternals 为 React v17 fiberNode 节点字段
        if (_this._reactInternalFiber || _this._reactInternals) {
          type = 'React';
        } // TODO: May "preact/compat" mode only, not verified yet.


        if (_this.__v) {
          type = 'Preact';
        }
      }

      switch (type) {
        case 'Preact':
          {
            _this.key = getKeyByNode(_this.__v, onHandleNode);
            break;
          }

        case 'React':
          {
            var fiberNode = _this._reactInternalFiber || _this._reactInternals;
            _this.key = getKeyByFiberNode(fiberNode, onHandleNode);
            break;
          }
      }

      return _this.key;
    });

    return _this;
  }

  _createClass(NodeKey, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          manualKey = _this$props.manualKey,
          children = _this$props.children,
          prefix = _this$props.prefix,
          onHandleNode = _this$props.onHandleNode;
      return _run(children, undefined, "".concat(prefix).concat((this.key || this.genKey(onHandleNode))));
    }
  }]);

  return NodeKey;
}(react.Component);

_defineProperty(NodeKey, "defaultProps", {
  onHandleNode: undefined,
  manualKey: undefined,
  prefix: ''
});

exports.default = NodeKey;
//# sourceMappingURL=index.js.map
