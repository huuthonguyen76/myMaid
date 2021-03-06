
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

var _toConsumableArray = require('babel-runtime/helpers/to-consumable-array')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.isValidLiteralValue = isValidLiteralValue;

var _languagePrinter = require('../language/printer');

var _languageKinds = require('../language/kinds');

var _typeDefinition = require('../type/definition');

var _jsutilsInvariant = require('../jsutils/invariant');

var _jsutilsInvariant2 = _interopRequireDefault(_jsutilsInvariant);

var _jsutilsKeyMap = require('../jsutils/keyMap');

var _jsutilsKeyMap2 = _interopRequireDefault(_jsutilsKeyMap);

var _jsutilsIsNullish = require('../jsutils/isNullish');

var _jsutilsIsNullish2 = _interopRequireDefault(_jsutilsIsNullish);

/**
 * Utility for validators which determines if a value literal AST is valid given
 * an input type.
 *
 * Note that this only validates literal values, variables are assumed to
 * provide values of the correct type.
 */

function isValidLiteralValue(_x, _x2) {
  var _again = true;

  _function: while (_again) {
    var type = _x,
        valueAST = _x2;
    ofType = itemType = fields = errors = fieldASTs = _iteratorNormalCompletion = _didIteratorError = _iteratorError = fieldASTMap = _iteratorNormalCompletion2 = _didIteratorError2 = _iteratorError2 = parseResult = undefined;
    _again = false;

    // A value must be provided if the type is non-null.
    if (type instanceof _typeDefinition.GraphQLNonNull) {
      var ofType = type.ofType;
      if (!valueAST) {
        if (ofType.name) {
          return ['Expected "' + ofType.name + '!", found null.'];
        }
        return ['Expected non-null value, found null.'];
      }
      _x = ofType;
      _x2 = valueAST;
      _again = true;
      continue _function;
    }

    if (!valueAST) {
      return [];
    }

    // This function only tests literals, and assumes variables will provide
    // values of the correct type.
    if (valueAST.kind === _languageKinds.VARIABLE) {
      return [];
    }

    // Lists accept a non-list value as a list of one.
    if (type instanceof _typeDefinition.GraphQLList) {
      var itemType = type.ofType;
      if (valueAST.kind === _languageKinds.LIST) {
        return valueAST.values.reduce(function (acc, itemAST, index) {
          var errors = isValidLiteralValue(itemType, itemAST);
          return acc.concat(errors.map(function (error) {
            return 'In element #' + index + ': ' + error;
          }));
        }, []);
      }
      _x = itemType;
      _x2 = valueAST;
      _again = true;
      continue _function;
    }

    // Input objects check each defined field and look for undefined fields.
    if (type instanceof _typeDefinition.GraphQLInputObjectType) {
      if (valueAST.kind !== _languageKinds.OBJECT) {
        return ['Expected "' + type.name + '", found not an object.'];
      }
      var fields = type.getFields();

      var errors = [];

      // Ensure every provided field is defined.
      var fieldASTs = valueAST.fields;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = _getIterator(fieldASTs), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var providedFieldAST = _step.value;

          if (!fields[providedFieldAST.name.value]) {
            errors.push('In field "' + providedFieldAST.name.value + '": Unknown field.');
          }
        }

        // Ensure every defined field is valid.
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator['return']) {
            _iterator['return']();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      var fieldASTMap = (0, _jsutilsKeyMap2['default'])(fieldASTs, function (fieldAST) {
        return fieldAST.name.value;
      });
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = _getIterator(_Object$keys(fields)), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var fieldName = _step2.value;

          var result = isValidLiteralValue(fields[fieldName].type, fieldASTMap[fieldName] && fieldASTMap[fieldName].value);
          errors.push.apply(errors, _toConsumableArray(result.map(function (error) {
            return 'In field "' + fieldName + '": ' + error;
          })));
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2['return']) {
            _iterator2['return']();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return errors;
    }

    (0, _jsutilsInvariant2['default'])(type instanceof _typeDefinition.GraphQLScalarType || type instanceof _typeDefinition.GraphQLEnumType, 'Must be input type');

    // Scalar/Enum input checks to ensure the type can parse the value to
    // a non-null value.
    var parseResult = type.parseLiteral(valueAST);
    if ((0, _jsutilsIsNullish2['default'])(parseResult)) {
      return ['Expected type "' + type.name + '", found ' + (0, _languagePrinter.print)(valueAST) + '.'];
    }

    return [];
  }
}