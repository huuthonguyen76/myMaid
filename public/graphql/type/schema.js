
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _definition = require('./definition');

var _directives = require('./directives');

var _introspection = require('./introspection');

var _jsutilsFind = require('../jsutils/find');

var _jsutilsFind2 = _interopRequireDefault(_jsutilsFind);

var _jsutilsInvariant = require('../jsutils/invariant');

var _jsutilsInvariant2 = _interopRequireDefault(_jsutilsInvariant);

var _utilitiesTypeComparators = require('../utilities/typeComparators');

/**
 * Schema Definition
 *
 * A Schema is created by supplying the root types of each type of operation,
 * query and mutation (optional). A schema definition is then supplied to the
 * validator and executor.
 *
 * Example:
 *
 *     var MyAppSchema = new GraphQLSchema({
 *       query: MyAppQueryRootType
 *       mutation: MyAppMutationRootType
 *     });
 *
 */

var GraphQLSchema = (function () {
  function GraphQLSchema(config) {
    var _this = this;

    _classCallCheck(this, GraphQLSchema);

    (0, _jsutilsInvariant2['default'])(typeof config === 'object', 'Must provide configuration object.');

    (0, _jsutilsInvariant2['default'])(config.query instanceof _definition.GraphQLObjectType, 'Schema query must be Object Type but got: ' + config.query + '.');
    this._queryType = config.query;

    (0, _jsutilsInvariant2['default'])(!config.mutation || config.mutation instanceof _definition.GraphQLObjectType, 'Schema mutation must be Object Type if provided but ' + ('got: ' + config.mutation + '.'));
    this._mutationType = config.mutation;

    (0, _jsutilsInvariant2['default'])(!config.subscription || config.subscription instanceof _definition.GraphQLObjectType, 'Schema subscription must be Object Type if provided but ' + ('got: ' + config.subscription + '.'));
    this._subscriptionType = config.subscription;

    (0, _jsutilsInvariant2['default'])(!config.directives || Array.isArray(config.directives) && config.directives.every(function (directive) {
      return directive instanceof _directives.GraphQLDirective;
    }), 'Schema directives must be Array<GraphQLDirective> if provided but ' + ('got: ' + config.directives + '.'));
    // Provide `@include() and `@skip()` directives by default.
    this._directives = config.directives || [_directives.GraphQLIncludeDirective, _directives.GraphQLSkipDirective];

    // Build type map now to detect any errors within this schema.
    this._typeMap = [this.getQueryType(), this.getMutationType(), this.getSubscriptionType(), _introspection.__Schema].reduce(typeMapReducer, {});

    // Enforce correct interface implementations
    _Object$keys(this._typeMap).forEach(function (typeName) {
      var type = _this._typeMap[typeName];
      if (type instanceof _definition.GraphQLObjectType) {
        type.getInterfaces().forEach(function (iface) {
          return assertObjectImplementsInterface(type, iface);
        });
      }
    });
  }

  _createClass(GraphQLSchema, [{
    key: 'getQueryType',
    value: function getQueryType() {
      return this._queryType;
    }
  }, {
    key: 'getMutationType',
    value: function getMutationType() {
      return this._mutationType;
    }
  }, {
    key: 'getSubscriptionType',
    value: function getSubscriptionType() {
      return this._subscriptionType;
    }
  }, {
    key: 'getTypeMap',
    value: function getTypeMap() {
      return this._typeMap;
    }
  }, {
    key: 'getType',
    value: function getType(name) {
      return this.getTypeMap()[name];
    }
  }, {
    key: 'getDirectives',
    value: function getDirectives() {
      return this._directives;
    }
  }, {
    key: 'getDirective',
    value: function getDirective(name) {
      return (0, _jsutilsFind2['default'])(this.getDirectives(), function (directive) {
        return directive.name === name;
      });
    }
  }]);

  return GraphQLSchema;
})();

exports.GraphQLSchema = GraphQLSchema;

