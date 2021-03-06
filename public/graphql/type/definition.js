
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

// Predicates

/**
 * These are all of the possible kinds of types.
 */
'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _extends = require('babel-runtime/helpers/extends')['default'];

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var _Map = require('babel-runtime/core-js/map')['default'];

var _Object$create = require('babel-runtime/core-js/object/create')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.isType = isType;

/**
 * These types may be used as input types for arguments and directives.
 */
exports.isInputType = isInputType;

/**
 * These types may be used as output types as the result of fields.
 */
exports.isOutputType = isOutputType;

/**
 * These types may describe types which may be leaf values.
 */
exports.isLeafType = isLeafType;

/**
 * These types may describe the parent context of a selection set.
 */
exports.isCompositeType = isCompositeType;

/**
 * These types may describe the parent context of a selection set.
 */
exports.isAbstractType = isAbstractType;

/**
 * These types can all accept null as a value.
 */
exports.getNullableType = getNullableType;

/**
 * These named types do not include modifiers like List or NonNull.
 */
exports.getNamedType = getNamedType;

var _jsutilsInvariant = require('../jsutils/invariant');

var _jsutilsInvariant2 = _interopRequireDefault(_jsutilsInvariant);

var _jsutilsIsNullish = require('../jsutils/isNullish');

var _jsutilsIsNullish2 = _interopRequireDefault(_jsutilsIsNullish);

var _jsutilsKeyMap = require('../jsutils/keyMap');

var _jsutilsKeyMap2 = _interopRequireDefault(_jsutilsKeyMap);

var _languageKinds = require('../language/kinds');

function isType(type) {
  return type instanceof GraphQLScalarType || type instanceof GraphQLObjectType || type instanceof GraphQLInterfaceType || type instanceof GraphQLUnionType || type instanceof GraphQLEnumType || type instanceof GraphQLInputObjectType || type instanceof GraphQLList || type instanceof GraphQLNonNull;
}

function isInputType(type) {
  var namedType = getNamedType(type);
  return namedType instanceof GraphQLScalarType || namedType instanceof GraphQLEnumType || namedType instanceof GraphQLInputObjectType;
}

function isOutputType(type) {
  var namedType = getNamedType(type);
  return namedType instanceof GraphQLScalarType || namedType instanceof GraphQLObjectType || namedType instanceof GraphQLInterfaceType || namedType instanceof GraphQLUnionType || namedType instanceof GraphQLEnumType;
}

function isLeafType(type) {
  var namedType = getNamedType(type);
  return namedType instanceof GraphQLScalarType || namedType instanceof GraphQLEnumType;
}

function isCompositeType(type) {
  return type instanceof GraphQLObjectType || type instanceof GraphQLInterfaceType || type instanceof GraphQLUnionType;
}

function isAbstractType(type) {
  return type instanceof GraphQLInterfaceType || type instanceof GraphQLUnionType;
}

function getNullableType(type) {
  return type instanceof GraphQLNonNull ? type.ofType : type;
}

function getNamedType(type) {
  var unmodifiedType = type;
  while (unmodifiedType instanceof GraphQLList || unmodifiedType instanceof GraphQLNonNull) {
    unmodifiedType = unmodifiedType.ofType;
  }
  return unmodifiedType;
}

/**
 * Scalar Type Definition
 *
 * The leaf values of any request and input values to arguments are
 * Scalars (or Enums) and are defined with a name and a series of functions
 * used to parse input from ast or variables and to ensure validity.
 *
 * Example:
 *
 *     var OddType = new GraphQLScalarType({
 *       name: 'Odd',
 *       serialize(value) {
 *         return value % 2 === 1 ? value : null;
 *       }
 *     });
 *
 */

