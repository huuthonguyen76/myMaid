
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

var _Object$create = require('babel-runtime/core-js/object/create')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.undefinedVarMessage = undefinedVarMessage;
exports.NoUndefinedVariables = NoUndefinedVariables;

var _error = require('../../error');

function undefinedVarMessage(varName, opName) {
  return opName ? 'Variable "$' + varName + '" is not defined by operation "' + opName + '".' : 'Variable "$' + varName + '" is not defined.';
}

/**
 * No undefined variables
 *
 * A GraphQL operation is only valid if all variables encountered, both directly
 * and via fragment spreads, are defined by that operation.
 */

function NoUndefinedVariables(context) {
  var variableNameDefined = _Object$create(null);

  return {
    OperationDefinition: {
      enter: function enter() {
        variableNameDefined = _Object$create(null);
      },
      leave: function leave(operation) {
        var usages = context.getRecursiveVariableUsages(operation);

        usages.forEach(function (_ref) {
          var node = _ref.node;

          var varName = node.name.value;
          if (variableNameDefined[varName] !== true) {
            context.reportError(new _error.GraphQLError(undefinedVarMessage(varName, operation.name && operation.name.value), [node, operation]));
          }
        });
      }
    },
    VariableDefinition: function VariableDefinition(varDefAST) {
      variableNameDefined[varDefAST.variable.name.value] = true;
    }
  };
}