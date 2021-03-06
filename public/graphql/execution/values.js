
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

/**
 * Prepares an object map of variableValues of the correct type based on the
 * provided variable definitions and arbitrary input. If the input cannot be
 * parsed to match the variable definitions, a GraphQLError will be thrown.
 */
'use strict';

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.getVariableValues = getVariableValues;
exports.getArgumentValues = getArgumentValues;

var _error = require('../error');

var _jsutilsInvariant = require('../jsutils/invariant');

var _jsutilsInvariant2 = _interopRequireDefault(_jsutilsInvariant);

var _jsutilsIsNullish = require('../jsutils/isNullish');

var _jsutilsIsNullish2 = _interopRequireDefault(_jsutilsIsNullish);

var _jsutilsKeyMap = require('../jsutils/keyMap');

var _jsutilsKeyMap2 = _interopRequireDefault(_jsutilsKeyMap);

var _utilitiesTypeFromAST = require('../utilities/typeFromAST');

var _utilitiesValueFromAST = require('../utilities/valueFromAST');

var _utilitiesIsValidJSValue = require('../utilities/isValidJSValue');

var _languagePrinter = require('../language/printer');

var _typeDefinition = require('../type/definition');

function getVariableValues(schema, definitionASTs, inputs) {
  return definitionASTs.reduce(function (values, defAST) {
    var varName = defAST.variable.name.value;
    values[varName] = getVariableValue(schema, defAST, inputs[varName]);
    return values;
  }, {});
}

/**
 * Prepares an object map of argument values given a list of argument
 * definitions and list of argument AST nodes.
 */

function getArgumentValues(argDefs, argASTs, variableValues) {
  if (!argDefs || !argASTs) {
    return {};
  }
  var argASTMap = (0, _jsutilsKeyMap2['default'])(argASTs, function (arg) {
    return arg.name.value;
  });
  return argDefs.reduce(function (result, argDef) {
    var name = argDef.name;
    var valueAST = argASTMap[name] ? argASTMap[name].value : null;
    var value = (0, _utilitiesValueFromAST.valueFromAST)(valueAST, argDef.type, variableValues);
    if ((0, _jsutilsIsNullish2['default'])(value)) {
      value = argDef.defaultValue;
    }
    if (!(0, _jsutilsIsNullish2['default'])(value)) {
      result[name] = value;
    }
    return result;
  }, {});
}

/**
 * Given a variable definition, and any value of input, return a value which
 * adheres to the variable definition, or throw an error.
 */
function getVariableValue(schema, definitionAST, input) {
  var type = (0, _utilitiesTypeFromAST.typeFromAST)(schema, definitionAST.type);
  var variable = definitionAST.variable;
  if (!type || !(0, _typeDefinition.isInputType)(type)) {
    throw new _error.GraphQLError('Variable "$' + variable.name.value + '" expected value of type ' + ('"' + (0, _languagePrinter.print)(definitionAST.type) + '" which cannot be used as an input type.'), [definitionAST]);
  }
  var inputType = type;
  var errors = (0, _utilitiesIsValidJSValue.isValidJSValue)(input, inputType);
  if (!errors.length) {
    if ((0, _jsutilsIsNullish2['default'])(input)) {
      var defaultValue = definitionAST.defaultValue;
      if (defaultValue) {
        return (0, _utilitiesValueFromAST.valueFromAST)(defaultValue, inputType);
      }
    }
    return coerceValue(inputType, input);
  }
  if ((0, _jsutilsIsNullish2['default'])(input)) {
    throw new _error.GraphQLError('Variable "$' + variable.name.value + '" of required type ' + ('"' + (0, _languagePrinter.print)(definitionAST.type) + '" was not provided.'), [definitionAST]);
  }
  var message = errors ? '\n' + errors.join('\n') : '';
  throw new _error.GraphQLError('Variable "$' + variable.name.value + '" got invalid value ' + (JSON.stringify(input) + '.' + message), [definitionAST]);
}

/**
 * Given a type and any value, return a runtime value coerced to match the type.
 */
function coerceValue(_x, _x2) {
  var _again = true;

  _function: while (_again) {
    var type = _x,
        value = _x2;
    nullableType = itemType = fields = parsed = undefined;
    _again = false;

    if (type instanceof _typeDefinition.GraphQLNonNull) {
      // Note: we're not checking that the result of coerceValue is non-null.

      var nullableType = type.ofType;
      _x = nullableType;
      _x2 = value;
      _again = true;
      continue _function;
    }

    if ((0, _jsutilsIsNullish2['default'])(value)) {
      return null;
    }

    if (type instanceof _typeDefinition.GraphQLList) {
      var itemType = type.ofType;
      // TODO: support iterable input
      if (Array.isArray(value)) {
        return value.map(function (item) {
          return coerceValue(itemType, item);
        });
      }
      return [coerceValue(itemType, value)];
    }

    if (type instanceof _typeDefinition.GraphQLInputObjectType) {
      var fields = type.getFields();
      return _Object$keys(fields).reduce(function (obj, fieldName) {
        var field = fields[fieldName];
        var fieldValue = coerceValue(field.type, value[fieldName]);
        if ((0, _jsutilsIsNullish2['default'])(fieldValue)) {
          fieldValue = field.defaultValue;
        }
        if (!(0, _jsutilsIsNullish2['default'])(fieldValue)) {
          obj[fieldName] = fieldValue;
        }
        return obj;
      }, {});
    }

    (0, _jsutilsInvariant2['default'])(type instanceof _typeDefinition.GraphQLScalarType || type instanceof _typeDefinition.GraphQLEnumType, 'Must be input type');

    var parsed = type.parseValue(value);
    if (!(0, _jsutilsIsNullish2['default'])(parsed)) {
      return parsed;
    }
  }
}
// We only call this function after calling isValidJSValue.