var GraphQLScalarType /* <T> */ = (function () {
  /* <T> */
  function GraphQLScalarType(config /* <T> */) {
    _classCallCheck(this, GraphQLScalarType);

    (0, _jsutilsInvariant2['default'])(config.name, 'Type must be named.');
    assertValidName(config.name);
    this.name = config.name;
    this.description = config.description;
    (0, _jsutilsInvariant2['default'])(typeof config.serialize === 'function', this + ' must provide "serialize" function. If this custom Scalar is ' + 'also used as an input type, ensure "parseValue" and "parseLiteral" ' + 'functions are also provided.');
    if (config.parseValue || config.parseLiteral) {
      (0, _jsutilsInvariant2['default'])(typeof config.parseValue === 'function' && typeof config.parseLiteral === 'function', this + ' must provide both "parseValue" and "parseLiteral" functions.');
    }
    this._scalarConfig = config;
  }

  _createClass(GraphQLScalarType, [{
    key: 'serialize',
    value: function serialize(value) /* T */{
      var serializer = this._scalarConfig.serialize;
      return serializer(value);
    }
  }, {
    key: 'parseValue',
    value: function parseValue(value) /* T */{
      var parser = this._scalarConfig.parseValue;
      return parser ? parser(value) : null;
    }
  }, {
    key: 'parseLiteral',
    value: function parseLiteral(valueAST) /* T */{
      var parser = this._scalarConfig.parseLiteral;
      return parser ? parser(valueAST) : null;
    }
  }, {
    key: 'toString',
    value: function toString() {
      return this.name;
    }
  }]);

  return GraphQLScalarType;
})();

exports.GraphQLScalarType = GraphQLScalarType;
/* T */

/**
 * Object Type Definition
 *
 * Almost all of the GraphQL types you define will be object types. Object types
 * have a name, but most importantly describe their fields.
 *
 * Example:
 *
 *     var AddressType = new GraphQLObjectType({
 *       name: 'Address',
 *       fields: {
 *         street: { type: GraphQLString },
 *         number: { type: GraphQLInt },
 *         formatted: {
 *           type: GraphQLString,
 *           resolve(obj) {
 *             return obj.number + ' ' + obj.street
 *           }
 *         }
 *       }
 *     });
 *
 * When two types need to refer to each other, or a type needs to refer to
 * itself in a field, you can use a function expression (aka a closure or a
 * thunk) to supply the fields lazily.
 *
 * Example:
 *
 *     var PersonType = new GraphQLObjectType({
 *       name: 'Person',
 *       fields: () => ({
 *         name: { type: GraphQLString },
 *         bestFriend: { type: PersonType },
 *       })
 *     });
 *
 */

var GraphQLObjectType = (function () {
  function GraphQLObjectType(config) {
    _classCallCheck(this, GraphQLObjectType);

    (0, _jsutilsInvariant2['default'])(config.name, 'Type must be named.');
    assertValidName(config.name);
    this.name = config.name;
    this.description = config.description;
    if (config.isTypeOf) {
      (0, _jsutilsInvariant2['default'])(typeof config.isTypeOf === 'function', this + ' must provide "isTypeOf" as a function.');
    }
    this.isTypeOf = config.isTypeOf;
    this._typeConfig = config;
    addImplementationToInterfaces(this);
  }

  _createClass(GraphQLObjectType, [{
    key: 'getFields',
    value: function getFields() {
      return this._fields || (this._fields = defineFieldMap(this, this._typeConfig.fields));
    }
  }, {
    key: 'getInterfaces',
    value: function getInterfaces() {
      return this._interfaces || (this._interfaces = defineInterfaces(this, this._typeConfig.interfaces));
    }
  }, {
    key: 'toString',
    value: function toString() {
      return this.name;
    }
  }]);

  return GraphQLObjectType;
})();

exports.GraphQLObjectType = GraphQLObjectType;

function resolveMaybeThunk(thingOrThunk) {
  return typeof thingOrThunk === 'function' ? thingOrThunk() : thingOrThunk;
}

function defineInterfaces(type, interfacesOrThunk) {
  var interfaces = resolveMaybeThunk(interfacesOrThunk);
  if (!interfaces) {
    return [];
  }
  (0, _jsutilsInvariant2['default'])(Array.isArray(interfaces), type + ' interfaces must be an Array or a function which returns an Array.');
  interfaces.forEach(function (iface) {
    (0, _jsutilsInvariant2['default'])(iface instanceof GraphQLInterfaceType, type + ' may only implement Interface types, it cannot ' + ('implement: ' + iface + '.'));
    if (typeof iface.resolveType !== 'function') {
      (0, _jsutilsInvariant2['default'])(typeof type.isTypeOf === 'function', 'Interface Type ' + iface + ' does not provide a "resolveType" function ' + ('and implementing Type ' + type + ' does not provide a "isTypeOf" ') + 'function. There is no way to resolve this implementing type ' + 'during execution.');
    }
  });
  return interfaces;
}

