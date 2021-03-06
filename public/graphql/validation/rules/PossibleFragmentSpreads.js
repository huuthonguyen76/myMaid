
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.typeIncompatibleSpreadMessage = typeIncompatibleSpreadMessage;
exports.typeIncompatibleAnonSpreadMessage = typeIncompatibleAnonSpreadMessage;
exports.PossibleFragmentSpreads = PossibleFragmentSpreads;

var _error = require('../../error');

var _jsutilsKeyMap = require('../../jsutils/keyMap');

var _jsutilsKeyMap2 = _interopRequireDefault(_jsutilsKeyMap);

var _typeDefinition = require('../../type/definition');

var _utilitiesTypeFromAST = require('../../utilities/typeFromAST');

function typeIncompatibleSpreadMessage(fragName, parentType, fragType) {
  return 'Fragment "' + fragName + '" cannot be spread here as objects of ' + ('type "' + parentType + '" can never be of type "' + fragType + '".');
}

function typeIncompatibleAnonSpreadMessage(parentType, fragType) {
  return 'Fragment cannot be spread here as objects of ' + ('type "' + parentType + '" can never be of type "' + fragType + '".');
}

/**
 * Possible fragment spread
 *
 * A fragment spread is only valid if the type condition could ever possibly
 * be true: if there is a non-empty intersection of the possible parent types,
 * and possible types which pass the type condition.
 */

function PossibleFragmentSpreads(context) {
  return {
    InlineFragment: function InlineFragment(node) {
      var fragType = context.getType();
      var parentType = context.getParentType();
      if (fragType && parentType && !doTypesOverlap(fragType, parentType)) {
        context.reportError(new _error.GraphQLError(typeIncompatibleAnonSpreadMessage(parentType, fragType), [node]));
      }
    },
    FragmentSpread: function FragmentSpread(node) {
      var fragName = node.name.value;
      var fragType = getFragmentType(context, fragName);
      var parentType = context.getParentType();
      if (fragType && parentType && !doTypesOverlap(fragType, parentType)) {
        context.reportError(new _error.GraphQLError(typeIncompatibleSpreadMessage(fragName, parentType, fragType), [node]));
      }
    }
  };
}

function getFragmentType(context, name) {
  var frag = context.getFragment(name);
  return frag && (0, _utilitiesTypeFromAST.typeFromAST)(context.getSchema(), frag.typeCondition);
}

function doTypesOverlap(t1, t2) {
  if (t1 === t2) {
    return true;
  }
  if (t1 instanceof _typeDefinition.GraphQLObjectType) {
    if (t2 instanceof _typeDefinition.GraphQLObjectType) {
      return false;
    }
    return t2.getPossibleTypes().indexOf(t1) !== -1;
  }
  if (t1 instanceof _typeDefinition.GraphQLInterfaceType || t1 instanceof _typeDefinition.GraphQLUnionType) {
    if (t2 instanceof _typeDefinition.GraphQLObjectType) {
      return t1.getPossibleTypes().indexOf(t2) !== -1;
    }
    var t1TypeNames = (0, _jsutilsKeyMap2['default'])(t1.getPossibleTypes(), function (type) {
      return type.name;
    });
    return t2.getPossibleTypes().some(function (type) {
      return t1TypeNames[type.name];
    });
  }
}