function typeMapReducer(_x, _x2) {
  var _again = true;

  _function: while (_again) {
    var map = _x,
        type = _x2;
    reducedMap = fieldMap = undefined;
    _again = false;

    if (!type) {
      return map;
    }
    if (type instanceof _definition.GraphQLList || type instanceof _definition.GraphQLNonNull) {
      _x = map;
      _x2 = type.ofType;
      _again = true;
      continue _function;
    }
    if (map[type.name]) {
      (0, _jsutilsInvariant2['default'])(map[type.name] === type, 'Schema must contain unique named types but contains multiple ' + ('types named "' + type + '".'));
      return map;
    }
    map[type.name] = type;

    var reducedMap = map;

    if (type instanceof _definition.GraphQLUnionType || type instanceof _definition.GraphQLInterfaceType) {
      reducedMap = type.getPossibleTypes().reduce(typeMapReducer, reducedMap);
    }

    if (type instanceof _definition.GraphQLObjectType) {
      reducedMap = type.getInterfaces().reduce(typeMapReducer, reducedMap);
    }

    if (type instanceof _definition.GraphQLObjectType || type instanceof _definition.GraphQLInterfaceType || type instanceof _definition.GraphQLInputObjectType) {
      var fieldMap = type.getFields();
      _Object$keys(fieldMap).forEach(function (fieldName) {
        var field = fieldMap[fieldName];

        if (field.args) {
          var fieldArgTypes = field.args.map(function (arg) {
            return arg.type;
          });
          reducedMap = fieldArgTypes.reduce(typeMapReducer, reducedMap);
        }
        reducedMap = typeMapReducer(reducedMap, field.type);
      });
    }

    return reducedMap;
  }
}

function assertObjectImplementsInterface(object, iface) {
  var objectFieldMap = object.getFields();
  var ifaceFieldMap = iface.getFields();

  // Assert each interface field is implemented.
  _Object$keys(ifaceFieldMap).forEach(function (fieldName) {
    var objectField = objectFieldMap[fieldName];
    var ifaceField = ifaceFieldMap[fieldName];

    // Assert interface field exists on object.
    (0, _jsutilsInvariant2['default'])(objectField, '"' + iface + '" expects field "' + fieldName + '" but "' + object + '" does not ' + 'provide it.');

    // Assert interface field type is satisfied by object field type, by being
    // a valid subtype. (covariant)
    (0, _jsutilsInvariant2['default'])((0, _utilitiesTypeComparators.isTypeSubTypeOf)(objectField.type, ifaceField.type), iface + '.' + fieldName + ' expects type "' + ifaceField.type + '" but ' + (object + '.' + fieldName + ' provides type "' + objectField.type + '".'));

    // Assert each interface field arg is implemented.
    ifaceField.args.forEach(function (ifaceArg) {
      var argName = ifaceArg.name;
      var objectArg = (0, _jsutilsFind2['default'])(objectField.args, function (arg) {
        return arg.name === argName;
      });

      // Assert interface field arg exists on object field.
      (0, _jsutilsInvariant2['default'])(objectArg, iface + '.' + fieldName + ' expects argument "' + argName + '" but ' + (object + '.' + fieldName + ' does not provide it.'));

      // Assert interface field arg type matches object field arg type.
      // (invariant)
      (0, _jsutilsInvariant2['default'])((0, _utilitiesTypeComparators.isEqualType)(ifaceArg.type, objectArg.type), iface + '.' + fieldName + '(' + argName + ':) expects type "' + ifaceArg.type + '" ' + ('but ' + object + '.' + fieldName + '(' + argName + ':) provides ') + ('type "' + objectArg.type + '".'));
    });

    // Assert additional arguments must not be required.
    objectField.args.forEach(function (objectArg) {
      var argName = objectArg.name;
      var ifaceArg = (0, _jsutilsFind2['default'])(ifaceField.args, function (arg) {
        return arg.name === argName;
      });
      if (!ifaceArg) {
        (0, _jsutilsInvariant2['default'])(!(objectArg.type instanceof _definition.GraphQLNonNull), object + '.' + fieldName + '(' + argName + ':) is of required type ' + ('"' + objectArg.type + '" but is not also provided by the ') + ('interface ' + iface + '.' + fieldName + '.'));
      }
    });
  });
}