function defineFieldMap(type, fields) {
  var fieldMap = resolveMaybeThunk(fields);
  (0, _jsutilsInvariant2['default'])(isPlainObj(fieldMap), type + ' fields must be an object with field names as keys or a ' + 'function which returns such an object.');

  var fieldNames = _Object$keys(fieldMap);
  (0, _jsutilsInvariant2['default'])(fieldNames.length > 0, type + ' fields must be an object with field names as keys or a ' + 'function which returns such an object.');

  var resultFieldMap = {};
  fieldNames.forEach(function (fieldName) {
    assertValidName(fieldName);
    var field = _extends({}, fieldMap[fieldName], {
      name: fieldName
    });
    (0, _jsutilsInvariant2['default'])(!field.hasOwnProperty('isDeprecated'), type + '.' + fieldName + ' should provide "deprecationReason" instead ' + 'of "isDeprecated".');
    (0, _jsutilsInvariant2['default'])(isOutputType(field.type), type + '.' + fieldName + ' field type must be Output Type but ' + ('got: ' + field.type + '.'));
    if (!field.args) {
      field.args = [];
    } else {
      (0, _jsutilsInvariant2['default'])(isPlainObj(field.args), type + '.' + fieldName + ' args must be an object with argument names ' + 'as keys.');
      field.args = _Object$keys(field.args).map(function (argName) {
        assertValidName(argName);
        var arg = field.args[argName];
        (0, _jsutilsInvariant2['default'])(isInputType(arg.type), type + '.' + fieldName + '(' + argName + ':) argument type must be ' + ('Input Type but got: ' + arg.type + '.'));
        return {
          name: argName,
          description: arg.description === undefined ? null : arg.description,
          type: arg.type,
          defaultValue: arg.defaultValue === undefined ? null : arg.defaultValue
        };
      });
    }
    resultFieldMap[fieldName] = field;
  });
  return resultFieldMap;
}

function isPlainObj(obj) {
  return obj && typeof obj === 'object' && !Array.isArray(obj);
}

/**
 * Update the interfaces to know about this implementation.
 * This is an rare and unfortunate use of mutation in the type definition
 * implementations, but avoids an expensive "getPossibleTypes"
 * implementation for Interface types.
 */
function addImplementationToInterfaces(impl) {
  impl.getInterfaces().forEach(function (type) {
    type._implementations.push(impl);
  });
}

/**
 * Interface Type Definition
 *
 * When a field can return one of a heterogeneous set of types, a Interface type
 * is used to describe what types are possible, what fields are in common across
 * all types, as well as a function to determine which type is actually used
 * when the field is resolved.
 *
 * Example:
 *
 *     var EntityType = new GraphQLInterfaceType({
 *       name: 'Entity',
 *       fields: {
 *         name: { type: GraphQLString }
 *       }
 *     });
 *
 */

var GraphQLInterfaceType = (function () {
  function GraphQLInterfaceType(config) {
    _classCallCheck(this, GraphQLInterfaceType);

    (0, _jsutilsInvariant2['default'])(config.name, 'Type must be named.');
    assertValidName(config.name);
    this.name = config.name;
    this.description = config.description;
    if (config.resolveType) {
      (0, _jsutilsInvariant2['default'])(typeof config.resolveType === 'function', this + ' must provide "resolveType" as a function.');
    }
    this.resolveType = config.resolveType;
    this._typeConfig = config;
    this._implementations = [];
  }

  _createClass(GraphQLInterfaceType, [{
    key: 'getFields',
    value: function getFields() {
      return this._fields || (this._fields = defineFieldMap(this, this._typeConfig.fields));
    }
  }, {
    key: 'getPossibleTypes',
    value: function getPossibleTypes() {
      return this._implementations;
    }
  }, {
    key: 'isPossibleType',
    value: function isPossibleType(type) {
      var possibleTypes = this._possibleTypes || (this._possibleTypes = (0, _jsutilsKeyMap2['default'])(this.getPossibleTypes(), function (possibleType) {
        return possibleType.name;
      }));
      return Boolean(possibleTypes[type.name]);
    }
  }, {
    key: 'getObjectType',
    value: function getObjectType(value, info) {
      var resolver = this.resolveType;
      return resolver ? resolver(value, info) : getTypeOf(value, info, this);
    }
  }, {
    key: 'toString',
    value: function toString() {
      return this.name;
    }
  }]);

  return GraphQLInterfaceType;
})();

