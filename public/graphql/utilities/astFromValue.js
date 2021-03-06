
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.astFromValue = astFromValue;

var _jsutilsInvariant = require('../jsutils/invariant');

var _jsutilsInvariant2 = _interopRequireDefault(_jsutilsInvariant);

var _jsutilsIsNullish = require('../jsutils/isNullish');

var _jsutilsIsNullish2 = _interopRequireDefault(_jsutilsIsNullish);

var _languageKinds = require('../language/kinds');

var _typeDefinition = require('../type/definition');

var _typeScalars = require('../type/scalars');

/**
 * Produces a GraphQL Value AST given a JavaScript value.
 *
 * Optionally, a GraphQL type may be provided, which will be used to
 * disambiguate between value primitives.
 *
 * | JSON Value    | GraphQL Value        |
 * | ------------- | -------------------- |
 * | Object        | Input Object         |
 * | Array         | List                 |
 * | Boolean       | Boolean              |
 * | String        | String / Enum Value  |
 * | Number        | Int / Float          |
 *
 */

function astFromValue(_x, _x2) {
  var _again = true;

  _function: while (_again) {
    var value = _x,
        type = _x2;
    itemType = stringNum = isIntValue = fields = undefined;
    _again = false;

    if (type instanceof _typeDefinition.GraphQLNonNull) {
      // Note: we're not checking that the result is non-null.
      // This function is not responsible for validating the input value.
      _x = value;
      _x2 = type.ofType;
      _again = true;
      continue _function;
    }

    if ((0, _jsutilsIsNullish2['default'])(value)) {
      return null;
    }

    // Convert JavaScript array to GraphQL list. If the GraphQLType is a list, but
    // the value is not an array, convert the value using the list's item type.
    if (Array.isArray(value)) {
      var itemType = type instanceof _typeDefinition.GraphQLList ? type.ofType : null;
      return {
        kind: _languageKinds.LIST,
        values: value.map(function (item) {
          return astFromValue(item, itemType);
        })
      };
    } else if (type instanceof _typeDefinition.GraphQLList) {
      // Because GraphQL will accept single values as a "list of one" when
      // expecting a list, if there's a non-array value and an expected list type,
      // create an AST using the list's item type.
      _x = value;
      _x2 = type.ofType;
      _again = true;
      continue _function;
    }

    if (typeof value === 'boolean') {
      return { kind: _languageKinds.BOOLEAN, value: value };
    }

    // JavaScript numbers can be Float or Int values. Use the GraphQLType to
    // differentiate if available, otherwise prefer Int if the value is a
    // valid Int.
    if (typeof value === 'number') {
      var stringNum = String(value);
      var isIntValue = /^[0-9]+$/.test(stringNum);
      if (isIntValue) {
        if (type === _typeScalars.GraphQLFloat) {
          return { kind: _languageKinds.FLOAT, value: stringNum + '.0' };
        }
        return { kind: _languageKinds.INT, value: stringNum };
      }
      return { kind: _languageKinds.FLOAT, value: stringNum };
    }

    // JavaScript strings can be Enum values or String values. Use the
    // GraphQLType to differentiate if possible.
    if (typeof value === 'string') {
      if (type instanceof _typeDefinition.GraphQLEnumType && /^[_a-zA-Z][_a-zA-Z0-9]*$/.test(value)) {
        return { kind: _languageKinds.ENUM, value: value };
      }
      // Use JSON stringify, which uses the same string encoding as GraphQL,
      // then remove the quotes.
      return { kind: _languageKinds.STRING, value: JSON.stringify(value).slice(1, -1) };
    }

    // last remaining possible typeof
    (0, _jsutilsInvariant2['default'])(typeof value === 'object');

    // Populate the fields of the input object by creating ASTs from each value
    // in the JavaScript object.
    var fields = [];
    _Object$keys(value).forEach(function (fieldName) {
      var fieldType;
      if (type instanceof _typeDefinition.GraphQLInputObjectType) {
        var fieldDef = type.getFields()[fieldName];
        fieldType = fieldDef && fieldDef.type;
      }
      var fieldValue = astFromValue(value[fieldName], fieldType);
      if (fieldValue) {
        fields.push({
          kind: _languageKinds.OBJECT_FIELD,
          name: { kind: _languageKinds.NAME, value: fieldName },
          value: fieldValue
        });
      }
    });
    return { kind: _languageKinds.OBJECT, fields: fields };
  }
}