exports.GraphQLInterfaceType = GraphQLInterfaceType;

function getTypeOf(value, info, abstractType) {
  var possibleTypes = abstractType.getPossibleTypes();
  for (var i = 0; i < possibleTypes.length; i++) {
    var type = possibleTypes[i];
    if (typeof type.isTypeOf === 'function' && type.isTypeOf(value, info)) {
      return type;
    }
  }
}

/**
 * Union Type Definition
 *
 * When a field can return one of a heterogeneous set of types, a Union type
 * is used to describe what types are possible as well as providing a function
 * to determine which type is actually used when the field is resolved.
 *
 * Example:
 *
 *     var PetType = new GraphQLUnionType({
 *       name: 'Pet',
 *       types: [ DogType, CatType ],
 *       resolveType(value) {
 *         if (value instanceof Dog) {
 *           return DogType;
 *         }
 *         if (value instanceof Cat) {
 *           return CatType;
 *         }
 *       }
 *     });
 *
 */

var GraphQLUnionType = (function () {
  function GraphQLUnionType(config) {
    var _this = this;

    _classCallCheck(this, GraphQLUnionType);

    (0, _jsutilsInvariant2['default'])(config.name, 'Type must be named.');
    assertValidName(config.name);
    this.name = config.name;
    this.description = config.description;
    if (config.resolveType) {
      (0, _jsutilsInvariant2['default'])(typeof config.resolveType === 'function', this + ' must provide "resolveType" as a function.');
    }
    this.resolveType = config.resolveType;
    (0, _jsutilsInvariant2['default'])(Array.isArray(config.types) && config.types.length > 0, 'Must provide Array of types for Union ' + config.name + '.');
    config.types.forEach(function (type) {
      (0, _jsutilsInvariant2['default'])(type instanceof GraphQLObjectType, _this + ' may only contain Object types, it cannot contain: ' + type + '.');
      if (typeof _this.resolveType !== 'function') {
        (0, _jsutilsInvariant2['default'])(typeof type.isTypeOf === 'function', 'Union Type ' + _this + ' does not provide a "resolveType" function ' + ('and possible Type ' + type + ' does not provide a "isTypeOf" ') + 'function. There is no way to resolve this possible type ' + 'during execution.');
      }
    });
    this._types = config.types;
    this._typeConfig = config;
  }

  _createClass(GraphQLUnionType, [{
    key: 'getPossibleTypes',
    value: function getPossibleTypes() {
      return this._types;
    }
  }, {
    key: 'isPossibleType',
    value: function isPossibleType(type) {
      var possibleTypeNames = this._possibleTypeNames;
      if (!possibleTypeNames) {
        this._possibleTypeNames = possibleTypeNames = this.getPossibleTypes().reduce(function (map, possibleType) {
          return (map[possibleType.name] = true, map);
        }, {});
      }
      return possibleTypeNames[type.name] === true;
    }
  }, {
    key: 'getObjectType',
    value: function getObjectType(value, info) {
      var resolver = this._typeConfig.resolveType;
      return resolver ? resolver(value, info) : getTypeOf(value, info, this);
    }
  }, {
    key: 'toString',
    value: function toString() {
      return this.name;
    }
  }]);

  return GraphQLUnionType;
})();

exports.GraphQLUnionType = GraphQLUnionType;

/**
 * Enum Type Definition
 *
 * Some leaf values of requests and input values are Enums. GraphQL serializes
 * Enum values as strings, however internally Enums can be represented by any
 * kind of type, often integers.
 *
 * Example:
 *
 *     var RGBType = new GraphQLEnumType({
 *       name: 'RGB',
 *       values: {
 *         RED: { value: 0 },
 *         GREEN: { value: 1 },
 *         BLUE: { value: 2 }
 *       }
 *     });
 *
 * Note: If a value is not provided in a definition, the name of the enum value
 * will be used as its internal value.
 */

var GraphQLEnumType /* <T> */ = (function () {
  function GraphQLEnumType(config /* <T> */) {
    _classCallCheck(this, GraphQLEnumType);

    this.name = config.name;
    assertValidName(config.name);
    this.description = config.description;
    this._values = defineEnumValues(this, config.values);
    this._enumConfig = config;
  }

  _createClass(GraphQLEnumType, [{
    key: 'getValues',
    value: function getValues() /* <T> */{
      return this._values;
    }
  }, {
    key: 'serialize',
    value: function serialize(value /* T */) {
      var enumValue = this._getValueLookup().get(value);
      return enumValue ? enumValue.name : null;
    }
  }, {
    key: 'parseValue',
    value: function parseValue(value) /* T */{
      var enumValue = this._getNameLookup()[value];
      if (enumValue) {
        return enumValue.value;
      }
    }
  }, {
    key: 'parseLiteral',
    value: function parseLiteral(valueAST) /* T */{
      if (valueAST.kind === _languageKinds.ENUM) {
        var enumValue = this._getNameLookup()[valueAST.value];
        if (enumValue) {
          return enumValue.value;
        }
      }
    }
  }, {
    key: '_getValueLookup',
    value: function _getValueLookup() {
      if (!this._valueLookup) {
        var lookup = new _Map();
        this.getValues().forEach(function (value) {
          lookup.set(value.value, value);
        });
        this._valueLookup = lookup;
      }
      return this._valueLookup;
    }
  }, {
    key: '_getNameLookup',
    value: function _getNameLookup() {
      if (!this._nameLookup) {
        var lookup = _Object$create(null);
        this.getValues().forEach(function (value) {
          lookup[value.name] = value;
        });
        this._nameLookup = lookup;
      }
      return this._nameLookup;
    }
  }, {
    key: 'toString',
    value: function toString() {
      return this.name;
    }
  }]);

  return GraphQLEnumType;
})();

exports.GraphQLEnumType = GraphQLEnumType;

function defineEnumValues(type, valueMap /* <T> */
) /* <T> */{
  (0, _jsutilsInvariant2['default'])(isPlainObj(valueMap), type + ' values must be an object with value names as keys.');
  var valueNames = _Object$keys(valueMap);
  (0, _jsutilsInvariant2['default'])(valueNames.length > 0, type + ' values must be an object with value names as keys.');
  return valueNames.map(function (valueName) {
    assertValidName(valueName);
    var value = valueMap[valueName];
    (0, _jsutilsInvariant2['default'])(isPlainObj(value), type + '.' + valueName + ' must refer to an object with a "value" key ' + ('representing an internal value but got: ' + value + '.'));
    (0, _jsutilsInvariant2['default'])(!value.hasOwnProperty('isDeprecated'), type + '.' + valueName + ' should provide "deprecationReason" instead ' + 'of "isDeprecated".');
    return {
      name: valueName,
      description: value.description,
      deprecationReason: value.deprecationReason,
      value: (0, _jsutilsIsNullish2['default'])(value.value) ? valueName : value.value
    };
  });
}

/* <T> */ /* T */

/**
 * Input Object Type Definition
 *
 * An input object defines a structured collection of fields which may be
 * supplied to a field argument.
 *
 * Using `NonNull` will ensure that a value must be provided by the query
 *
 * Example:
 *
 *     var GeoPoint = new GraphQLInputObjectType({
 *       name: 'GeoPoint',
 *       fields: {
 *         lat: { type: new GraphQLNonNull(GraphQLFloat) },
 *         lon: { type: new GraphQLNonNull(GraphQLFloat) },
 *         alt: { type: GraphQLFloat, defaultValue: 0 },
 *       }
 *     });
 *
 */

var GraphQLInputObjectType = (function () {
  function GraphQLInputObjectType(config) {
    _classCallCheck(this, GraphQLInputObjectType);

    (0, _jsutilsInvariant2['default'])(config.name, 'Type must be named.');
    assertValidName(config.name);
    this.name = config.name;
    this.description = config.description;
    this._typeConfig = config;
  }

  _createClass(GraphQLInputObjectType, [{
    key: 'getFields',
    value: function getFields() {
      return this._fields || (this._fields = this._defineFieldMap());
    }
  }, {
    key: '_defineFieldMap',
    value: function _defineFieldMap() {
      var _this2 = this;

      var fieldMap = resolveMaybeThunk(this._typeConfig.fields);
      (0, _jsutilsInvariant2['default'])(isPlainObj(fieldMap), this + ' fields must be an object with field names as keys or a ' + 'function which returns such an object.');
      var fieldNames = _Object$keys(fieldMap);
      (0, _jsutilsInvariant2['default'])(fieldNames.length > 0, this + ' fields must be an object with field names as keys or a ' + 'function which returns such an object.');
      var resultFieldMap = {};
      fieldNames.forEach(function (fieldName) {
        assertValidName(fieldName);
        var field = _extends({}, fieldMap[fieldName], {
          name: fieldName
        });
        (0, _jsutilsInvariant2['default'])(isInputType(field.type), _this2 + '.' + fieldName + ' field type must be Input Type but ' + ('got: ' + field.type + '.'));
        resultFieldMap[fieldName] = field;
      });
      return resultFieldMap;
    }
  }, {
    key: 'toString',
    value: function toString() {
      return this.name;
    }
  }]);

  return GraphQLInputObjectType;
})();

exports.GraphQLInputObjectType = GraphQLInputObjectType;

/**
 * List Modifier
 *
 * A list is a kind of type marker, a wrapping type which points to another
 * type. Lists are often created within the context of defining the fields of
 * an object type.
 *
 * Example:
 *
 *     var PersonType = new GraphQLObjectType({
 *       name: 'Person',
 *       fields: () => ({
 *         parents: { type: new GraphQLList(Person) },
 *         children: { type: new GraphQLList(Person) },
 *       })
 *     })
 *
 */

var GraphQLList = (function () {
  function GraphQLList(type) {
    _classCallCheck(this, GraphQLList);

    (0, _jsutilsInvariant2['default'])(isType(type), 'Can only create List of a GraphQLType but got: ' + type + '.');
    this.ofType = type;
  }

  /**
   * Non-Null Modifier
   *
   * A non-null is a kind of type marker, a wrapping type which points to another
   * type. Non-null types enforce that their values are never null and can ensure
   * an error is raised if this ever occurs during a request. It is useful for
   * fields which you can make a strong guarantee on non-nullability, for example
   * usually the id field of a database row will never be null.
   *
   * Example:
   *
   *     var RowType = new GraphQLObjectType({
   *       name: 'Row',
   *       fields: () => ({
   *         id: { type: new GraphQLNonNull(GraphQLString) },
   *       })
   *     })
   *
   * Note: the enforcement of non-nullability occurs within the executor.
   */

  _createClass(GraphQLList, [{
    key: 'toString',
    value: function toString() {
      return '[' + String(this.ofType) + ']';
    }
  }]);

  return GraphQLList;
})();

exports.GraphQLList = GraphQLList;

var GraphQLNonNull = (function () {
  function GraphQLNonNull(type) {
    _classCallCheck(this, GraphQLNonNull);

    (0, _jsutilsInvariant2['default'])(isType(type) && !(type instanceof GraphQLNonNull), 'Can only create NonNull of a Nullable GraphQLType but got: ' + type + '.');
    this.ofType = type;
  }

  _createClass(GraphQLNonNull, [{
    key: 'toString',
    value: function toString() {
      return this.ofType.toString() + '!';
    }
  }]);

  return GraphQLNonNull;
})();

exports.GraphQLNonNull = GraphQLNonNull;

var NAME_RX = /^[_a-zA-Z][_a-zA-Z0-9]*$/;

// Helper to assert that provided names are valid.
function assertValidName(name) {
  (0, _jsutilsInvariant2['default'])(NAME_RX.test(name), 'Names must match /^[_a-zA-Z][_a-zA-Z0-9]*$/ but "' + name + '" does not.');
}
/* <T> */ /* T */ /* T */
/**
 * Optionally provide a custom type resolver function. If one is not provided,
 * the default implementation will call `isTypeOf` on each implementing
 * Object type.
 */

/**
 * Optionally provide a custom type resolver function. If one is not provided,
 * the default implementation will call `isTypeOf` on each implementing
 * Object type.
 */
/* <T> */ /* <T> */ /* T */ /* T */ /* <T> */ /* <T> */ /* <T> */ /* <T> */ /* T */ /* <T> */