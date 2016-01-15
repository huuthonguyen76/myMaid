(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _language = require('../language');

var GraphQLError = (function (_Error) {
  _inherits(GraphQLError, _Error);

  function GraphQLError(message,
  // A flow bug keeps us from declaring nodes as an array of Node
  nodes, /* Node */stack, source, positions) {
    _classCallCheck(this, GraphQLError);

    _get(Object.getPrototypeOf(GraphQLError.prototype), 'constructor', this).call(this, message);
    this.message = message;

    Object.defineProperty(this, 'stack', { value: stack || message });
    Object.defineProperty(this, 'nodes', { value: nodes });

    // Note: flow does not yet know about Object.defineProperty with `get`.
    Object.defineProperty(this, 'source', {
      get: function get() {
        if (source) {
          return source;
        }
        if (nodes && nodes.length > 0) {
          var node = nodes[0];
          return node && node.loc && node.loc.source;
        }
      }
    });

    Object.defineProperty(this, 'positions', {
      get: function get() {
        if (positions) {
          return positions;
        }
        if (nodes) {
          var nodePositions = nodes.map(function (node) {
            return node.loc && node.loc.start;
          });
          if (nodePositions.some(function (p) {
            return p;
          })) {
            return nodePositions;
          }
        }
      }
    });

    Object.defineProperty(this, 'locations', {
      get: function get() {
        var _this = this;

        if (this.positions && this.source) {
          return this.positions.map(function (pos) {
            return (0, _language.getLocation)(_this.source, pos);
          });
        }
      }
    });
  }

  return GraphQLError;
})(Error);

exports.GraphQLError = GraphQLError;
},{"../language":14,"babel-runtime/helpers/class-call-check":34,"babel-runtime/helpers/get":37,"babel-runtime/helpers/inherits":38}],2:[function(require,module,exports){

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

/**
 * Given a GraphQLError, format it according to the rules described by the
 * Response Format, Errors section of the GraphQL Specification.
 */
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.formatError = formatError;

var _jsutilsInvariant = require('../jsutils/invariant');

var _jsutilsInvariant2 = _interopRequireDefault(_jsutilsInvariant);

function formatError(error) {
  (0, _jsutilsInvariant2['default'])(error, 'Received null or undefined error.');
  return {
    message: error.message,
    locations: error.locations
  };
}
},{"../jsutils/invariant":11,"babel-runtime/helpers/interop-require-default":39}],3:[function(require,module,exports){

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _GraphQLError = require('./GraphQLError');

Object.defineProperty(exports, 'GraphQLError', {
  enumerable: true,
  get: function get() {
    return _GraphQLError.GraphQLError;
  }
});

var _syntaxError = require('./syntaxError');

Object.defineProperty(exports, 'syntaxError', {
  enumerable: true,
  get: function get() {
    return _syntaxError.syntaxError;
  }
});

var _locatedError = require('./locatedError');

Object.defineProperty(exports, 'locatedError', {
  enumerable: true,
  get: function get() {
    return _locatedError.locatedError;
  }
});

var _formatError = require('./formatError');

Object.defineProperty(exports, 'formatError', {
  enumerable: true,
  get: function get() {
    return _formatError.formatError;
  }
});
},{"./GraphQLError":1,"./formatError":2,"./locatedError":4,"./syntaxError":5}],4:[function(require,module,exports){

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.locatedError = locatedError;

var _GraphQLError = require('./GraphQLError');

/**
 * Given an arbitrary Error, presumably thrown while attempting to execute a
 * GraphQL operation, produce a new GraphQLError aware of the location in the
 * document responsible for the original Error.
 */

function locatedError(originalError, nodes) {
  var message = originalError ? originalError.message || String(originalError) : 'An unknown error occurred.';
  var stack = originalError ? originalError.stack : null;
  var error = new _GraphQLError.GraphQLError(message, nodes, stack);
  error.originalError = originalError;
  return error;
}
},{"./GraphQLError":1}],5:[function(require,module,exports){

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.syntaxError = syntaxError;

var _languageLocation = require('../language/location');

var _GraphQLError = require('./GraphQLError');

/**
 * Produces a GraphQLError representing a syntax error, containing useful
 * descriptive information about the syntax error's position in the source.
 */

function syntaxError(source, position, description) {
  var location = (0, _languageLocation.getLocation)(source, position);
  var error = new _GraphQLError.GraphQLError('Syntax Error ' + source.name + ' (' + location.line + ':' + location.column + ') ' + description + '\n\n' + highlightSourceAtLocation(source, location), undefined, undefined, source, [position]);
  return error;
}

/**
 * Render a helpful description of the location of the error in the GraphQL
 * Source document.
 */
function highlightSourceAtLocation(source, location) {
  var line = location.line;
  var prevLineNum = (line - 1).toString();
  var lineNum = line.toString();
  var nextLineNum = (line + 1).toString();
  var padLen = nextLineNum.length;
  var lines = source.body.split(/\r\n|[\n\r\u2028\u2029]/g);
  return (line >= 2 ? lpad(padLen, prevLineNum) + ': ' + lines[line - 2] + '\n' : '') + lpad(padLen, lineNum) + ': ' + lines[line - 1] + '\n' + Array(2 + padLen + location.column).join(' ') + '^\n' + (line < lines.length ? lpad(padLen, nextLineNum) + ': ' + lines[line] + '\n' : '');
}

function lpad(len, str) {
  return Array(len - str.length + 1).join(' ') + str;
}
},{"../language/location":17,"./GraphQLError":1}],6:[function(require,module,exports){

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

/**
 * Terminology
 *
 * "Definitions" are the generic name for top-level statements in the document.
 * Examples of this include:
 * 1) Operations (such as a query)
 * 2) Fragments
 *
 * "Operations" are a generic name for requests in the document.
 * Examples of this include:
 * 1) query,
 * 2) mutation
 *
 * "Selections" are the definitions that can appear legally and at
 * single level of the query. These include:
 * 1) field references e.g "a"
 * 2) fragment "spreads" e.g. "...c"
 * 3) inline fragment "spreads" e.g. "...on Type { a }"
 */

/**
 * Data that must be available at all points during query execution.
 *
 * Namely, schema of the type system that is currently executing,
 * and the fragments defined in the query document
 */
'use strict';

/**
 * The result of execution. `data` is the result of executing the
 * query, `errors` is null if no errors occurred, and is a
 * non-empty array if an error occurred.
 */

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.execute = execute;

var _error = require('../error');

var _jsutilsFind = require('../jsutils/find');

var _jsutilsFind2 = _interopRequireDefault(_jsutilsFind);

var _jsutilsInvariant = require('../jsutils/invariant');

var _jsutilsInvariant2 = _interopRequireDefault(_jsutilsInvariant);

var _jsutilsIsNullish = require('../jsutils/isNullish');

var _jsutilsIsNullish2 = _interopRequireDefault(_jsutilsIsNullish);

var _utilitiesTypeFromAST = require('../utilities/typeFromAST');

var _language = require('../language');

var _values = require('./values');

var _typeDefinition = require('../type/definition');

var _typeSchema = require('../type/schema');

var _typeIntrospection = require('../type/introspection');

var _typeDirectives = require('../type/directives');

/**
 * Implements the "Evaluating requests" section of the GraphQL specification.
 *
 * Returns a Promise that will eventually be resolved and never rejected.
 *
 * If the arguments to this function do not result in a legal execution context,
 * a GraphQLError will be thrown immediately explaining the invalid input.
 */

function execute(schema, documentAST, rootValue, variableValues, operationName) {
  (0, _jsutilsInvariant2['default'])(schema, 'Must provide schema');
  (0, _jsutilsInvariant2['default'])(schema instanceof _typeSchema.GraphQLSchema, 'Schema must be an instance of GraphQLSchema. Also ensure that there are ' + 'not multiple versions of GraphQL installed in your node_modules directory.');

  // If a valid context cannot be created due to incorrect arguments,
  // this will throw an error.
  var context = buildExecutionContext(schema, documentAST, rootValue, variableValues, operationName);

  // Return a Promise that will eventually resolve to the data described by
  // The "Response" section of the GraphQL specification.
  //
  // If errors are encountered while executing a GraphQL field, only that
  // field and its descendants will be omitted, and sibling fields will still
  // be executed. An execution which encounters errors will still result in a
  // resolved Promise.
  return new _Promise(function (resolve) {
    resolve(executeOperation(context, context.operation, rootValue));
  })['catch'](function (error) {
    // Errors from sub-fields of a NonNull type may propagate to the top level,
    // at which point we still log the error and null the parent field, which
    // in this case is the entire response.
    context.errors.push(error);
    return null;
  }).then(function (data) {
    if (!context.errors.length) {
      return { data: data };
    }
    return { data: data, errors: context.errors };
  });
}

/**
 * Constructs a ExecutionContext object from the arguments passed to
 * execute, which we will pass throughout the other execution methods.
 *
 * Throws a GraphQLError if a valid execution context cannot be created.
 */
function buildExecutionContext(schema, documentAST, rootValue, rawVariableValues, operationName) {
  var errors = [];
  var operation;
  var fragments = {};
  documentAST.definitions.forEach(function (definition) {
    switch (definition.kind) {
      case _language.Kind.OPERATION_DEFINITION:
        if (!operationName && operation) {
          throw new _error.GraphQLError('Must provide operation name if query contains multiple operations.');
        }
        if (!operationName || definition.name && definition.name.value === operationName) {
          operation = definition;
        }
        break;
      case _language.Kind.FRAGMENT_DEFINITION:
        fragments[definition.name.value] = definition;
        break;
      default:
        throw new _error.GraphQLError('GraphQL cannot execute a request containing a ' + definition.kind + '.', definition);
    }
  });
  if (!operation) {
    if (!operationName) {
      throw new _error.GraphQLError('Unknown operation named "' + operationName + '".');
    } else {
      throw new _error.GraphQLError('Must provide an operation.');
    }
  }
  var variableValues = (0, _values.getVariableValues)(schema, operation.variableDefinitions || [], rawVariableValues || {});
  var exeContext = { schema: schema, fragments: fragments, rootValue: rootValue, operation: operation, variableValues: variableValues, errors: errors };
  return exeContext;
}

/**
 * Implements the "Evaluating operations" section of the spec.
 */
function executeOperation(exeContext, operation, rootValue) {
  var type = getOperationRootType(exeContext.schema, operation);
  var fields = collectFields(exeContext, type, operation.selectionSet, {}, {});
  if (operation.operation === 'mutation') {
    return executeFieldsSerially(exeContext, type, rootValue, fields);
  }
  return executeFields(exeContext, type, rootValue, fields);
}

/**
 * Extracts the root type of the operation from the schema.
 */
function getOperationRootType(schema, operation) {
  switch (operation.operation) {
    case 'query':
      return schema.getQueryType();
    case 'mutation':
      var mutationType = schema.getMutationType();
      if (!mutationType) {
        throw new _error.GraphQLError('Schema is not configured for mutations', [operation]);
      }
      return mutationType;
    case 'subscription':
      var subscriptionType = schema.getSubscriptionType();
      if (!subscriptionType) {
        throw new _error.GraphQLError('Schema is not configured for subscriptions', [operation]);
      }
      return subscriptionType;
    default:
      throw new _error.GraphQLError('Can only execute queries, mutations and subscriptions', [operation]);
  }
}

/**
 * Implements the "Evaluating selection sets" section of the spec
 * for "write" mode.
 */
function executeFieldsSerially(exeContext, parentType, sourceValue, fields) {
  return _Object$keys(fields).reduce(function (prevPromise, responseName) {
    return prevPromise.then(function (results) {
      var fieldASTs = fields[responseName];
      var result = resolveField(exeContext, parentType, sourceValue, fieldASTs);
      if (result === undefined) {
        return results;
      }
      if (isThenable(result)) {
        return result.then(function (resolvedResult) {
          results[responseName] = resolvedResult;
          return results;
        });
      }
      results[responseName] = result;
      return results;
    });
  }, _Promise.resolve({}));
}

/**
 * Implements the "Evaluating selection sets" section of the spec
 * for "read" mode.
 */
function executeFields(exeContext, parentType, sourceValue, fields) {
  var containsPromise = false;

  var finalResults = _Object$keys(fields).reduce(function (results, responseName) {
    var fieldASTs = fields[responseName];
    var result = resolveField(exeContext, parentType, sourceValue, fieldASTs);
    if (result === undefined) {
      return results;
    }
    results[responseName] = result;
    if (isThenable(result)) {
      containsPromise = true;
    }
    return results;
  }, {});

  // If there are no promises, we can just return the object
  if (!containsPromise) {
    return finalResults;
  }

  // Otherwise, results is a map from field name to the result
  // of resolving that field, which is possibly a promise. Return
  // a promise that will return this same map, but with any
  // promises replaced with the values they resolved to.
  return promiseForObject(finalResults);
}

/**
 * Given a selectionSet, adds all of the fields in that selection to
 * the passed in map of fields, and returns it at the end.
 *
 * CollectFields requires the "runtime type" of an object. For a field which
 * returns and Interface or Union type, the "runtime type" will be the actual
 * Object type returned by that field.
 */
function collectFields(exeContext, runtimeType, selectionSet, fields, visitedFragmentNames) {
  for (var i = 0; i < selectionSet.selections.length; i++) {
    var selection = selectionSet.selections[i];
    switch (selection.kind) {
      case _language.Kind.FIELD:
        if (!shouldIncludeNode(exeContext, selection.directives)) {
          continue;
        }
        var name = getFieldEntryKey(selection);
        if (!fields[name]) {
          fields[name] = [];
        }
        fields[name].push(selection);
        break;
      case _language.Kind.INLINE_FRAGMENT:
        if (!shouldIncludeNode(exeContext, selection.directives) || !doesFragmentConditionMatch(exeContext, selection, runtimeType)) {
          continue;
        }
        collectFields(exeContext, runtimeType, selection.selectionSet, fields, visitedFragmentNames);
        break;
      case _language.Kind.FRAGMENT_SPREAD:
        var fragName = selection.name.value;
        if (visitedFragmentNames[fragName] || !shouldIncludeNode(exeContext, selection.directives)) {
          continue;
        }
        visitedFragmentNames[fragName] = true;
        var fragment = exeContext.fragments[fragName];
        if (!fragment || !shouldIncludeNode(exeContext, fragment.directives) || !doesFragmentConditionMatch(exeContext, fragment, runtimeType)) {
          continue;
        }
        collectFields(exeContext, runtimeType, fragment.selectionSet, fields, visitedFragmentNames);
        break;
    }
  }
  return fields;
}

/**
 * Determines if a field should be included based on the @include and @skip
 * directives, where @skip has higher precidence than @include.
 */
function shouldIncludeNode(exeContext, directives) {
  var skipAST = directives && (0, _jsutilsFind2['default'])(directives, function (directive) {
    return directive.name.value === _typeDirectives.GraphQLSkipDirective.name;
  });
  if (skipAST) {
    var _getArgumentValues = (0, _values.getArgumentValues)(_typeDirectives.GraphQLSkipDirective.args, skipAST.arguments, exeContext.variableValues);

    var skipIf = _getArgumentValues['if'];

    return !skipIf;
  }

  var includeAST = directives && (0, _jsutilsFind2['default'])(directives, function (directive) {
    return directive.name.value === _typeDirectives.GraphQLIncludeDirective.name;
  });
  if (includeAST) {
    var _getArgumentValues2 = (0, _values.getArgumentValues)(_typeDirectives.GraphQLIncludeDirective.args, includeAST.arguments, exeContext.variableValues);

    var includeIf = _getArgumentValues2['if'];

    return Boolean(includeIf);
  }

  return true;
}

/**
 * Determines if a fragment is applicable to the given type.
 */
function doesFragmentConditionMatch(exeContext, fragment, type) {
  var typeConditionAST = fragment.typeCondition;
  if (!typeConditionAST) {
    return true;
  }
  var conditionalType = (0, _utilitiesTypeFromAST.typeFromAST)(exeContext.schema, typeConditionAST);
  if (conditionalType === type) {
    return true;
  }
  if ((0, _typeDefinition.isAbstractType)(conditionalType)) {
    return conditionalType.isPossibleType(type);
  }
  return false;
}

/**
 * This function transforms a JS object `{[key: string]: Promise<any>}` into
 * a `Promise<{[key: string]: any}>`
 *
 * This is akin to bluebird's `Promise.props`, but implemented only using
 * `Promise.all` so it will work with any implementation of ES6 promises.
 */
function promiseForObject(object) {
  var keys = _Object$keys(object);
  var valuesAndPromises = keys.map(function (name) {
    return object[name];
  });
  return _Promise.all(valuesAndPromises).then(function (values) {
    return values.reduce(function (resolvedObject, value, i) {
      resolvedObject[keys[i]] = value;
      return resolvedObject;
    }, {});
  });
}

/**
 * Implements the logic to compute the key of a given field’s entry
 */
function getFieldEntryKey(node) {
  return node.alias ? node.alias.value : node.name.value;
}

/**
 * Resolves the field on the given source object. In particular, this
 * figures out the value that the field returns by calling its resolve function,
 * then calls completeValue to complete promises, serialize scalars, or execute
 * the sub-selection-set for objects.
 */
function resolveField(exeContext, parentType, source, fieldASTs) {
  var fieldAST = fieldASTs[0];
  var fieldName = fieldAST.name.value;

  var fieldDef = getFieldDef(exeContext.schema, parentType, fieldName);
  if (!fieldDef) {
    return;
  }

  var returnType = fieldDef.type;
  var resolveFn = fieldDef.resolve || defaultResolveFn;

  // Build a JS object of arguments from the field.arguments AST, using the
  // variables scope to fulfill any variable references.
  // TODO: find a way to memoize, in case this field is within a List type.
  var args = (0, _values.getArgumentValues)(fieldDef.args, fieldAST.arguments, exeContext.variableValues);

  // The resolve function's optional third argument is a collection of
  // information about the current execution state.
  var info = {
    fieldName: fieldName,
    fieldASTs: fieldASTs,
    returnType: returnType,
    parentType: parentType,
    schema: exeContext.schema,
    fragments: exeContext.fragments,
    rootValue: exeContext.rootValue,
    operation: exeContext.operation,
    variableValues: exeContext.variableValues
  };

  // Get the resolve function, regardless of if its result is normal
  // or abrupt (error).
  var result = resolveOrError(resolveFn, source, args, info);

  return completeValueCatchingError(exeContext, returnType, fieldASTs, info, result);
}

// Isolates the "ReturnOrAbrupt" behavior to not de-opt the `resolveField`
// function. Returns the result of resolveFn or the abrupt-return Error object.
function resolveOrError(resolveFn, source, args, info) {
  try {
    return resolveFn(source, args, info);
  } catch (error) {
    // Sometimes a non-error is thrown, wrap it as an Error for a
    // consistent interface.
    return error instanceof Error ? error : new Error(error);
  }
}

// This is a small wrapper around completeValue which detects and logs errors
// in the execution context.
function completeValueCatchingError(exeContext, returnType, fieldASTs, info, result) {
  // If the field type is non-nullable, then it is resolved without any
  // protection from errors.
  if (returnType instanceof _typeDefinition.GraphQLNonNull) {
    return completeValue(exeContext, returnType, fieldASTs, info, result);
  }

  // Otherwise, error protection is applied, logging the error and resolving
  // a null value for this field if one is encountered.
  try {
    var completed = completeValue(exeContext, returnType, fieldASTs, info, result);
    if (isThenable(completed)) {
      // If `completeValue` returned a rejected promise, log the rejection
      // error and resolve to null.
      // Note: we don't rely on a `catch` method, but we do expect "thenable"
      // to take a second callback for the error case.
      return completed.then(undefined, function (error) {
        exeContext.errors.push(error);
        return _Promise.resolve(null);
      });
    }
    return completed;
  } catch (error) {
    // If `completeValue` returned abruptly (threw an error), log the error
    // and return null.
    exeContext.errors.push(error);
    return null;
  }
}

/**
 * Implements the instructions for completeValue as defined in the
 * "Field entries" section of the spec.
 *
 * If the field type is Non-Null, then this recursively completes the value
 * for the inner type. It throws a field error if that completion returns null,
 * as per the "Nullability" section of the spec.
 *
 * If the field type is a List, then this recursively completes the value
 * for the inner type on each item in the list.
 *
 * If the field type is a Scalar or Enum, ensures the completed value is a legal
 * value of the type by calling the `serialize` method of GraphQL type
 * definition.
 *
 * Otherwise, the field type expects a sub-selection set, and will complete the
 * value by evaluating all sub-selections.
 */
function completeValue(exeContext, returnType, fieldASTs, info, result) {
  // If result is a Promise, apply-lift over completeValue.
  if (isThenable(result)) {
    return result.then(
    // Once resolved to a value, complete that value.
    function (resolved) {
      return completeValue(exeContext, returnType, fieldASTs, info, resolved);
    },
    // If rejected, create a located error, and continue to reject.
    function (error) {
      return _Promise.reject((0, _error.locatedError)(error, fieldASTs));
    });
  }

  // If result is an Error, throw a located error.
  if (result instanceof Error) {
    throw (0, _error.locatedError)(result, fieldASTs);
  }

  // If field type is NonNull, complete for inner type, and throw field error
  // if result is null.
  if (returnType instanceof _typeDefinition.GraphQLNonNull) {
    var completed = completeValue(exeContext, returnType.ofType, fieldASTs, info, result);
    if (completed === null) {
      throw new _error.GraphQLError('Cannot return null for non-nullable ' + ('field ' + info.parentType + '.' + info.fieldName + '.'), fieldASTs);
    }
    return completed;
  }

  // If result is null-like, return null.
  if ((0, _jsutilsIsNullish2['default'])(result)) {
    return null;
  }

  // If field type is List, complete each item in the list with the inner type
  if (returnType instanceof _typeDefinition.GraphQLList) {
    (0, _jsutilsInvariant2['default'])(Array.isArray(result), 'User Error: expected iterable, but did not find one.');

    // This is specified as a simple map, however we're optimizing the path
    // where the list contains no Promises by avoiding creating another Promise.
    var itemType = returnType.ofType;
    var containsPromise = false;
    var completedResults = result.map(function (item) {
      var completedItem = completeValueCatchingError(exeContext, itemType, fieldASTs, info, item);
      if (!containsPromise && isThenable(completedItem)) {
        containsPromise = true;
      }
      return completedItem;
    });

    return containsPromise ? _Promise.all(completedResults) : completedResults;
  }

  // If field type is Scalar or Enum, serialize to a valid value, returning
  // null if serialization is not possible.
  if (returnType instanceof _typeDefinition.GraphQLScalarType || returnType instanceof _typeDefinition.GraphQLEnumType) {
    (0, _jsutilsInvariant2['default'])(returnType.serialize, 'Missing serialize method on type');
    var serializedResult = returnType.serialize(result);
    return (0, _jsutilsIsNullish2['default'])(serializedResult) ? null : serializedResult;
  }

  // Field type must be Object, Interface or Union and expect sub-selections.
  var runtimeType;

  if (returnType instanceof _typeDefinition.GraphQLObjectType) {
    runtimeType = returnType;
  } else if ((0, _typeDefinition.isAbstractType)(returnType)) {
    var abstractType = returnType;
    runtimeType = abstractType.getObjectType(result, info);
    if (runtimeType && !abstractType.isPossibleType(runtimeType)) {
      throw new _error.GraphQLError('Runtime Object type "' + runtimeType + '" is not a possible type ' + ('for "' + abstractType + '".'), fieldASTs);
    }
  }

  if (!runtimeType) {
    return null;
  }

  // If there is an isTypeOf predicate function, call it with the
  // current result. If isTypeOf returns false, then raise an error rather
  // than continuing execution.
  if (runtimeType.isTypeOf && !runtimeType.isTypeOf(result, info)) {
    throw new _error.GraphQLError('Expected value of type "' + runtimeType + '" but got: ' + result + '.', fieldASTs);
  }

  // Collect sub-fields to execute to complete this value.
  var subFieldASTs = {};
  var visitedFragmentNames = {};
  for (var i = 0; i < fieldASTs.length; i++) {
    var selectionSet = fieldASTs[i].selectionSet;
    if (selectionSet) {
      subFieldASTs = collectFields(exeContext, runtimeType, selectionSet, subFieldASTs, visitedFragmentNames);
    }
  }

  return executeFields(exeContext, runtimeType, result, subFieldASTs);
}

/**
 * If a resolve function is not given, then a default resolve behavior is used
 * which takes the property of the source object of the same name as the field
 * and returns it as the result, or if it's a function, returns the result
 * of calling that function.
 */
function defaultResolveFn(source, args, _ref) {
  var fieldName = _ref.fieldName;

  var property = source[fieldName];
  return typeof property === 'function' ? property.call(source) : property;
}

/**
 * Checks to see if this object acts like a Promise, i.e. has a "then"
 * function.
 */
function isThenable(value) {
  return value && typeof value === 'object' && typeof value.then === 'function';
}

/**
 * This method looks up the field on the given type defintion.
 * It has special casing for the two introspection fields, __schema
 * and __typename. __typename is special because it can always be
 * queried as a field, even in situations where no other fields
 * are allowed, like on a Union. __schema could get automatically
 * added to the query type, but that would require mutating type
 * definitions, which would cause issues.
 */
function getFieldDef(schema, parentType, fieldName) {
  if (fieldName === _typeIntrospection.SchemaMetaFieldDef.name && schema.getQueryType() === parentType) {
    return _typeIntrospection.SchemaMetaFieldDef;
  } else if (fieldName === _typeIntrospection.TypeMetaFieldDef.name && schema.getQueryType() === parentType) {
    return _typeIntrospection.TypeMetaFieldDef;
  } else if (fieldName === _typeIntrospection.TypeNameMetaFieldDef.name) {
    return _typeIntrospection.TypeNameMetaFieldDef;
  }
  return parentType.getFields()[fieldName];
}
},{"../error":3,"../jsutils/find":10,"../jsutils/invariant":11,"../jsutils/isNullish":12,"../language":14,"../type/definition":125,"../type/directives":126,"../type/introspection":127,"../type/schema":129,"../utilities/typeFromAST":135,"./values":7,"babel-runtime/core-js/object/keys":30,"babel-runtime/core-js/promise":32,"babel-runtime/helpers/interop-require-default":39}],7:[function(require,module,exports){

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
},{"../error":3,"../jsutils/invariant":11,"../jsutils/isNullish":12,"../jsutils/keyMap":13,"../language/printer":19,"../type/definition":125,"../utilities/isValidJSValue":132,"../utilities/typeFromAST":135,"../utilities/valueFromAST":136,"babel-runtime/core-js/object/keys":30,"babel-runtime/helpers/interop-require-default":39}],8:[function(require,module,exports){

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

/**
 * This is the primary entry point function for fulfilling GraphQL operations
 * by parsing, validating, and executing a GraphQL document along side a
 * GraphQL schema.
 *
 * More sophisticated GraphQL servers, such as those which persist queries,
 * may wish to separate the validation and execution phases to a static time
 * tooling step, and a server runtime step.
 *
 * schema:
 *    The GraphQL type system to use when validating and executing a query.
 * requestString:
 *    A GraphQL language formatted string representing the requested operation.
 * rootValue:
 *    The value provided as the first argument to resolver functions on the top
 *    level type (e.g. the query object type).
 * variableValues:
 *    A mapping of variable name to runtime value to use for all variables
 *    defined in the requestString.
 * operationName:
 *    The name of the operation to use if requestString contains multiple
 *    possible operations. Can be omitted if requestString contains only
 *    one operation.
 */
'use strict';

var _Promise = require('babel-runtime/core-js/promise')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.graphql = graphql;

/**
 * The result of a GraphQL parse, validation and execution.
 *
 * `data` is the result of a successful execution of the query.
 * `errors` is included when any errors occurred as a non-empty array.
 */

var _languageSource = require('./language/source');

var _languageParser = require('./language/parser');

var _validationValidate = require('./validation/validate');

var _executionExecute = require('./execution/execute');

function graphql(schema, requestString, rootValue, variableValues, operationName) {
  return new _Promise(function (resolve) {
    var source = new _languageSource.Source(requestString || '', 'GraphQL request');
    var documentAST = (0, _languageParser.parse)(source);
    var validationErrors = (0, _validationValidate.validate)(schema, documentAST);
    if (validationErrors.length > 0) {
      resolve({ errors: validationErrors });
    } else {
      resolve((0, _executionExecute.execute)(schema, documentAST, rootValue, variableValues, operationName));
    }
  })['catch'](function (error) {
    return { errors: [error] };
  });
}
},{"./execution/execute":6,"./language/parser":18,"./language/source":20,"./validation/validate":161,"babel-runtime/core-js/promise":32}],9:[function(require,module,exports){
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

// The primary entry point into fulfilling a GraphQL request.
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _graphql = require('./graphql');

Object.defineProperty(exports, 'graphql', {
  enumerable: true,
  get: function get() {
    return _graphql.graphql;
  }
});

// Produce a GraphQL type schema.

var _typeSchema = require('./type/schema');

Object.defineProperty(exports, 'GraphQLSchema', {
  enumerable: true,
  get: function get() {
    return _typeSchema.GraphQLSchema;
  }
});

// Define GraphQL types.

var _typeDefinition = require('./type/definition');

Object.defineProperty(exports, 'GraphQLScalarType', {
  enumerable: true,
  get: function get() {
    return _typeDefinition.GraphQLScalarType;
  }
});
Object.defineProperty(exports, 'GraphQLObjectType', {
  enumerable: true,
  get: function get() {
    return _typeDefinition.GraphQLObjectType;
  }
});
Object.defineProperty(exports, 'GraphQLInterfaceType', {
  enumerable: true,
  get: function get() {
    return _typeDefinition.GraphQLInterfaceType;
  }
});
Object.defineProperty(exports, 'GraphQLUnionType', {
  enumerable: true,
  get: function get() {
    return _typeDefinition.GraphQLUnionType;
  }
});
Object.defineProperty(exports, 'GraphQLEnumType', {
  enumerable: true,
  get: function get() {
    return _typeDefinition.GraphQLEnumType;
  }
});
Object.defineProperty(exports, 'GraphQLInputObjectType', {
  enumerable: true,
  get: function get() {
    return _typeDefinition.GraphQLInputObjectType;
  }
});
Object.defineProperty(exports, 'GraphQLList', {
  enumerable: true,
  get: function get() {
    return _typeDefinition.GraphQLList;
  }
});
Object.defineProperty(exports, 'GraphQLNonNull', {
  enumerable: true,
  get: function get() {
    return _typeDefinition.GraphQLNonNull;
  }
});

// Use pre-defined GraphQL scalar types.

var _typeScalars = require('./type/scalars');

Object.defineProperty(exports, 'GraphQLInt', {
  enumerable: true,
  get: function get() {
    return _typeScalars.GraphQLInt;
  }
});
Object.defineProperty(exports, 'GraphQLFloat', {
  enumerable: true,
  get: function get() {
    return _typeScalars.GraphQLFloat;
  }
});
Object.defineProperty(exports, 'GraphQLString', {
  enumerable: true,
  get: function get() {
    return _typeScalars.GraphQLString;
  }
});
Object.defineProperty(exports, 'GraphQLBoolean', {
  enumerable: true,
  get: function get() {
    return _typeScalars.GraphQLBoolean;
  }
});
Object.defineProperty(exports, 'GraphQLID', {
  enumerable: true,
  get: function get() {
    return _typeScalars.GraphQLID;
  }
});

// Format GraphQL errors.

var _errorFormatError = require('./error/formatError');

Object.defineProperty(exports, 'formatError', {
  enumerable: true,
  get: function get() {
    return _errorFormatError.formatError;
  }
});
},{"./error/formatError":2,"./graphql":8,"./type/definition":125,"./type/scalars":128,"./type/schema":129}],10:[function(require,module,exports){

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = find;

function find(list, predicate) {
  for (var i = 0; i < list.length; i++) {
    if (predicate(list[i])) {
      return list[i];
    }
  }
}

module.exports = exports["default"];
},{}],11:[function(require,module,exports){

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = invariant;

function invariant(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

module.exports = exports["default"];
},{}],12:[function(require,module,exports){

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

/**
 * Returns true if a value is null, undefined, or NaN.
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = isNullish;

function isNullish(value) {
  return value === null || value === undefined || value !== value;
}

module.exports = exports["default"];
},{}],13:[function(require,module,exports){

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

/**
 * Creates a keyed JS object from an array, given a function to produce the keys
 * for each value in the array.
 *
 * This provides a convenient lookup for the array items if the key function
 * produces unique results.
 *
 *     var phoneBook = [
 *       { name: 'Jon', num: '555-1234' },
 *       { name: 'Jenny', num: '867-5309' }
 *     ]
 *
 *     // { Jon: { name: 'Jon', num: '555-1234' },
 *     //   Jenny: { name: 'Jenny', num: '867-5309' } }
 *     var entriesByName = keyMap(
 *       phoneBook,
 *       entry => entry.name
 *     )
 *
 *     // { name: 'Jenny', num: '857-6309' }
 *     var jennyEntry = entriesByName['Jenny']
 *
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = keyMap;

function keyMap(list, keyFn) {
  return list.reduce(function (map, item) {
    return (map[keyFn(item)] = item, map);
  }, {});
}

module.exports = exports["default"];
},{}],14:[function(require,module,exports){
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _kinds = require('./kinds');

var Kind = _interopRequireWildcard(_kinds);

var _location = require('./location');

Object.defineProperty(exports, 'getLocation', {
  enumerable: true,
  get: function get() {
    return _location.getLocation;
  }
});
exports.Kind = Kind;

var _lexer = require('./lexer');

Object.defineProperty(exports, 'lex', {
  enumerable: true,
  get: function get() {
    return _lexer.lex;
  }
});

var _parser = require('./parser');

Object.defineProperty(exports, 'parse', {
  enumerable: true,
  get: function get() {
    return _parser.parse;
  }
});
Object.defineProperty(exports, 'parseValue', {
  enumerable: true,
  get: function get() {
    return _parser.parseValue;
  }
});

var _printer = require('./printer');

Object.defineProperty(exports, 'print', {
  enumerable: true,
  get: function get() {
    return _printer.print;
  }
});

var _source = require('./source');

Object.defineProperty(exports, 'Source', {
  enumerable: true,
  get: function get() {
    return _source.Source;
  }
});

var _visitor = require('./visitor');

Object.defineProperty(exports, 'visit', {
  enumerable: true,
  get: function get() {
    return _visitor.visit;
  }
});
Object.defineProperty(exports, 'BREAK', {
  enumerable: true,
  get: function get() {
    return _visitor.BREAK;
  }
});
},{"./kinds":15,"./lexer":16,"./location":17,"./parser":18,"./printer":19,"./source":20,"./visitor":21,"babel-runtime/helpers/interop-require-wildcard":40}],15:[function(require,module,exports){
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

// Name

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var NAME = 'Name';

exports.NAME = NAME;
// Document

var DOCUMENT = 'Document';
exports.DOCUMENT = DOCUMENT;
var OPERATION_DEFINITION = 'OperationDefinition';
exports.OPERATION_DEFINITION = OPERATION_DEFINITION;
var VARIABLE_DEFINITION = 'VariableDefinition';
exports.VARIABLE_DEFINITION = VARIABLE_DEFINITION;
var VARIABLE = 'Variable';
exports.VARIABLE = VARIABLE;
var SELECTION_SET = 'SelectionSet';
exports.SELECTION_SET = SELECTION_SET;
var FIELD = 'Field';
exports.FIELD = FIELD;
var ARGUMENT = 'Argument';

exports.ARGUMENT = ARGUMENT;
// Fragments

var FRAGMENT_SPREAD = 'FragmentSpread';
exports.FRAGMENT_SPREAD = FRAGMENT_SPREAD;
var INLINE_FRAGMENT = 'InlineFragment';
exports.INLINE_FRAGMENT = INLINE_FRAGMENT;
var FRAGMENT_DEFINITION = 'FragmentDefinition';

exports.FRAGMENT_DEFINITION = FRAGMENT_DEFINITION;
// Values

var INT = 'IntValue';
exports.INT = INT;
var FLOAT = 'FloatValue';
exports.FLOAT = FLOAT;
var STRING = 'StringValue';
exports.STRING = STRING;
var BOOLEAN = 'BooleanValue';
exports.BOOLEAN = BOOLEAN;
var ENUM = 'EnumValue';
exports.ENUM = ENUM;
var LIST = 'ListValue';
exports.LIST = LIST;
var OBJECT = 'ObjectValue';
exports.OBJECT = OBJECT;
var OBJECT_FIELD = 'ObjectField';

exports.OBJECT_FIELD = OBJECT_FIELD;
// Directives

var DIRECTIVE = 'Directive';

exports.DIRECTIVE = DIRECTIVE;
// Types

var NAMED_TYPE = 'NamedType';
exports.NAMED_TYPE = NAMED_TYPE;
var LIST_TYPE = 'ListType';
exports.LIST_TYPE = LIST_TYPE;
var NON_NULL_TYPE = 'NonNullType';

exports.NON_NULL_TYPE = NON_NULL_TYPE;
// Type Definitions

var OBJECT_TYPE_DEFINITION = 'ObjectTypeDefinition';
exports.OBJECT_TYPE_DEFINITION = OBJECT_TYPE_DEFINITION;
var FIELD_DEFINITION = 'FieldDefinition';
exports.FIELD_DEFINITION = FIELD_DEFINITION;
var INPUT_VALUE_DEFINITION = 'InputValueDefinition';
exports.INPUT_VALUE_DEFINITION = INPUT_VALUE_DEFINITION;
var INTERFACE_TYPE_DEFINITION = 'InterfaceTypeDefinition';
exports.INTERFACE_TYPE_DEFINITION = INTERFACE_TYPE_DEFINITION;
var UNION_TYPE_DEFINITION = 'UnionTypeDefinition';
exports.UNION_TYPE_DEFINITION = UNION_TYPE_DEFINITION;
var SCALAR_TYPE_DEFINITION = 'ScalarTypeDefinition';
exports.SCALAR_TYPE_DEFINITION = SCALAR_TYPE_DEFINITION;
var ENUM_TYPE_DEFINITION = 'EnumTypeDefinition';
exports.ENUM_TYPE_DEFINITION = ENUM_TYPE_DEFINITION;
var ENUM_VALUE_DEFINITION = 'EnumValueDefinition';
exports.ENUM_VALUE_DEFINITION = ENUM_VALUE_DEFINITION;
var INPUT_OBJECT_TYPE_DEFINITION = 'InputObjectTypeDefinition';
exports.INPUT_OBJECT_TYPE_DEFINITION = INPUT_OBJECT_TYPE_DEFINITION;
var TYPE_EXTENSION_DEFINITION = 'TypeExtensionDefinition';
exports.TYPE_EXTENSION_DEFINITION = TYPE_EXTENSION_DEFINITION;
},{}],16:[function(require,module,exports){
/*  /
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

/**
 * A representation of a lexed Token. Value is optional, is it is
 * not needed for punctuators like BANG or PAREN_L.
 */
Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.lex = lex;
exports.getTokenDesc = getTokenDesc;
exports.getTokenKindDesc = getTokenKindDesc;

var _error = require('../error');

/**
 * Given a Source object, this returns a Lexer for that source.
 * A Lexer is a function that acts like a generator in that every time
 * it is called, it returns the next token in the Source. Assuming the
 * source lexes, the final Token emitted by the lexer will be of kind
 * EOF, after which the lexer will repeatedly return EOF tokens whenever
 * called.
 *
 * The argument to the lexer function is optional, and can be used to
 * rewind or fast forward the lexer to a new position in the source.
 */

function lex(source) {
  var prevPosition = 0;
  return function nextToken(resetPosition) {
    var token = readToken(source, resetPosition === undefined ? prevPosition : resetPosition);
    prevPosition = token.end;
    return token;
  };
}

/**
 * An enum describing the different kinds of tokens that the lexer emits.
 */
var TokenKind = {
  EOF: 1,
  BANG: 2,
  DOLLAR: 3,
  PAREN_L: 4,
  PAREN_R: 5,
  SPREAD: 6,
  COLON: 7,
  EQUALS: 8,
  AT: 9,
  BRACKET_L: 10,
  BRACKET_R: 11,
  BRACE_L: 12,
  PIPE: 13,
  BRACE_R: 14,
  NAME: 15,
  VARIABLE: 16,
  INT: 17,
  FLOAT: 18,
  STRING: 19
};

exports.TokenKind = TokenKind;
/**
 * A helper function to describe a token as a string for debugging
 */

function getTokenDesc(token) {
  return token.value ? getTokenKindDesc(token.kind) + ' "' + token.value + '"' : getTokenKindDesc(token.kind);
}

/**
 * A helper function to describe a token kind as a string for debugging
 */

function getTokenKindDesc(kind) {
  return tokenDescription[kind];
}

var tokenDescription = {};
tokenDescription[TokenKind.EOF] = 'EOF';
tokenDescription[TokenKind.BANG] = '!';
tokenDescription[TokenKind.DOLLAR] = '$';
tokenDescription[TokenKind.PAREN_L] = '(';
tokenDescription[TokenKind.PAREN_R] = ')';
tokenDescription[TokenKind.SPREAD] = '...';
tokenDescription[TokenKind.COLON] = ':';
tokenDescription[TokenKind.EQUALS] = '=';
tokenDescription[TokenKind.AT] = '@';
tokenDescription[TokenKind.BRACKET_L] = '[';
tokenDescription[TokenKind.BRACKET_R] = ']';
tokenDescription[TokenKind.BRACE_L] = '{';
tokenDescription[TokenKind.PIPE] = '|';
tokenDescription[TokenKind.BRACE_R] = '}';
tokenDescription[TokenKind.NAME] = 'Name';
tokenDescription[TokenKind.VARIABLE] = 'Variable';
tokenDescription[TokenKind.INT] = 'Int';
tokenDescription[TokenKind.FLOAT] = 'Float';
tokenDescription[TokenKind.STRING] = 'String';

var charCodeAt = String.prototype.charCodeAt;
var slice = String.prototype.slice;

/**
 * Helper function for constructing the Token object.
 */
function makeToken(kind, start, end, value) {
  return { kind: kind, start: start, end: end, value: value };
}

function printCharCode(code) {
  return(
    // NaN/undefined represents access beyond the end of the file.
    isNaN(code) ? '<EOF>' :
    // Trust JSON for ASCII.
    code < 0x007F ? JSON.stringify(String.fromCharCode(code)) :
    // Otherwise print the escaped form.
    '"\\u' + ('00' + code.toString(16).toUpperCase()).slice(-4) + '"'
  );
}

/**
 * Gets the next token from the source starting at the given position.
 *
 * This skips over whitespace and comments until it finds the next lexable
 * token, then lexes punctuators immediately or calls the appropriate helper
 * function for more complicated tokens.
 */
function readToken(source, fromPosition) {
  var body = source.body;
  var bodyLength = body.length;

  var position = positionAfterWhitespace(body, fromPosition);

  if (position >= bodyLength) {
    return makeToken(TokenKind.EOF, position, position);
  }

  var code = charCodeAt.call(body, position);

  // SourceCharacter
  if (code < 0x0020 && code !== 0x0009 && code !== 0x000A && code !== 0x000D) {
    throw (0, _error.syntaxError)(source, position, 'Invalid character ' + printCharCode(code) + '.');
  }

  switch (code) {
    // !
    case 33:
      return makeToken(TokenKind.BANG, position, position + 1);
    // $
    case 36:
      return makeToken(TokenKind.DOLLAR, position, position + 1);
    // (
    case 40:
      return makeToken(TokenKind.PAREN_L, position, position + 1);
    // )
    case 41:
      return makeToken(TokenKind.PAREN_R, position, position + 1);
    // .
    case 46:
      if (charCodeAt.call(body, position + 1) === 46 && charCodeAt.call(body, position + 2) === 46) {
        return makeToken(TokenKind.SPREAD, position, position + 3);
      }
      break;
    // :
    case 58:
      return makeToken(TokenKind.COLON, position, position + 1);
    // =
    case 61:
      return makeToken(TokenKind.EQUALS, position, position + 1);
    // @
    case 64:
      return makeToken(TokenKind.AT, position, position + 1);
    // [
    case 91:
      return makeToken(TokenKind.BRACKET_L, position, position + 1);
    // ]
    case 93:
      return makeToken(TokenKind.BRACKET_R, position, position + 1);
    // {
    case 123:
      return makeToken(TokenKind.BRACE_L, position, position + 1);
    // |
    case 124:
      return makeToken(TokenKind.PIPE, position, position + 1);
    // }
    case 125:
      return makeToken(TokenKind.BRACE_R, position, position + 1);
    // A-Z
    case 65:case 66:case 67:case 68:case 69:case 70:case 71:case 72:
    case 73:case 74:case 75:case 76:case 77:case 78:case 79:case 80:
    case 81:case 82:case 83:case 84:case 85:case 86:case 87:case 88:
    case 89:case 90:
    // _
    case 95:
    // a-z
    case 97:case 98:case 99:case 100:case 101:case 102:case 103:case 104:
    case 105:case 106:case 107:case 108:case 109:case 110:case 111:
    case 112:case 113:case 114:case 115:case 116:case 117:case 118:
    case 119:case 120:case 121:case 122:
      return readName(source, position);
    // -
    case 45:
    // 0-9
    case 48:case 49:case 50:case 51:case 52:
    case 53:case 54:case 55:case 56:case 57:
      return readNumber(source, position, code);
    // "
    case 34:
      return readString(source, position);
  }

  throw (0, _error.syntaxError)(source, position, 'Unexpected character ' + printCharCode(code) + '.');
}

/**
 * Reads from body starting at startPosition until it finds a non-whitespace
 * or commented character, then returns the position of that character for
 * lexing.
 */
function positionAfterWhitespace(body, startPosition) {
  var bodyLength = body.length;
  var position = startPosition;
  while (position < bodyLength) {
    var code = charCodeAt.call(body, position);
    // Skip Ignored
    if (
    // BOM
    code === 0xFEFF ||
    // White Space
    code === 0x0009 || // tab
    code === 0x0020 || // space
    // Line Terminator
    code === 0x000A || // new line
    code === 0x000D || // carriage return
    // Comma
    code === 0x002C) {
      ++position;
      // Skip comments
    } else if (code === 35) {
        // #
        ++position;
        while (position < bodyLength && (code = charCodeAt.call(body, position)) !== null && (
        // SourceCharacter but not LineTerminator
        code > 0x001F || code === 0x0009) && code !== 0x000A && code !== 0x000D) {
          ++position;
        }
      } else {
        break;
      }
  }
  return position;
}

/**
 * Reads a number token from the source file, either a float
 * or an int depending on whether a decimal point appears.
 *
 * Int:   -?(0|[1-9][0-9]*)
 * Float: -?(0|[1-9][0-9]*)(\.[0-9]+)?((E|e)(+|-)?[0-9]+)?
 */
function readNumber(source, start, firstCode) {
  var code = firstCode;
  var body = source.body;
  var position = start;
  var isFloat = false;

  if (code === 45) {
    // -
    code = charCodeAt.call(body, ++position);
  }

  if (code === 48) {
    // 0
    code = charCodeAt.call(body, ++position);
    if (code >= 48 && code <= 57) {
      throw (0, _error.syntaxError)(source, position, 'Invalid number, unexpected digit after 0: ' + printCharCode(code) + '.');
    }
  } else {
    position = readDigits(source, position, code);
    code = charCodeAt.call(body, position);
  }

  if (code === 46) {
    // .
    isFloat = true;

    code = charCodeAt.call(body, ++position);
    position = readDigits(source, position, code);
    code = charCodeAt.call(body, position);
  }

  if (code === 69 || code === 101) {
    // E e
    isFloat = true;

    code = charCodeAt.call(body, ++position);
    if (code === 43 || code === 45) {
      // + -
      code = charCodeAt.call(body, ++position);
    }
    position = readDigits(source, position, code);
  }

  return makeToken(isFloat ? TokenKind.FLOAT : TokenKind.INT, start, position, slice.call(body, start, position));
}

/**
 * Returns the new position in the source after reading digits.
 */
function readDigits(source, start, firstCode) {
  var body = source.body;
  var position = start;
  var code = firstCode;
  if (code >= 48 && code <= 57) {
    // 0 - 9
    do {
      code = charCodeAt.call(body, ++position);
    } while (code >= 48 && code <= 57); // 0 - 9
    return position;
  }
  throw (0, _error.syntaxError)(source, position, 'Invalid number, expected digit but got: ' + printCharCode(code) + '.');
}

/**
 * Reads a string token from the source file.
 *
 * "([^"\\\u000A\u000D\u2028\u2029]|(\\(u[0-9a-fA-F]{4}|["\\/bfnrt])))*"
 */
function readString(source, start) {
  var body = source.body;
  var position = start + 1;
  var chunkStart = position;
  var code = 0;
  var value = '';

  while (position < body.length && (code = charCodeAt.call(body, position)) !== null &&
  // not LineTerminator
  code !== 0x000A && code !== 0x000D &&
  // not Quote (")
  code !== 34) {
    // SourceCharacter
    if (code < 0x0020 && code !== 0x0009) {
      throw (0, _error.syntaxError)(source, position, 'Invalid character within String: ' + printCharCode(code) + '.');
    }

    ++position;
    if (code === 92) {
      // \
      value += slice.call(body, chunkStart, position - 1);
      code = charCodeAt.call(body, position);
      switch (code) {
        case 34:
          value += '"';break;
        case 47:
          value += '\/';break;
        case 92:
          value += '\\';break;
        case 98:
          value += '\b';break;
        case 102:
          value += '\f';break;
        case 110:
          value += '\n';break;
        case 114:
          value += '\r';break;
        case 116:
          value += '\t';break;
        case 117:
          // u
          var charCode = uniCharCode(charCodeAt.call(body, position + 1), charCodeAt.call(body, position + 2), charCodeAt.call(body, position + 3), charCodeAt.call(body, position + 4));
          if (charCode < 0) {
            throw (0, _error.syntaxError)(source, position, 'Invalid character escape sequence: ' + ('\\u' + body.slice(position + 1, position + 5) + '.'));
          }
          value += String.fromCharCode(charCode);
          position += 4;
          break;
        default:
          throw (0, _error.syntaxError)(source, position, 'Invalid character escape sequence: \\' + String.fromCharCode(code) + '.');
      }
      ++position;
      chunkStart = position;
    }
  }

  if (code !== 34) {
    // quote (")
    throw (0, _error.syntaxError)(source, position, 'Unterminated string.');
  }

  value += slice.call(body, chunkStart, position);
  return makeToken(TokenKind.STRING, start, position + 1, value);
}

/**
 * Converts four hexidecimal chars to the integer that the
 * string represents. For example, uniCharCode('0','0','0','f')
 * will return 15, and uniCharCode('0','0','f','f') returns 255.
 *
 * Returns a negative number on error, if a char was invalid.
 *
 * This is implemented by noting that char2hex() returns -1 on error,
 * which means the result of ORing the char2hex() will also be negative.
 */
function uniCharCode(a, b, c, d) {
  return char2hex(a) << 12 | char2hex(b) << 8 | char2hex(c) << 4 | char2hex(d);
}

/**
 * Converts a hex character to its integer value.
 * '0' becomes 0, '9' becomes 9
 * 'A' becomes 10, 'F' becomes 15
 * 'a' becomes 10, 'f' becomes 15
 *
 * Returns -1 on error.
 */
function char2hex(a) {
  return a >= 48 && a <= 57 ? a - 48 : // 0-9
  a >= 65 && a <= 70 ? a - 55 : // A-F
  a >= 97 && a <= 102 ? a - 87 : // a-f
  -1;
}

/**
 * Reads an alphanumeric + underscore name from the source.
 *
 * [_A-Za-z][_0-9A-Za-z]*
 */
function readName(source, position) {
  var body = source.body;
  var bodyLength = body.length;
  var end = position + 1;
  var code = 0;
  while (end !== bodyLength && (code = charCodeAt.call(body, end)) !== null && (code === 95 || // _
  code >= 48 && code <= 57 || // 0-9
  code >= 65 && code <= 90 || // A-Z
  code >= 97 && code <= 122) // a-z
  ) {
    ++end;
  }
  return makeToken(TokenKind.NAME, position, end, slice.call(body, position, end));
}
},{"../error":3}],17:[function(require,module,exports){

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

/**
 * Represents a location in a Source.
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.getLocation = getLocation;

/**
 * Takes a Source and a UTF-8 character offset, and returns the corresponding
 * line and column as a SourceLocation.
 */

function getLocation(source, position) {
  var line = 1;
  var column = position + 1;
  var lineRegexp = /\r\n|[\n\r\u2028\u2029]/g;
  var match;
  while ((match = lineRegexp.exec(source.body)) && match.index < position) {
    line += 1;
    column = position + 1 - (match.index + match[0].length);
  }
  return { line: line, column: column };
}
},{}],18:[function(require,module,exports){
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

/**
 * Configuration options to control parser behavior
 */
Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.parse = parse;
exports.parseValue = parseValue;
exports.parseConstValue = parseConstValue;
exports.parseType = parseType;
exports.parseNamedType = parseNamedType;

var _source = require('./source');

var _error = require('../error');

var _lexer = require('./lexer');

var _kinds = require('./kinds');

/**
 * Given a GraphQL source, parses it into a Document.
 * Throws GraphQLError if a syntax error is encountered.
 */

function parse(source, options) {
  var sourceObj = source instanceof _source.Source ? source : new _source.Source(source);
  var parser = makeParser(sourceObj, options || {});
  return parseDocument(parser);
}

/**
 * Given a string containing a GraphQL value, parse the AST for that value.
 * Throws GraphQLError if a syntax error is encountered.
 *
 * This is useful within tools that operate upon GraphQL Values directly and
 * in isolation of complete GraphQL documents.
 */

function parseValue(source, options) {
  var sourceObj = source instanceof _source.Source ? source : new _source.Source(source);
  var parser = makeParser(sourceObj, options || {});
  return parseValueLiteral(parser);
}

/**
 * Converts a name lex token into a name parse node.
 */
function parseName(parser) {
  var token = expect(parser, _lexer.TokenKind.NAME);
  return {
    kind: _kinds.NAME,
    value: token.value,
    loc: loc(parser, token.start)
  };
}

// Implements the parsing rules in the Document section.

/**
 * Document : Definition+
 */
function parseDocument(parser) {
  var start = parser.token.start;

  var definitions = [];
  do {
    definitions.push(parseDefinition(parser));
  } while (!skip(parser, _lexer.TokenKind.EOF));

  return {
    kind: _kinds.DOCUMENT,
    definitions: definitions,
    loc: loc(parser, start)
  };
}

/**
 * Definition :
 *   - OperationDefinition
 *   - FragmentDefinition
 *   - TypeDefinition
 */
function parseDefinition(parser) {
  if (peek(parser, _lexer.TokenKind.BRACE_L)) {
    return parseOperationDefinition(parser);
  }

  if (peek(parser, _lexer.TokenKind.NAME)) {
    switch (parser.token.value) {
      case 'query':
      case 'mutation':
      // Note: subscription is an experimental non-spec addition.
      case 'subscription':
        return parseOperationDefinition(parser);

      case 'fragment':
        return parseFragmentDefinition(parser);

      case 'type':
      case 'interface':
      case 'union':
      case 'scalar':
      case 'enum':
      case 'input':
      case 'extend':
        return parseTypeDefinition(parser);
    }
  }

  throw unexpected(parser);
}

// Implements the parsing rules in the Operations section.

/**
 * OperationDefinition :
 *  - SelectionSet
 *  - OperationType Name? VariableDefinitions? Directives? SelectionSet
 *
 * OperationType : one of query mutation
 */
function parseOperationDefinition(parser) {
  var start = parser.token.start;
  if (peek(parser, _lexer.TokenKind.BRACE_L)) {
    return {
      kind: _kinds.OPERATION_DEFINITION,
      operation: 'query',
      name: null,
      variableDefinitions: null,
      directives: [],
      selectionSet: parseSelectionSet(parser),
      loc: loc(parser, start)
    };
  }
  var operationToken = expect(parser, _lexer.TokenKind.NAME);
  var operation = operationToken.value;
  var name;
  if (peek(parser, _lexer.TokenKind.NAME)) {
    name = parseName(parser);
  }
  return {
    kind: _kinds.OPERATION_DEFINITION,
    operation: operation,
    name: name,
    variableDefinitions: parseVariableDefinitions(parser),
    directives: parseDirectives(parser),
    selectionSet: parseSelectionSet(parser),
    loc: loc(parser, start)
  };
}

/**
 * VariableDefinitions : ( VariableDefinition+ )
 */
function parseVariableDefinitions(parser) {
  return peek(parser, _lexer.TokenKind.PAREN_L) ? many(parser, _lexer.TokenKind.PAREN_L, parseVariableDefinition, _lexer.TokenKind.PAREN_R) : [];
}

/**
 * VariableDefinition : Variable : Type DefaultValue?
 */
function parseVariableDefinition(parser) {
  var start = parser.token.start;
  return {
    kind: _kinds.VARIABLE_DEFINITION,
    variable: parseVariable(parser),
    type: (expect(parser, _lexer.TokenKind.COLON), parseType(parser)),
    defaultValue: skip(parser, _lexer.TokenKind.EQUALS) ? parseValueLiteral(parser, true) : null,
    loc: loc(parser, start)
  };
}

/**
 * Variable : $ Name
 */
function parseVariable(parser) {
  var start = parser.token.start;
  expect(parser, _lexer.TokenKind.DOLLAR);
  return {
    kind: _kinds.VARIABLE,
    name: parseName(parser),
    loc: loc(parser, start)
  };
}

/**
 * SelectionSet : { Selection+ }
 */
function parseSelectionSet(parser) {
  var start = parser.token.start;
  return {
    kind: _kinds.SELECTION_SET,
    selections: many(parser, _lexer.TokenKind.BRACE_L, parseSelection, _lexer.TokenKind.BRACE_R),
    loc: loc(parser, start)
  };
}

/**
 * Selection :
 *   - Field
 *   - FragmentSpread
 *   - InlineFragment
 */
function parseSelection(parser) {
  return peek(parser, _lexer.TokenKind.SPREAD) ? parseFragment(parser) : parseField(parser);
}

/**
 * Field : Alias? Name Arguments? Directives? SelectionSet?
 *
 * Alias : Name :
 */
function parseField(parser) {
  var start = parser.token.start;

  var nameOrAlias = parseName(parser);
  var alias;
  var name;
  if (skip(parser, _lexer.TokenKind.COLON)) {
    alias = nameOrAlias;
    name = parseName(parser);
  } else {
    alias = null;
    name = nameOrAlias;
  }

  return {
    kind: _kinds.FIELD,
    alias: alias,
    name: name,
    arguments: parseArguments(parser),
    directives: parseDirectives(parser),
    selectionSet: peek(parser, _lexer.TokenKind.BRACE_L) ? parseSelectionSet(parser) : null,
    loc: loc(parser, start)
  };
}

/**
 * Arguments : ( Argument+ )
 */
function parseArguments(parser) {
  return peek(parser, _lexer.TokenKind.PAREN_L) ? many(parser, _lexer.TokenKind.PAREN_L, parseArgument, _lexer.TokenKind.PAREN_R) : [];
}

/**
 * Argument : Name : Value
 */
function parseArgument(parser) {
  var start = parser.token.start;
  return {
    kind: _kinds.ARGUMENT,
    name: parseName(parser),
    value: (expect(parser, _lexer.TokenKind.COLON), parseValueLiteral(parser, false)),
    loc: loc(parser, start)
  };
}

// Implements the parsing rules in the Fragments section.

/**
 * Corresponds to both FragmentSpread and InlineFragment in the spec.
 *
 * FragmentSpread : ... FragmentName Directives?
 *
 * InlineFragment : ... TypeCondition? Directives? SelectionSet
 */
function parseFragment(parser) {
  var start = parser.token.start;
  expect(parser, _lexer.TokenKind.SPREAD);
  if (peek(parser, _lexer.TokenKind.NAME) && parser.token.value !== 'on') {
    return {
      kind: _kinds.FRAGMENT_SPREAD,
      name: parseFragmentName(parser),
      directives: parseDirectives(parser),
      loc: loc(parser, start)
    };
  }
  var typeCondition = null;
  if (parser.token.value === 'on') {
    advance(parser);
    typeCondition = parseNamedType(parser);
  }
  return {
    kind: _kinds.INLINE_FRAGMENT,
    typeCondition: typeCondition,
    directives: parseDirectives(parser),
    selectionSet: parseSelectionSet(parser),
    loc: loc(parser, start)
  };
}

/**
 * FragmentDefinition :
 *   - fragment FragmentName on TypeCondition Directives? SelectionSet
 *
 * TypeCondition : NamedType
 */
function parseFragmentDefinition(parser) {
  var start = parser.token.start;
  expectKeyword(parser, 'fragment');
  return {
    kind: _kinds.FRAGMENT_DEFINITION,
    name: parseFragmentName(parser),
    typeCondition: (expectKeyword(parser, 'on'), parseNamedType(parser)),
    directives: parseDirectives(parser),
    selectionSet: parseSelectionSet(parser),
    loc: loc(parser, start)
  };
}

/**
 * FragmentName : Name but not `on`
 */
function parseFragmentName(parser) {
  if (parser.token.value === 'on') {
    throw unexpected(parser);
  }
  return parseName(parser);
}

// Implements the parsing rules in the Values section.

/**
 * Value[Const] :
 *   - [~Const] Variable
 *   - IntValue
 *   - FloatValue
 *   - StringValue
 *   - BooleanValue
 *   - EnumValue
 *   - ListValue[?Const]
 *   - ObjectValue[?Const]
 *
 * BooleanValue : one of `true` `false`
 *
 * EnumValue : Name but not `true`, `false` or `null`
 */
function parseValueLiteral(parser, isConst) {
  var token = parser.token;
  switch (token.kind) {
    case _lexer.TokenKind.BRACKET_L:
      return parseList(parser, isConst);
    case _lexer.TokenKind.BRACE_L:
      return parseObject(parser, isConst);
    case _lexer.TokenKind.INT:
      advance(parser);
      return {
        kind: _kinds.INT,
        value: token.value,
        loc: loc(parser, token.start)
      };
    case _lexer.TokenKind.FLOAT:
      advance(parser);
      return {
        kind: _kinds.FLOAT,
        value: token.value,
        loc: loc(parser, token.start)
      };
    case _lexer.TokenKind.STRING:
      advance(parser);
      return {
        kind: _kinds.STRING,
        value: token.value,
        loc: loc(parser, token.start)
      };
    case _lexer.TokenKind.NAME:
      if (token.value === 'true' || token.value === 'false') {
        advance(parser);
        return {
          kind: _kinds.BOOLEAN,
          value: token.value === 'true',
          loc: loc(parser, token.start)
        };
      } else if (token.value !== 'null') {
        advance(parser);
        return {
          kind: _kinds.ENUM,
          value: token.value,
          loc: loc(parser, token.start)
        };
      }
      break;
    case _lexer.TokenKind.DOLLAR:
      if (!isConst) {
        return parseVariable(parser);
      }
      break;
  }
  throw unexpected(parser);
}

function parseConstValue(parser) {
  return parseValueLiteral(parser, true);
}

function parseValueValue(parser) {
  return parseValueLiteral(parser, false);
}

/**
 * ListValue[Const] :
 *   - [ ]
 *   - [ Value[?Const]+ ]
 */
function parseList(parser, isConst) {
  var start = parser.token.start;
  var item = isConst ? parseConstValue : parseValueValue;
  return {
    kind: _kinds.LIST,
    values: any(parser, _lexer.TokenKind.BRACKET_L, item, _lexer.TokenKind.BRACKET_R),
    loc: loc(parser, start)
  };
}

/**
 * ObjectValue[Const] :
 *   - { }
 *   - { ObjectField[?Const]+ }
 */
function parseObject(parser, isConst) {
  var start = parser.token.start;
  expect(parser, _lexer.TokenKind.BRACE_L);
  var fields = [];
  while (!skip(parser, _lexer.TokenKind.BRACE_R)) {
    fields.push(parseObjectField(parser, isConst));
  }
  return {
    kind: _kinds.OBJECT,
    fields: fields,
    loc: loc(parser, start)
  };
}

/**
 * ObjectField[Const] : Name : Value[?Const]
 */
function parseObjectField(parser, isConst) {
  var start = parser.token.start;
  return {
    kind: _kinds.OBJECT_FIELD,
    name: parseName(parser),
    value: (expect(parser, _lexer.TokenKind.COLON), parseValueLiteral(parser, isConst)),
    loc: loc(parser, start)
  };
}

// Implements the parsing rules in the Directives section.

/**
 * Directives : Directive+
 */
function parseDirectives(parser) {
  var directives = [];
  while (peek(parser, _lexer.TokenKind.AT)) {
    directives.push(parseDirective(parser));
  }
  return directives;
}

/**
 * Directive : @ Name Arguments?
 */
function parseDirective(parser) {
  var start = parser.token.start;
  expect(parser, _lexer.TokenKind.AT);
  return {
    kind: _kinds.DIRECTIVE,
    name: parseName(parser),
    arguments: parseArguments(parser),
    loc: loc(parser, start)
  };
}

// Implements the parsing rules in the Types section.

/**
 * Type :
 *   - NamedType
 *   - ListType
 *   - NonNullType
 */

function parseType(parser) {
  var start = parser.token.start;
  var type;
  if (skip(parser, _lexer.TokenKind.BRACKET_L)) {
    type = parseType(parser);
    expect(parser, _lexer.TokenKind.BRACKET_R);
    type = {
      kind: _kinds.LIST_TYPE,
      type: type,
      loc: loc(parser, start)
    };
  } else {
    type = parseNamedType(parser);
  }
  if (skip(parser, _lexer.TokenKind.BANG)) {
    return {
      kind: _kinds.NON_NULL_TYPE,
      type: type,
      loc: loc(parser, start)
    };
  }
  return type;
}

/**
 * NamedType : Name
 */

function parseNamedType(parser) {
  var start = parser.token.start;
  return {
    kind: _kinds.NAMED_TYPE,
    name: parseName(parser),
    loc: loc(parser, start)
  };
}

// Implements the parsing rules in the Type Definition section.

/**
 * TypeDefinition :
 *   - ObjectTypeDefinition
 *   - InterfaceTypeDefinition
 *   - UnionTypeDefinition
 *   - ScalarTypeDefinition
 *   - EnumTypeDefinition
 *   - InputObjectTypeDefinition
 *   - TypeExtensionDefinition
 */
function parseTypeDefinition(parser) {
  if (!peek(parser, _lexer.TokenKind.NAME)) {
    throw unexpected(parser);
  }
  switch (parser.token.value) {
    case 'type':
      return parseObjectTypeDefinition(parser);
    case 'interface':
      return parseInterfaceTypeDefinition(parser);
    case 'union':
      return parseUnionTypeDefinition(parser);
    case 'scalar':
      return parseScalarTypeDefinition(parser);
    case 'enum':
      return parseEnumTypeDefinition(parser);
    case 'input':
      return parseInputObjectTypeDefinition(parser);
    case 'extend':
      return parseTypeExtensionDefinition(parser);
    default:
      throw unexpected(parser);
  }
}

/**
 * ObjectTypeDefinition : type Name ImplementsInterfaces? { FieldDefinition+ }
 */
function parseObjectTypeDefinition(parser) {
  var start = parser.token.start;
  expectKeyword(parser, 'type');
  var name = parseName(parser);
  var interfaces = parseImplementsInterfaces(parser);
  var fields = any(parser, _lexer.TokenKind.BRACE_L, parseFieldDefinition, _lexer.TokenKind.BRACE_R);
  return {
    kind: _kinds.OBJECT_TYPE_DEFINITION,
    name: name,
    interfaces: interfaces,
    fields: fields,
    loc: loc(parser, start)
  };
}

/**
 * ImplementsInterfaces : implements NamedType+
 */
function parseImplementsInterfaces(parser) {
  var types = [];
  if (parser.token.value === 'implements') {
    advance(parser);
    do {
      types.push(parseNamedType(parser));
    } while (!peek(parser, _lexer.TokenKind.BRACE_L));
  }
  return types;
}

/**
 * FieldDefinition : Name ArgumentsDefinition? : Type
 */
function parseFieldDefinition(parser) {
  var start = parser.token.start;
  var name = parseName(parser);
  var args = parseArgumentDefs(parser);
  expect(parser, _lexer.TokenKind.COLON);
  var type = parseType(parser);
  return {
    kind: _kinds.FIELD_DEFINITION,
    name: name,
    arguments: args,
    type: type,
    loc: loc(parser, start)
  };
}

/**
 * ArgumentsDefinition : ( InputValueDefinition+ )
 */
function parseArgumentDefs(parser) {
  if (!peek(parser, _lexer.TokenKind.PAREN_L)) {
    return [];
  }
  return many(parser, _lexer.TokenKind.PAREN_L, parseInputValueDef, _lexer.TokenKind.PAREN_R);
}

/**
 * InputValueDefinition : Name : Type DefaultValue?
 */
function parseInputValueDef(parser) {
  var start = parser.token.start;
  var name = parseName(parser);
  expect(parser, _lexer.TokenKind.COLON);
  var type = parseType(parser);
  var defaultValue = null;
  if (skip(parser, _lexer.TokenKind.EQUALS)) {
    defaultValue = parseConstValue(parser);
  }
  return {
    kind: _kinds.INPUT_VALUE_DEFINITION,
    name: name,
    type: type,
    defaultValue: defaultValue,
    loc: loc(parser, start)
  };
}

/**
 * InterfaceTypeDefinition : interface Name { FieldDefinition+ }
 */
function parseInterfaceTypeDefinition(parser) {
  var start = parser.token.start;
  expectKeyword(parser, 'interface');
  var name = parseName(parser);
  var fields = any(parser, _lexer.TokenKind.BRACE_L, parseFieldDefinition, _lexer.TokenKind.BRACE_R);
  return {
    kind: _kinds.INTERFACE_TYPE_DEFINITION,
    name: name,
    fields: fields,
    loc: loc(parser, start)
  };
}

/**
 * UnionTypeDefinition : union Name = UnionMembers
 */
function parseUnionTypeDefinition(parser) {
  var start = parser.token.start;
  expectKeyword(parser, 'union');
  var name = parseName(parser);
  expect(parser, _lexer.TokenKind.EQUALS);
  var types = parseUnionMembers(parser);
  return {
    kind: _kinds.UNION_TYPE_DEFINITION,
    name: name,
    types: types,
    loc: loc(parser, start)
  };
}

/**
 * UnionMembers :
 *   - NamedType
 *   - UnionMembers | NamedType
 */
function parseUnionMembers(parser) {
  var members = [];
  do {
    members.push(parseNamedType(parser));
  } while (skip(parser, _lexer.TokenKind.PIPE));
  return members;
}

/**
 * ScalarTypeDefinition : scalar Name
 */
function parseScalarTypeDefinition(parser) {
  var start = parser.token.start;
  expectKeyword(parser, 'scalar');
  var name = parseName(parser);
  return {
    kind: _kinds.SCALAR_TYPE_DEFINITION,
    name: name,
    loc: loc(parser, start)
  };
}

/**
 * EnumTypeDefinition : enum Name { EnumValueDefinition+ }
 */
function parseEnumTypeDefinition(parser) {
  var start = parser.token.start;
  expectKeyword(parser, 'enum');
  var name = parseName(parser);
  var values = many(parser, _lexer.TokenKind.BRACE_L, parseEnumValueDefinition, _lexer.TokenKind.BRACE_R);
  return {
    kind: _kinds.ENUM_TYPE_DEFINITION,
    name: name,
    values: values,
    loc: loc(parser, start)
  };
}

/**
 * EnumValueDefinition : EnumValue
 *
 * EnumValue : Name
 */
function parseEnumValueDefinition(parser) {
  var start = parser.token.start;
  var name = parseName(parser);
  return {
    kind: _kinds.ENUM_VALUE_DEFINITION,
    name: name,
    loc: loc(parser, start)
  };
}

/**
 * InputObjectTypeDefinition : input Name { InputValueDefinition+ }
 */
function parseInputObjectTypeDefinition(parser) {
  var start = parser.token.start;
  expectKeyword(parser, 'input');
  var name = parseName(parser);
  var fields = any(parser, _lexer.TokenKind.BRACE_L, parseInputValueDef, _lexer.TokenKind.BRACE_R);
  return {
    kind: _kinds.INPUT_OBJECT_TYPE_DEFINITION,
    name: name,
    fields: fields,
    loc: loc(parser, start)
  };
}

/**
 * TypeExtensionDefinition : extend ObjectTypeDefinition
 */
function parseTypeExtensionDefinition(parser) {
  var start = parser.token.start;
  expectKeyword(parser, 'extend');
  var definition = parseObjectTypeDefinition(parser);
  return {
    kind: _kinds.TYPE_EXTENSION_DEFINITION,
    definition: definition,
    loc: loc(parser, start)
  };
}

// Core parsing utility functions

/**
 * Returns the parser object that is used to store state throughout the
 * process of parsing.
 */
function makeParser(source, options) {
  var _lexToken = (0, _lexer.lex)(source);
  return {
    _lexToken: _lexToken,
    source: source,
    options: options,
    prevEnd: 0,
    token: _lexToken()
  };
}

/**
 * Returns a location object, used to identify the place in
 * the source that created a given parsed object.
 */
function loc(parser, start) {
  if (parser.options.noLocation) {
    return null;
  }
  if (parser.options.noSource) {
    return { start: start, end: parser.prevEnd };
  }
  return { start: start, end: parser.prevEnd, source: parser.source };
}

/**
 * Moves the internal parser object to the next lexed token.
 */
function advance(parser) {
  var prevEnd = parser.token.end;
  parser.prevEnd = prevEnd;
  parser.token = parser._lexToken(prevEnd);
}

/**
 * Determines if the next token is of a given kind
 */
function peek(parser, kind) {
  return parser.token.kind === kind;
}

/**
 * If the next token is of the given kind, return true after advancing
 * the parser. Otherwise, do not change the parser state and return false.
 */
function skip(parser, kind) {
  var match = parser.token.kind === kind;
  if (match) {
    advance(parser);
  }
  return match;
}

/**
 * If the next token is of the given kind, return that token after advancing
 * the parser. Otherwise, do not change the parser state and return false.
 */
function expect(parser, kind) {
  var token = parser.token;
  if (token.kind === kind) {
    advance(parser);
    return token;
  }
  throw (0, _error.syntaxError)(parser.source, token.start, 'Expected ' + (0, _lexer.getTokenKindDesc)(kind) + ', found ' + (0, _lexer.getTokenDesc)(token));
}

/**
 * If the next token is a keyword with the given value, return that token after
 * advancing the parser. Otherwise, do not change the parser state and return
 * false.
 */
function expectKeyword(parser, value) {
  var token = parser.token;
  if (token.kind === _lexer.TokenKind.NAME && token.value === value) {
    advance(parser);
    return token;
  }
  throw (0, _error.syntaxError)(parser.source, token.start, 'Expected "' + value + '", found ' + (0, _lexer.getTokenDesc)(token));
}

/**
 * Helper function for creating an error when an unexpected lexed token
 * is encountered.
 */
function unexpected(parser, atToken) {
  var token = atToken || parser.token;
  return (0, _error.syntaxError)(parser.source, token.start, 'Unexpected ' + (0, _lexer.getTokenDesc)(token));
}

/**
 * Returns a possibly empty list of parse nodes, determined by
 * the parseFn. This list begins with a lex token of openKind
 * and ends with a lex token of closeKind. Advances the parser
 * to the next lex token after the closing token.
 */
function any(parser, openKind, parseFn, closeKind) {
  expect(parser, openKind);
  var nodes = [];
  while (!skip(parser, closeKind)) {
    nodes.push(parseFn(parser));
  }
  return nodes;
}

/**
 * Returns a non-empty list of parse nodes, determined by
 * the parseFn. This list begins with a lex token of openKind
 * and ends with a lex token of closeKind. Advances the parser
 * to the next lex token after the closing token.
 */
function many(parser, openKind, parseFn, closeKind) {
  expect(parser, openKind);
  var nodes = [parseFn(parser)];
  while (!skip(parser, closeKind)) {
    nodes.push(parseFn(parser));
  }
  return nodes;
}

/**
 * By default, the parser creates AST nodes that know the location
 * in the source that they correspond to. This configuration flag
 * disables that behavior for performance or testing.
 */

/**
 * By default, the parser creates AST nodes that contain a reference
 * to the source that they were created from. This configuration flag
 * disables that behavior for performance or testing.
 */
},{"../error":3,"./kinds":15,"./lexer":16,"./source":20}],19:[function(require,module,exports){
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.print = print;

var _visitor = require('./visitor');

/**
 * Converts an AST into a string, using one set of reasonable
 * formatting rules.
 */

function print(ast) {
  return (0, _visitor.visit)(ast, { leave: printDocASTReducer });
}

var printDocASTReducer = {
  Name: function Name(node) {
    return node.value;
  },
  Variable: function Variable(node) {
    return '$' + node.name;
  },

  // Document

  Document: function Document(node) {
    return join(node.definitions, '\n\n') + '\n';
  },

  OperationDefinition: function OperationDefinition(node) {
    var op = node.operation;
    var name = node.name;
    var defs = wrap('(', join(node.variableDefinitions, ', '), ')');
    var directives = join(node.directives, ' ');
    var selectionSet = node.selectionSet;
    return !name ? selectionSet : join([op, join([name, defs]), directives, selectionSet], ' ');
  },

  VariableDefinition: function VariableDefinition(_ref) {
    var variable = _ref.variable;
    var type = _ref.type;
    var defaultValue = _ref.defaultValue;
    return variable + ': ' + type + wrap(' = ', defaultValue);
  },

  SelectionSet: function SelectionSet(_ref2) {
    var selections = _ref2.selections;
    return block(selections);
  },

  Field: function Field(_ref3) {
    var alias = _ref3.alias;
    var name = _ref3.name;
    var args = _ref3.arguments;
    var directives = _ref3.directives;
    var selectionSet = _ref3.selectionSet;
    return join([wrap('', alias, ': ') + name + wrap('(', join(args, ', '), ')'), join(directives, ' '), selectionSet], ' ');
  },

  Argument: function Argument(_ref4) {
    var name = _ref4.name;
    var value = _ref4.value;
    return name + ': ' + value;
  },

  // Fragments

  FragmentSpread: function FragmentSpread(_ref5) {
    var name = _ref5.name;
    var directives = _ref5.directives;
    return '...' + name + wrap(' ', join(directives, ' '));
  },

  InlineFragment: function InlineFragment(_ref6) {
    var typeCondition = _ref6.typeCondition;
    var directives = _ref6.directives;
    var selectionSet = _ref6.selectionSet;
    return join(['...', wrap('on ', typeCondition), join(directives, ' '), selectionSet], ' ');
  },

  FragmentDefinition: function FragmentDefinition(_ref7) {
    var name = _ref7.name;
    var typeCondition = _ref7.typeCondition;
    var directives = _ref7.directives;
    var selectionSet = _ref7.selectionSet;
    return 'fragment ' + name + ' on ' + typeCondition + ' ' + wrap('', join(directives, ' '), ' ') + selectionSet;
  },

  // Value

  IntValue: function IntValue(_ref8) {
    var value = _ref8.value;
    return value;
  },
  FloatValue: function FloatValue(_ref9) {
    var value = _ref9.value;
    return value;
  },
  StringValue: function StringValue(_ref10) {
    var value = _ref10.value;
    return JSON.stringify(value);
  },
  BooleanValue: function BooleanValue(_ref11) {
    var value = _ref11.value;
    return JSON.stringify(value);
  },
  EnumValue: function EnumValue(_ref12) {
    var value = _ref12.value;
    return value;
  },
  ListValue: function ListValue(_ref13) {
    var values = _ref13.values;
    return '[' + join(values, ', ') + ']';
  },
  ObjectValue: function ObjectValue(_ref14) {
    var fields = _ref14.fields;
    return '{' + join(fields, ', ') + '}';
  },
  ObjectField: function ObjectField(_ref15) {
    var name = _ref15.name;
    var value = _ref15.value;
    return name + ': ' + value;
  },

  // Directive

  Directive: function Directive(_ref16) {
    var name = _ref16.name;
    var args = _ref16.arguments;
    return '@' + name + wrap('(', join(args, ', '), ')');
  },

  // Type

  NamedType: function NamedType(_ref17) {
    var name = _ref17.name;
    return name;
  },
  ListType: function ListType(_ref18) {
    var type = _ref18.type;
    return '[' + type + ']';
  },
  NonNullType: function NonNullType(_ref19) {
    var type = _ref19.type;
    return type + '!';
  },

  // Type Definitions

  ObjectTypeDefinition: function ObjectTypeDefinition(_ref20) {
    var name = _ref20.name;
    var interfaces = _ref20.interfaces;
    var fields = _ref20.fields;
    return 'type ' + name + ' ' + wrap('implements ', join(interfaces, ', '), ' ') + block(fields);
  },

  FieldDefinition: function FieldDefinition(_ref21) {
    var name = _ref21.name;
    var args = _ref21.arguments;
    var type = _ref21.type;
    return name + wrap('(', join(args, ', '), ')') + ': ' + type;
  },

  InputValueDefinition: function InputValueDefinition(_ref22) {
    var name = _ref22.name;
    var type = _ref22.type;
    var defaultValue = _ref22.defaultValue;
    return name + ': ' + type + wrap(' = ', defaultValue);
  },

  InterfaceTypeDefinition: function InterfaceTypeDefinition(_ref23) {
    var name = _ref23.name;
    var fields = _ref23.fields;
    return 'interface ' + name + ' ' + block(fields);
  },

  UnionTypeDefinition: function UnionTypeDefinition(_ref24) {
    var name = _ref24.name;
    var types = _ref24.types;
    return 'union ' + name + ' = ' + join(types, ' | ');
  },

  ScalarTypeDefinition: function ScalarTypeDefinition(_ref25) {
    var name = _ref25.name;
    return 'scalar ' + name;
  },

  EnumTypeDefinition: function EnumTypeDefinition(_ref26) {
    var name = _ref26.name;
    var values = _ref26.values;
    return 'enum ' + name + ' ' + block(values);
  },

  EnumValueDefinition: function EnumValueDefinition(_ref27) {
    var name = _ref27.name;
    return name;
  },

  InputObjectTypeDefinition: function InputObjectTypeDefinition(_ref28) {
    var name = _ref28.name;
    var fields = _ref28.fields;
    return 'input ' + name + ' ' + block(fields);
  },

  TypeExtensionDefinition: function TypeExtensionDefinition(_ref29) {
    var definition = _ref29.definition;
    return 'extend ' + definition;
  }
};

/**
 * Given maybeArray, print an empty string if it is null or empty, otherwise
 * print all items together separated by separator if provided
 */
function join(maybeArray, separator) {
  return maybeArray ? maybeArray.filter(function (x) {
    return x;
  }).join(separator || '') : '';
}

/**
 * Given maybeArray, print an empty string if it is null or empty, otherwise
 * print each item on its own line, wrapped in an indented "{ }" block.
 */
function block(maybeArray) {
  return length(maybeArray) ? indent('{\n' + join(maybeArray, '\n')) + '\n}' : '';
}

/**
 * If maybeString is not null or empty, then wrap with start and end, otherwise
 * print an empty string.
 */
function wrap(start, maybeString, end) {
  return maybeString ? start + maybeString + (end || '') : '';
}

function indent(maybeString) {
  return maybeString && maybeString.replace(/\n/g, '\n  ');
}

function length(maybeArray) {
  return maybeArray ? maybeArray.length : 0;
}
},{"./visitor":21}],20:[function(require,module,exports){

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

/**
 * A representation of source input to GraphQL. The name is optional,
 * but is mostly useful for clients who store GraphQL documents in
 * source files; for example, if the GraphQL input is in a file Foo.graphql,
 * it might be useful for name to be "Foo.graphql".
 */
'use strict';

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var Source = function Source(body, name) {
  _classCallCheck(this, Source);

  this.body = body;
  this.name = name || 'GraphQL';
};

exports.Source = Source;
},{"babel-runtime/helpers/class-call-check":34}],21:[function(require,module,exports){
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.visit = visit;
exports.visitInParallel = visitInParallel;
exports.visitWithTypeInfo = visitWithTypeInfo;
var QueryDocumentKeys = {
  Name: [],

  Document: ['definitions'],
  OperationDefinition: ['name', 'variableDefinitions', 'directives', 'selectionSet'],
  VariableDefinition: ['variable', 'type', 'defaultValue'],
  Variable: ['name'],
  SelectionSet: ['selections'],
  Field: ['alias', 'name', 'arguments', 'directives', 'selectionSet'],
  Argument: ['name', 'value'],

  FragmentSpread: ['name', 'directives'],
  InlineFragment: ['typeCondition', 'directives', 'selectionSet'],
  FragmentDefinition: ['name', 'typeCondition', 'directives', 'selectionSet'],

  IntValue: [],
  FloatValue: [],
  StringValue: [],
  BooleanValue: [],
  EnumValue: [],
  ListValue: ['values'],
  ObjectValue: ['fields'],
  ObjectField: ['name', 'value'],

  Directive: ['name', 'arguments'],

  NamedType: ['name'],
  ListType: ['type'],
  NonNullType: ['type'],

  ObjectTypeDefinition: ['name', 'interfaces', 'fields'],
  FieldDefinition: ['name', 'arguments', 'type'],
  InputValueDefinition: ['name', 'type', 'defaultValue'],
  InterfaceTypeDefinition: ['name', 'fields'],
  UnionTypeDefinition: ['name', 'types'],
  ScalarTypeDefinition: ['name'],
  EnumTypeDefinition: ['name', 'values'],
  EnumValueDefinition: ['name'],
  InputObjectTypeDefinition: ['name', 'fields'],
  TypeExtensionDefinition: ['definition']
};

exports.QueryDocumentKeys = QueryDocumentKeys;
var BREAK = {};

exports.BREAK = BREAK;
/**
 * visit() will walk through an AST using a depth first traversal, calling
 * the visitor's enter function at each node in the traversal, and calling the
 * leave function after visiting that node and all of its child nodes.
 *
 * By returning different values from the enter and leave functions, the
 * behavior of the visitor can be altered, including skipping over a sub-tree of
 * the AST (by returning false), editing the AST by returning a value or null
 * to remove the value, or to stop the whole traversal by returning BREAK.
 *
 * When using visit() to edit an AST, the original AST will not be modified, and
 * a new version of the AST with the changes applied will be returned from the
 * visit function.
 *
 *     var editedAST = visit(ast, {
 *       enter(node, key, parent, path, ancestors) {
 *         // @return
 *         //   undefined: no action
 *         //   false: skip visiting this node
 *         //   visitor.BREAK: stop visiting altogether
 *         //   null: delete this node
 *         //   any value: replace this node with the returned value
 *       },
 *       leave(node, key, parent, path, ancestors) {
 *         // @return
 *         //   undefined: no action
 *         //   false: no action
 *         //   visitor.BREAK: stop visiting altogether
 *         //   null: delete this node
 *         //   any value: replace this node with the returned value
 *       }
 *     });
 *
 * Alternatively to providing enter() and leave() functions, a visitor can
 * instead provide functions named the same as the kinds of AST nodes, or
 * enter/leave visitors at a named key, leading to four permutations of
 * visitor API:
 *
 * 1) Named visitors triggered when entering a node a specific kind.
 *
 *     visit(ast, {
 *       Kind(node) {
 *         // enter the "Kind" node
 *       }
 *     })
 *
 * 2) Named visitors that trigger upon entering and leaving a node of
 *    a specific kind.
 *
 *     visit(ast, {
 *       Kind: {
 *         enter(node) {
 *           // enter the "Kind" node
 *         }
 *         leave(node) {
 *           // leave the "Kind" node
 *         }
 *       }
 *     })
 *
 * 3) Generic visitors that trigger upon entering and leaving any node.
 *
 *     visit(ast, {
 *       enter(node) {
 *         // enter any node
 *       },
 *       leave(node) {
 *         // leave any node
 *       }
 *     })
 *
 * 4) Parallel visitors for entering and leaving nodes of a specific kind.
 *
 *     visit(ast, {
 *       enter: {
 *         Kind(node) {
 *           // enter the "Kind" node
 *         }
 *       },
 *       leave: {
 *         Kind(node) {
 *           // leave the "Kind" node
 *         }
 *       }
 *     })
 */

function visit(root, visitor, keyMap) {
  var visitorKeys = keyMap || QueryDocumentKeys;

  var stack;
  var inArray = Array.isArray(root);
  var keys = [root];
  var index = -1;
  var edits = [];
  var parent;
  var path = [];
  var ancestors = [];
  var newRoot = root;

  do {
    index++;
    var isLeaving = index === keys.length;
    var key;
    var node;
    var isEdited = isLeaving && edits.length !== 0;
    if (isLeaving) {
      key = ancestors.length === 0 ? undefined : path.pop();
      node = parent;
      parent = ancestors.pop();
      if (isEdited) {
        if (inArray) {
          node = node.slice();
        } else {
          var clone = {};
          for (var k in node) {
            if (node.hasOwnProperty(k)) {
              clone[k] = node[k];
            }
          }
          node = clone;
        }
        var editOffset = 0;
        for (var ii = 0; ii < edits.length; ii++) {
          var _edits$ii = _slicedToArray(edits[ii], 2);

          var editKey = _edits$ii[0];
          var editValue = _edits$ii[1];

          if (inArray) {
            editKey -= editOffset;
          }
          if (inArray && editValue === null) {
            node.splice(editKey, 1);
            editOffset++;
          } else {
            node[editKey] = editValue;
          }
        }
      }
      index = stack.index;
      keys = stack.keys;
      edits = stack.edits;
      inArray = stack.inArray;
      stack = stack.prev;
    } else {
      key = parent ? inArray ? index : keys[index] : undefined;
      node = parent ? parent[key] : newRoot;
      if (node === null || node === undefined) {
        continue;
      }
      if (parent) {
        path.push(key);
      }
    }

    var result = undefined;
    if (!Array.isArray(node)) {
      if (!isNode(node)) {
        throw new Error('Invalid AST Node: ' + JSON.stringify(node));
      }
      var visitFn = getVisitFn(visitor, node.kind, isLeaving);
      if (visitFn) {
        result = visitFn.call(visitor, node, key, parent, path, ancestors);

        if (result === BREAK) {
          break;
        }

        if (result === false) {
          if (!isLeaving) {
            path.pop();
            continue;
          }
        } else if (result !== undefined) {
          edits.push([key, result]);
          if (!isLeaving) {
            if (isNode(result)) {
              node = result;
            } else {
              path.pop();
              continue;
            }
          }
        }
      }
    }

    if (result === undefined && isEdited) {
      edits.push([key, node]);
    }

    if (!isLeaving) {
      stack = { inArray: inArray, index: index, keys: keys, edits: edits, prev: stack };
      inArray = Array.isArray(node);
      keys = inArray ? node : visitorKeys[node.kind] || [];
      index = -1;
      edits = [];
      if (parent) {
        ancestors.push(parent);
      }
      parent = node;
    }
  } while (stack !== undefined);

  if (edits.length !== 0) {
    newRoot = edits[0][1];
  }

  return newRoot;
}

function isNode(maybeNode) {
  return maybeNode && typeof maybeNode.kind === 'string';
}

/**
 * Creates a new visitor instance which delegates to many visitors to run in
 * parallel. Each visitor will be visited for each node before moving on.
 *
 * If a prior visitor edits a node, no following visitors will see that node.
 */

function visitInParallel(visitors) {
  var skipping = new Array(visitors.length);

  return {
    enter: function enter(node) {
      for (var i = 0; i < visitors.length; i++) {
        if (!skipping[i]) {
          var fn = getVisitFn(visitors[i], node.kind, /* isLeaving */false);
          if (fn) {
            var result = fn.apply(visitors[i], arguments);
            if (result === false) {
              skipping[i] = node;
            } else if (result === BREAK) {
              skipping[i] = BREAK;
            } else if (result !== undefined) {
              return result;
            }
          }
        }
      }
    },
    leave: function leave(node) {
      for (var i = 0; i < visitors.length; i++) {
        if (!skipping[i]) {
          var fn = getVisitFn(visitors[i], node.kind, /* isLeaving */true);
          if (fn) {
            var result = fn.apply(visitors[i], arguments);
            if (result === BREAK) {
              skipping[i] = BREAK;
            } else if (result !== undefined && result !== false) {
              return result;
            }
          }
        } else if (skipping[i] === node) {
          skipping[i] = null;
        }
      }
    }
  };
}

/**
 * Creates a new visitor instance which maintains a provided TypeInfo instance
 * along with visiting visitor.
 */

function visitWithTypeInfo(typeInfo, visitor) {
  return {
    enter: function enter(node) {
      typeInfo.enter(node);
      var fn = getVisitFn(visitor, node.kind, /* isLeaving */false);
      if (fn) {
        var result = fn.apply(visitor, arguments);
        if (result !== undefined) {
          typeInfo.leave(node);
          if (isNode(result)) {
            typeInfo.enter(result);
          }
        }
        return result;
      }
    },
    leave: function leave(node) {
      var fn = getVisitFn(visitor, node.kind, /* isLeaving */true);
      var result = undefined;
      if (fn) {
        result = fn.apply(visitor, arguments);
      }
      typeInfo.leave(node);
      return result;
    }
  };
}

/**
 * Given a visitor instance, if it is leaving or not, and a node kind, return
 * the function the visitor runtime should call.
 */
function getVisitFn(visitor, kind, isLeaving) {
  var kindVisitor = visitor[kind];
  if (kindVisitor) {
    if (!isLeaving && typeof kindVisitor === 'function') {
      // { Kind() {} }
      return kindVisitor;
    }
    var kindSpecificVisitor = isLeaving ? kindVisitor.leave : kindVisitor.enter;
    if (typeof kindSpecificVisitor === 'function') {
      // { Kind: { enter() {}, leave() {} } }
      return kindSpecificVisitor;
    }
  } else {
    var specificVisitor = isLeaving ? visitor.leave : visitor.enter;
    if (specificVisitor) {
      if (typeof specificVisitor === 'function') {
        // { enter() {}, leave() {} }
        return specificVisitor;
      }
      var specificKindVisitor = specificVisitor[kind];
      if (typeof specificKindVisitor === 'function') {
        // { enter: { Kind() {} }, leave: { Kind() {} } }
        return specificKindVisitor;
      }
    }
  }
}
},{"babel-runtime/helpers/sliced-to-array":41}],22:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/array/from"), __esModule: true };
},{"core-js/library/fn/array/from":43}],23:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/get-iterator"), __esModule: true };
},{"core-js/library/fn/get-iterator":44}],24:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/is-iterable"), __esModule: true };
},{"core-js/library/fn/is-iterable":45}],25:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/map"), __esModule: true };
},{"core-js/library/fn/map":46}],26:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/assign"), __esModule: true };
},{"core-js/library/fn/object/assign":47}],27:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/create"), __esModule: true };
},{"core-js/library/fn/object/create":48}],28:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/define-property"), __esModule: true };
},{"core-js/library/fn/object/define-property":49}],29:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/get-own-property-descriptor"), __esModule: true };
},{"core-js/library/fn/object/get-own-property-descriptor":50}],30:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/keys"), __esModule: true };
},{"core-js/library/fn/object/keys":51}],31:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/set-prototype-of"), __esModule: true };
},{"core-js/library/fn/object/set-prototype-of":52}],32:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/promise"), __esModule: true };
},{"core-js/library/fn/promise":53}],33:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/set"), __esModule: true };
},{"core-js/library/fn/set":54}],34:[function(require,module,exports){
"use strict";

exports["default"] = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

exports.__esModule = true;
},{}],35:[function(require,module,exports){
"use strict";

var _Object$defineProperty = require("babel-runtime/core-js/object/define-property")["default"];

exports["default"] = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;

      _Object$defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

exports.__esModule = true;
},{"babel-runtime/core-js/object/define-property":28}],36:[function(require,module,exports){
"use strict";

var _Object$assign = require("babel-runtime/core-js/object/assign")["default"];

exports["default"] = _Object$assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

exports.__esModule = true;
},{"babel-runtime/core-js/object/assign":26}],37:[function(require,module,exports){
"use strict";

var _Object$getOwnPropertyDescriptor = require("babel-runtime/core-js/object/get-own-property-descriptor")["default"];

exports["default"] = function get(_x, _x2, _x3) {
  var _again = true;

  _function: while (_again) {
    var object = _x,
        property = _x2,
        receiver = _x3;
    _again = false;
    if (object === null) object = Function.prototype;

    var desc = _Object$getOwnPropertyDescriptor(object, property);

    if (desc === undefined) {
      var parent = Object.getPrototypeOf(object);

      if (parent === null) {
        return undefined;
      } else {
        _x = parent;
        _x2 = property;
        _x3 = receiver;
        _again = true;
        desc = parent = undefined;
        continue _function;
      }
    } else if ("value" in desc) {
      return desc.value;
    } else {
      var getter = desc.get;

      if (getter === undefined) {
        return undefined;
      }

      return getter.call(receiver);
    }
  }
};

exports.__esModule = true;
},{"babel-runtime/core-js/object/get-own-property-descriptor":29}],38:[function(require,module,exports){
"use strict";

var _Object$create = require("babel-runtime/core-js/object/create")["default"];

var _Object$setPrototypeOf = require("babel-runtime/core-js/object/set-prototype-of")["default"];

exports["default"] = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = _Object$create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _Object$setPrototypeOf ? _Object$setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

exports.__esModule = true;
},{"babel-runtime/core-js/object/create":27,"babel-runtime/core-js/object/set-prototype-of":31}],39:[function(require,module,exports){
"use strict";

exports["default"] = function (obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
};

exports.__esModule = true;
},{}],40:[function(require,module,exports){
"use strict";

exports["default"] = function (obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};

    if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
      }
    }

    newObj["default"] = obj;
    return newObj;
  }
};

exports.__esModule = true;
},{}],41:[function(require,module,exports){
"use strict";

var _getIterator = require("babel-runtime/core-js/get-iterator")["default"];

var _isIterable = require("babel-runtime/core-js/is-iterable")["default"];

exports["default"] = (function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = _getIterator(arr), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (_isIterable(Object(arr))) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
})();

exports.__esModule = true;
},{"babel-runtime/core-js/get-iterator":23,"babel-runtime/core-js/is-iterable":24}],42:[function(require,module,exports){
"use strict";

var _Array$from = require("babel-runtime/core-js/array/from")["default"];

exports["default"] = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return _Array$from(arr);
  }
};

exports.__esModule = true;
},{"babel-runtime/core-js/array/from":22}],43:[function(require,module,exports){
require('../../modules/es6.string.iterator');
require('../../modules/es6.array.from');
module.exports = require('../../modules/$.core').Array.from;
},{"../../modules/$.core":63,"../../modules/es6.array.from":111,"../../modules/es6.string.iterator":121}],44:[function(require,module,exports){
require('../modules/web.dom.iterable');
require('../modules/es6.string.iterator');
module.exports = require('../modules/core.get-iterator');
},{"../modules/core.get-iterator":109,"../modules/es6.string.iterator":121,"../modules/web.dom.iterable":124}],45:[function(require,module,exports){
require('../modules/web.dom.iterable');
require('../modules/es6.string.iterator');
module.exports = require('../modules/core.is-iterable');
},{"../modules/core.is-iterable":110,"../modules/es6.string.iterator":121,"../modules/web.dom.iterable":124}],46:[function(require,module,exports){
require('../modules/es6.object.to-string');
require('../modules/es6.string.iterator');
require('../modules/web.dom.iterable');
require('../modules/es6.map');
require('../modules/es7.map.to-json');
module.exports = require('../modules/$.core').Map;
},{"../modules/$.core":63,"../modules/es6.map":113,"../modules/es6.object.to-string":118,"../modules/es6.string.iterator":121,"../modules/es7.map.to-json":122,"../modules/web.dom.iterable":124}],47:[function(require,module,exports){
require('../../modules/es6.object.assign');
module.exports = require('../../modules/$.core').Object.assign;
},{"../../modules/$.core":63,"../../modules/es6.object.assign":114}],48:[function(require,module,exports){
var $ = require('../../modules/$');
module.exports = function create(P, D){
  return $.create(P, D);
};
},{"../../modules/$":85}],49:[function(require,module,exports){
var $ = require('../../modules/$');
module.exports = function defineProperty(it, key, desc){
  return $.setDesc(it, key, desc);
};
},{"../../modules/$":85}],50:[function(require,module,exports){
var $ = require('../../modules/$');
require('../../modules/es6.object.get-own-property-descriptor');
module.exports = function getOwnPropertyDescriptor(it, key){
  return $.getDesc(it, key);
};
},{"../../modules/$":85,"../../modules/es6.object.get-own-property-descriptor":115}],51:[function(require,module,exports){
require('../../modules/es6.object.keys');
module.exports = require('../../modules/$.core').Object.keys;
},{"../../modules/$.core":63,"../../modules/es6.object.keys":116}],52:[function(require,module,exports){
require('../../modules/es6.object.set-prototype-of');
module.exports = require('../../modules/$.core').Object.setPrototypeOf;
},{"../../modules/$.core":63,"../../modules/es6.object.set-prototype-of":117}],53:[function(require,module,exports){
require('../modules/es6.object.to-string');
require('../modules/es6.string.iterator');
require('../modules/web.dom.iterable');
require('../modules/es6.promise');
module.exports = require('../modules/$.core').Promise;
},{"../modules/$.core":63,"../modules/es6.object.to-string":118,"../modules/es6.promise":119,"../modules/es6.string.iterator":121,"../modules/web.dom.iterable":124}],54:[function(require,module,exports){
require('../modules/es6.object.to-string');
require('../modules/es6.string.iterator');
require('../modules/web.dom.iterable');
require('../modules/es6.set');
require('../modules/es7.set.to-json');
module.exports = require('../modules/$.core').Set;
},{"../modules/$.core":63,"../modules/es6.object.to-string":118,"../modules/es6.set":120,"../modules/es6.string.iterator":121,"../modules/es7.set.to-json":123,"../modules/web.dom.iterable":124}],55:[function(require,module,exports){
module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};
},{}],56:[function(require,module,exports){
module.exports = function(){ /* empty */ };
},{}],57:[function(require,module,exports){
var isObject = require('./$.is-object');
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};
},{"./$.is-object":78}],58:[function(require,module,exports){
// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = require('./$.cof')
  , TAG = require('./$.wks')('toStringTag')
  // ES3 wrong here
  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

module.exports = function(it){
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = (O = Object(it))[TAG]) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};
},{"./$.cof":59,"./$.wks":107}],59:[function(require,module,exports){
var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};
},{}],60:[function(require,module,exports){
'use strict';
var $            = require('./$')
  , hide         = require('./$.hide')
  , redefineAll  = require('./$.redefine-all')
  , ctx          = require('./$.ctx')
  , strictNew    = require('./$.strict-new')
  , defined      = require('./$.defined')
  , forOf        = require('./$.for-of')
  , $iterDefine  = require('./$.iter-define')
  , step         = require('./$.iter-step')
  , ID           = require('./$.uid')('id')
  , $has         = require('./$.has')
  , isObject     = require('./$.is-object')
  , setSpecies   = require('./$.set-species')
  , DESCRIPTORS  = require('./$.descriptors')
  , isExtensible = Object.isExtensible || isObject
  , SIZE         = DESCRIPTORS ? '_s' : 'size'
  , id           = 0;

var fastKey = function(it, create){
  // return primitive with prefix
  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if(!$has(it, ID)){
    // can't set id to frozen object
    if(!isExtensible(it))return 'F';
    // not necessary to add id
    if(!create)return 'E';
    // add missing object id
    hide(it, ID, ++id);
  // return object id with prefix
  } return 'O' + it[ID];
};

var getEntry = function(that, key){
  // fast case
  var index = fastKey(key), entry;
  if(index !== 'F')return that._i[index];
  // frozen object case
  for(entry = that._f; entry; entry = entry.n){
    if(entry.k == key)return entry;
  }
};

module.exports = {
  getConstructor: function(wrapper, NAME, IS_MAP, ADDER){
    var C = wrapper(function(that, iterable){
      strictNew(that, C, NAME);
      that._i = $.create(null); // index
      that._f = undefined;      // first entry
      that._l = undefined;      // last entry
      that[SIZE] = 0;           // size
      if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear(){
        for(var that = this, data = that._i, entry = that._f; entry; entry = entry.n){
          entry.r = true;
          if(entry.p)entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function(key){
        var that  = this
          , entry = getEntry(that, key);
        if(entry){
          var next = entry.n
            , prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if(prev)prev.n = next;
          if(next)next.p = prev;
          if(that._f == entry)that._f = next;
          if(that._l == entry)that._l = prev;
          that[SIZE]--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /*, that = undefined */){
        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3)
          , entry;
        while(entry = entry ? entry.n : this._f){
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while(entry && entry.r)entry = entry.p;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key){
        return !!getEntry(this, key);
      }
    });
    if(DESCRIPTORS)$.setDesc(C.prototype, 'size', {
      get: function(){
        return defined(this[SIZE]);
      }
    });
    return C;
  },
  def: function(that, key, value){
    var entry = getEntry(that, key)
      , prev, index;
    // change existing entry
    if(entry){
      entry.v = value;
    // create new entry
    } else {
      that._l = entry = {
        i: index = fastKey(key, true), // <- index
        k: key,                        // <- key
        v: value,                      // <- value
        p: prev = that._l,             // <- previous entry
        n: undefined,                  // <- next entry
        r: false                       // <- removed
      };
      if(!that._f)that._f = entry;
      if(prev)prev.n = entry;
      that[SIZE]++;
      // add to index
      if(index !== 'F')that._i[index] = entry;
    } return that;
  },
  getEntry: getEntry,
  setStrong: function(C, NAME, IS_MAP){
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    $iterDefine(C, NAME, function(iterated, kind){
      this._t = iterated;  // target
      this._k = kind;      // kind
      this._l = undefined; // previous
    }, function(){
      var that  = this
        , kind  = that._k
        , entry = that._l;
      // revert to the last existing entry
      while(entry && entry.r)entry = entry.p;
      // get next entry
      if(!that._t || !(that._l = entry = entry ? entry.n : that._t._f)){
        // or finish the iteration
        that._t = undefined;
        return step(1);
      }
      // return step by kind
      if(kind == 'keys'  )return step(0, entry.k);
      if(kind == 'values')return step(0, entry.v);
      return step(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values' , !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    setSpecies(NAME);
  }
};
},{"./$":85,"./$.ctx":64,"./$.defined":65,"./$.descriptors":66,"./$.for-of":70,"./$.has":72,"./$.hide":73,"./$.is-object":78,"./$.iter-define":81,"./$.iter-step":83,"./$.redefine-all":91,"./$.set-species":95,"./$.strict-new":99,"./$.uid":106}],61:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var forOf   = require('./$.for-of')
  , classof = require('./$.classof');
module.exports = function(NAME){
  return function toJSON(){
    if(classof(this) != NAME)throw TypeError(NAME + "#toJSON isn't generic");
    var arr = [];
    forOf(this, false, arr.push, arr);
    return arr;
  };
};
},{"./$.classof":58,"./$.for-of":70}],62:[function(require,module,exports){
'use strict';
var $              = require('./$')
  , global         = require('./$.global')
  , $export        = require('./$.export')
  , fails          = require('./$.fails')
  , hide           = require('./$.hide')
  , redefineAll    = require('./$.redefine-all')
  , forOf          = require('./$.for-of')
  , strictNew      = require('./$.strict-new')
  , isObject       = require('./$.is-object')
  , setToStringTag = require('./$.set-to-string-tag')
  , DESCRIPTORS    = require('./$.descriptors');

module.exports = function(NAME, wrapper, methods, common, IS_MAP, IS_WEAK){
  var Base  = global[NAME]
    , C     = Base
    , ADDER = IS_MAP ? 'set' : 'add'
    , proto = C && C.prototype
    , O     = {};
  if(!DESCRIPTORS || typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function(){
    new C().entries().next();
  }))){
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    redefineAll(C.prototype, methods);
  } else {
    C = wrapper(function(target, iterable){
      strictNew(target, C, NAME);
      target._c = new Base;
      if(iterable != undefined)forOf(iterable, IS_MAP, target[ADDER], target);
    });
    $.each.call('add,clear,delete,forEach,get,has,set,keys,values,entries'.split(','),function(KEY){
      var IS_ADDER = KEY == 'add' || KEY == 'set';
      if(KEY in proto && !(IS_WEAK && KEY == 'clear'))hide(C.prototype, KEY, function(a, b){
        if(!IS_ADDER && IS_WEAK && !isObject(a))return KEY == 'get' ? undefined : false;
        var result = this._c[KEY](a === 0 ? 0 : a, b);
        return IS_ADDER ? this : result;
      });
    });
    if('size' in proto)$.setDesc(C.prototype, 'size', {
      get: function(){
        return this._c.size;
      }
    });
  }

  setToStringTag(C, NAME);

  O[NAME] = C;
  $export($export.G + $export.W + $export.F, O);

  if(!IS_WEAK)common.setStrong(C, NAME, IS_MAP);

  return C;
};
},{"./$":85,"./$.descriptors":66,"./$.export":68,"./$.fails":69,"./$.for-of":70,"./$.global":71,"./$.hide":73,"./$.is-object":78,"./$.redefine-all":91,"./$.set-to-string-tag":96,"./$.strict-new":99}],63:[function(require,module,exports){
var core = module.exports = {version: '1.2.6'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
},{}],64:[function(require,module,exports){
// optional / simple context binding
var aFunction = require('./$.a-function');
module.exports = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};
},{"./$.a-function":55}],65:[function(require,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};
},{}],66:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('./$.fails')(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./$.fails":69}],67:[function(require,module,exports){
var isObject = require('./$.is-object')
  , document = require('./$.global').document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};
},{"./$.global":71,"./$.is-object":78}],68:[function(require,module,exports){
var global    = require('./$.global')
  , core      = require('./$.core')
  , ctx       = require('./$.ctx')
  , PROTOTYPE = 'prototype';

var $export = function(type, name, source){
  var IS_FORCED = type & $export.F
    , IS_GLOBAL = type & $export.G
    , IS_STATIC = type & $export.S
    , IS_PROTO  = type & $export.P
    , IS_BIND   = type & $export.B
    , IS_WRAP   = type & $export.W
    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
    , key, own, out;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && key in target;
    if(own && key in exports)continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function(C){
      var F = function(param){
        return this instanceof C ? new C(param) : C(param);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    if(IS_PROTO)(exports[PROTOTYPE] || (exports[PROTOTYPE] = {}))[key] = out;
  }
};
// type bitmap
$export.F = 1;  // forced
$export.G = 2;  // global
$export.S = 4;  // static
$export.P = 8;  // proto
$export.B = 16; // bind
$export.W = 32; // wrap
module.exports = $export;
},{"./$.core":63,"./$.ctx":64,"./$.global":71}],69:[function(require,module,exports){
module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};
},{}],70:[function(require,module,exports){
var ctx         = require('./$.ctx')
  , call        = require('./$.iter-call')
  , isArrayIter = require('./$.is-array-iter')
  , anObject    = require('./$.an-object')
  , toLength    = require('./$.to-length')
  , getIterFn   = require('./core.get-iterator-method');
module.exports = function(iterable, entries, fn, that){
  var iterFn = getIterFn(iterable)
    , f      = ctx(fn, that, entries ? 2 : 1)
    , index  = 0
    , length, step, iterator;
  if(typeof iterFn != 'function')throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if(isArrayIter(iterFn))for(length = toLength(iterable.length); length > index; index++){
    entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
  } else for(iterator = iterFn.call(iterable); !(step = iterator.next()).done; ){
    call(iterator, f, step.value, entries);
  }
};
},{"./$.an-object":57,"./$.ctx":64,"./$.is-array-iter":77,"./$.iter-call":79,"./$.to-length":104,"./core.get-iterator-method":108}],71:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
},{}],72:[function(require,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};
},{}],73:[function(require,module,exports){
var $          = require('./$')
  , createDesc = require('./$.property-desc');
module.exports = require('./$.descriptors') ? function(object, key, value){
  return $.setDesc(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};
},{"./$":85,"./$.descriptors":66,"./$.property-desc":90}],74:[function(require,module,exports){
module.exports = require('./$.global').document && document.documentElement;
},{"./$.global":71}],75:[function(require,module,exports){
// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function(fn, args, that){
  var un = that === undefined;
  switch(args.length){
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return              fn.apply(that, args);
};
},{}],76:[function(require,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./$.cof');
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};
},{"./$.cof":59}],77:[function(require,module,exports){
// check on default Array iterator
var Iterators  = require('./$.iterators')
  , ITERATOR   = require('./$.wks')('iterator')
  , ArrayProto = Array.prototype;

module.exports = function(it){
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};
},{"./$.iterators":84,"./$.wks":107}],78:[function(require,module,exports){
module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};
},{}],79:[function(require,module,exports){
// call something on iterator step with safe closing on error
var anObject = require('./$.an-object');
module.exports = function(iterator, fn, value, entries){
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch(e){
    var ret = iterator['return'];
    if(ret !== undefined)anObject(ret.call(iterator));
    throw e;
  }
};
},{"./$.an-object":57}],80:[function(require,module,exports){
'use strict';
var $              = require('./$')
  , descriptor     = require('./$.property-desc')
  , setToStringTag = require('./$.set-to-string-tag')
  , IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
require('./$.hide')(IteratorPrototype, require('./$.wks')('iterator'), function(){ return this; });

module.exports = function(Constructor, NAME, next){
  Constructor.prototype = $.create(IteratorPrototype, {next: descriptor(1, next)});
  setToStringTag(Constructor, NAME + ' Iterator');
};
},{"./$":85,"./$.hide":73,"./$.property-desc":90,"./$.set-to-string-tag":96,"./$.wks":107}],81:[function(require,module,exports){
'use strict';
var LIBRARY        = require('./$.library')
  , $export        = require('./$.export')
  , redefine       = require('./$.redefine')
  , hide           = require('./$.hide')
  , has            = require('./$.has')
  , Iterators      = require('./$.iterators')
  , $iterCreate    = require('./$.iter-create')
  , setToStringTag = require('./$.set-to-string-tag')
  , getProto       = require('./$').getProto
  , ITERATOR       = require('./$.wks')('iterator')
  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
  , FF_ITERATOR    = '@@iterator'
  , KEYS           = 'keys'
  , VALUES         = 'values';

var returnThis = function(){ return this; };

module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
  $iterCreate(Constructor, NAME, next);
  var getMethod = function(kind){
    if(!BUGGY && kind in proto)return proto[kind];
    switch(kind){
      case KEYS: return function keys(){ return new Constructor(this, kind); };
      case VALUES: return function values(){ return new Constructor(this, kind); };
    } return function entries(){ return new Constructor(this, kind); };
  };
  var TAG        = NAME + ' Iterator'
    , DEF_VALUES = DEFAULT == VALUES
    , VALUES_BUG = false
    , proto      = Base.prototype
    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , $default   = $native || getMethod(DEFAULT)
    , methods, key;
  // Fix native
  if($native){
    var IteratorPrototype = getProto($default.call(new Base));
    // Set @@toStringTag to native iterators
    setToStringTag(IteratorPrototype, TAG, true);
    // FF fix
    if(!LIBRARY && has(proto, FF_ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
    // fix Array#{values, @@iterator}.name in V8 / FF
    if(DEF_VALUES && $native.name !== VALUES){
      VALUES_BUG = true;
      $default = function values(){ return $native.call(this); };
    }
  }
  // Define iterator
  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG]  = returnThis;
  if(DEFAULT){
    methods = {
      values:  DEF_VALUES  ? $default : getMethod(VALUES),
      keys:    IS_SET      ? $default : getMethod(KEYS),
      entries: !DEF_VALUES ? $default : getMethod('entries')
    };
    if(FORCED)for(key in methods){
      if(!(key in proto))redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};
},{"./$":85,"./$.export":68,"./$.has":72,"./$.hide":73,"./$.iter-create":80,"./$.iterators":84,"./$.library":86,"./$.redefine":92,"./$.set-to-string-tag":96,"./$.wks":107}],82:[function(require,module,exports){
var ITERATOR     = require('./$.wks')('iterator')
  , SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function(){ SAFE_CLOSING = true; };
  Array.from(riter, function(){ throw 2; });
} catch(e){ /* empty */ }

module.exports = function(exec, skipClosing){
  if(!skipClosing && !SAFE_CLOSING)return false;
  var safe = false;
  try {
    var arr  = [7]
      , iter = arr[ITERATOR]();
    iter.next = function(){ safe = true; };
    arr[ITERATOR] = function(){ return iter; };
    exec(arr);
  } catch(e){ /* empty */ }
  return safe;
};
},{"./$.wks":107}],83:[function(require,module,exports){
module.exports = function(done, value){
  return {value: value, done: !!done};
};
},{}],84:[function(require,module,exports){
module.exports = {};
},{}],85:[function(require,module,exports){
var $Object = Object;
module.exports = {
  create:     $Object.create,
  getProto:   $Object.getPrototypeOf,
  isEnum:     {}.propertyIsEnumerable,
  getDesc:    $Object.getOwnPropertyDescriptor,
  setDesc:    $Object.defineProperty,
  setDescs:   $Object.defineProperties,
  getKeys:    $Object.keys,
  getNames:   $Object.getOwnPropertyNames,
  getSymbols: $Object.getOwnPropertySymbols,
  each:       [].forEach
};
},{}],86:[function(require,module,exports){
module.exports = true;
},{}],87:[function(require,module,exports){
var global    = require('./$.global')
  , macrotask = require('./$.task').set
  , Observer  = global.MutationObserver || global.WebKitMutationObserver
  , process   = global.process
  , Promise   = global.Promise
  , isNode    = require('./$.cof')(process) == 'process'
  , head, last, notify;

var flush = function(){
  var parent, domain, fn;
  if(isNode && (parent = process.domain)){
    process.domain = null;
    parent.exit();
  }
  while(head){
    domain = head.domain;
    fn     = head.fn;
    if(domain)domain.enter();
    fn(); // <- currently we use it only for Promise - try / catch not required
    if(domain)domain.exit();
    head = head.next;
  } last = undefined;
  if(parent)parent.enter();
};

// Node.js
if(isNode){
  notify = function(){
    process.nextTick(flush);
  };
// browsers with MutationObserver
} else if(Observer){
  var toggle = 1
    , node   = document.createTextNode('');
  new Observer(flush).observe(node, {characterData: true}); // eslint-disable-line no-new
  notify = function(){
    node.data = toggle = -toggle;
  };
// environments with maybe non-completely correct, but existent Promise
} else if(Promise && Promise.resolve){
  notify = function(){
    Promise.resolve().then(flush);
  };
// for other environments - macrotask based on:
// - setImmediate
// - MessageChannel
// - window.postMessag
// - onreadystatechange
// - setTimeout
} else {
  notify = function(){
    // strange IE + webpack dev server bug - use .call(global)
    macrotask.call(global, flush);
  };
}

module.exports = function asap(fn){
  var task = {fn: fn, next: undefined, domain: isNode && process.domain};
  if(last)last.next = task;
  if(!head){
    head = task;
    notify();
  } last = task;
};
},{"./$.cof":59,"./$.global":71,"./$.task":101}],88:[function(require,module,exports){
// 19.1.2.1 Object.assign(target, source, ...)
var $        = require('./$')
  , toObject = require('./$.to-object')
  , IObject  = require('./$.iobject');

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = require('./$.fails')(function(){
  var a = Object.assign
    , A = {}
    , B = {}
    , S = Symbol()
    , K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function(k){ B[k] = k; });
  return a({}, A)[S] != 7 || Object.keys(a({}, B)).join('') != K;
}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
  var T     = toObject(target)
    , $$    = arguments
    , $$len = $$.length
    , index = 1
    , getKeys    = $.getKeys
    , getSymbols = $.getSymbols
    , isEnum     = $.isEnum;
  while($$len > index){
    var S      = IObject($$[index++])
      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
      , length = keys.length
      , j      = 0
      , key;
    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
  }
  return T;
} : Object.assign;
},{"./$":85,"./$.fails":69,"./$.iobject":76,"./$.to-object":105}],89:[function(require,module,exports){
// most Object methods by ES6 should accept primitives
var $export = require('./$.export')
  , core    = require('./$.core')
  , fails   = require('./$.fails');
module.exports = function(KEY, exec){
  var fn  = (core.Object || {})[KEY] || Object[KEY]
    , exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
};
},{"./$.core":63,"./$.export":68,"./$.fails":69}],90:[function(require,module,exports){
module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};
},{}],91:[function(require,module,exports){
var redefine = require('./$.redefine');
module.exports = function(target, src){
  for(var key in src)redefine(target, key, src[key]);
  return target;
};
},{"./$.redefine":92}],92:[function(require,module,exports){
module.exports = require('./$.hide');
},{"./$.hide":73}],93:[function(require,module,exports){
// 7.2.9 SameValue(x, y)
module.exports = Object.is || function is(x, y){
  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
};
},{}],94:[function(require,module,exports){
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var getDesc  = require('./$').getDesc
  , isObject = require('./$.is-object')
  , anObject = require('./$.an-object');
var check = function(O, proto){
  anObject(O);
  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function(test, buggy, set){
      try {
        set = require('./$.ctx')(Function.call, getDesc(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch(e){ buggy = true; }
      return function setPrototypeOf(O, proto){
        check(O, proto);
        if(buggy)O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};
},{"./$":85,"./$.an-object":57,"./$.ctx":64,"./$.is-object":78}],95:[function(require,module,exports){
'use strict';
var core        = require('./$.core')
  , $           = require('./$')
  , DESCRIPTORS = require('./$.descriptors')
  , SPECIES     = require('./$.wks')('species');

module.exports = function(KEY){
  var C = core[KEY];
  if(DESCRIPTORS && C && !C[SPECIES])$.setDesc(C, SPECIES, {
    configurable: true,
    get: function(){ return this; }
  });
};
},{"./$":85,"./$.core":63,"./$.descriptors":66,"./$.wks":107}],96:[function(require,module,exports){
var def = require('./$').setDesc
  , has = require('./$.has')
  , TAG = require('./$.wks')('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};
},{"./$":85,"./$.has":72,"./$.wks":107}],97:[function(require,module,exports){
var global = require('./$.global')
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};
},{"./$.global":71}],98:[function(require,module,exports){
// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject  = require('./$.an-object')
  , aFunction = require('./$.a-function')
  , SPECIES   = require('./$.wks')('species');
module.exports = function(O, D){
  var C = anObject(O).constructor, S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};
},{"./$.a-function":55,"./$.an-object":57,"./$.wks":107}],99:[function(require,module,exports){
module.exports = function(it, Constructor, name){
  if(!(it instanceof Constructor))throw TypeError(name + ": use the 'new' operator!");
  return it;
};
},{}],100:[function(require,module,exports){
var toInteger = require('./$.to-integer')
  , defined   = require('./$.defined');
// true  -> String#at
// false -> String#codePointAt
module.exports = function(TO_STRING){
  return function(that, pos){
    var s = String(defined(that))
      , i = toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};
},{"./$.defined":65,"./$.to-integer":102}],101:[function(require,module,exports){
var ctx                = require('./$.ctx')
  , invoke             = require('./$.invoke')
  , html               = require('./$.html')
  , cel                = require('./$.dom-create')
  , global             = require('./$.global')
  , process            = global.process
  , setTask            = global.setImmediate
  , clearTask          = global.clearImmediate
  , MessageChannel     = global.MessageChannel
  , counter            = 0
  , queue              = {}
  , ONREADYSTATECHANGE = 'onreadystatechange'
  , defer, channel, port;
var run = function(){
  var id = +this;
  if(queue.hasOwnProperty(id)){
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listner = function(event){
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if(!setTask || !clearTask){
  setTask = function setImmediate(fn){
    var args = [], i = 1;
    while(arguments.length > i)args.push(arguments[i++]);
    queue[++counter] = function(){
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id){
    delete queue[id];
  };
  // Node.js 0.8-
  if(require('./$.cof')(process) == 'process'){
    defer = function(id){
      process.nextTick(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if(MessageChannel){
    channel = new MessageChannel;
    port    = channel.port2;
    channel.port1.onmessage = listner;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if(global.addEventListener && typeof postMessage == 'function' && !global.importScripts){
    defer = function(id){
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listner, false);
  // IE8-
  } else if(ONREADYSTATECHANGE in cel('script')){
    defer = function(id){
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function(){
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function(id){
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set:   setTask,
  clear: clearTask
};
},{"./$.cof":59,"./$.ctx":64,"./$.dom-create":67,"./$.global":71,"./$.html":74,"./$.invoke":75}],102:[function(require,module,exports){
// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};
},{}],103:[function(require,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./$.iobject')
  , defined = require('./$.defined');
module.exports = function(it){
  return IObject(defined(it));
};
},{"./$.defined":65,"./$.iobject":76}],104:[function(require,module,exports){
// 7.1.15 ToLength
var toInteger = require('./$.to-integer')
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};
},{"./$.to-integer":102}],105:[function(require,module,exports){
// 7.1.13 ToObject(argument)
var defined = require('./$.defined');
module.exports = function(it){
  return Object(defined(it));
};
},{"./$.defined":65}],106:[function(require,module,exports){
var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};
},{}],107:[function(require,module,exports){
var store  = require('./$.shared')('wks')
  , uid    = require('./$.uid')
  , Symbol = require('./$.global').Symbol;
module.exports = function(name){
  return store[name] || (store[name] =
    Symbol && Symbol[name] || (Symbol || uid)('Symbol.' + name));
};
},{"./$.global":71,"./$.shared":97,"./$.uid":106}],108:[function(require,module,exports){
var classof   = require('./$.classof')
  , ITERATOR  = require('./$.wks')('iterator')
  , Iterators = require('./$.iterators');
module.exports = require('./$.core').getIteratorMethod = function(it){
  if(it != undefined)return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};
},{"./$.classof":58,"./$.core":63,"./$.iterators":84,"./$.wks":107}],109:[function(require,module,exports){
var anObject = require('./$.an-object')
  , get      = require('./core.get-iterator-method');
module.exports = require('./$.core').getIterator = function(it){
  var iterFn = get(it);
  if(typeof iterFn != 'function')throw TypeError(it + ' is not iterable!');
  return anObject(iterFn.call(it));
};
},{"./$.an-object":57,"./$.core":63,"./core.get-iterator-method":108}],110:[function(require,module,exports){
var classof   = require('./$.classof')
  , ITERATOR  = require('./$.wks')('iterator')
  , Iterators = require('./$.iterators');
module.exports = require('./$.core').isIterable = function(it){
  var O = Object(it);
  return O[ITERATOR] !== undefined
    || '@@iterator' in O
    || Iterators.hasOwnProperty(classof(O));
};
},{"./$.classof":58,"./$.core":63,"./$.iterators":84,"./$.wks":107}],111:[function(require,module,exports){
'use strict';
var ctx         = require('./$.ctx')
  , $export     = require('./$.export')
  , toObject    = require('./$.to-object')
  , call        = require('./$.iter-call')
  , isArrayIter = require('./$.is-array-iter')
  , toLength    = require('./$.to-length')
  , getIterFn   = require('./core.get-iterator-method');
$export($export.S + $export.F * !require('./$.iter-detect')(function(iter){ Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
    var O       = toObject(arrayLike)
      , C       = typeof this == 'function' ? this : Array
      , $$      = arguments
      , $$len   = $$.length
      , mapfn   = $$len > 1 ? $$[1] : undefined
      , mapping = mapfn !== undefined
      , index   = 0
      , iterFn  = getIterFn(O)
      , length, result, step, iterator;
    if(mapping)mapfn = ctx(mapfn, $$len > 2 ? $$[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if(iterFn != undefined && !(C == Array && isArrayIter(iterFn))){
      for(iterator = iterFn.call(O), result = new C; !(step = iterator.next()).done; index++){
        result[index] = mapping ? call(iterator, mapfn, [step.value, index], true) : step.value;
      }
    } else {
      length = toLength(O.length);
      for(result = new C(length); length > index; index++){
        result[index] = mapping ? mapfn(O[index], index) : O[index];
      }
    }
    result.length = index;
    return result;
  }
});

},{"./$.ctx":64,"./$.export":68,"./$.is-array-iter":77,"./$.iter-call":79,"./$.iter-detect":82,"./$.to-length":104,"./$.to-object":105,"./core.get-iterator-method":108}],112:[function(require,module,exports){
'use strict';
var addToUnscopables = require('./$.add-to-unscopables')
  , step             = require('./$.iter-step')
  , Iterators        = require('./$.iterators')
  , toIObject        = require('./$.to-iobject');

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = require('./$.iter-define')(Array, 'Array', function(iterated, kind){
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , kind  = this._k
    , index = this._i++;
  if(!O || index >= O.length){
    this._t = undefined;
    return step(1);
  }
  if(kind == 'keys'  )return step(0, index);
  if(kind == 'values')return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');
},{"./$.add-to-unscopables":56,"./$.iter-define":81,"./$.iter-step":83,"./$.iterators":84,"./$.to-iobject":103}],113:[function(require,module,exports){
'use strict';
var strong = require('./$.collection-strong');

// 23.1 Map Objects
require('./$.collection')('Map', function(get){
  return function Map(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.1.3.6 Map.prototype.get(key)
  get: function get(key){
    var entry = strong.getEntry(this, key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function set(key, value){
    return strong.def(this, key === 0 ? 0 : key, value);
  }
}, strong, true);
},{"./$.collection":62,"./$.collection-strong":60}],114:[function(require,module,exports){
// 19.1.3.1 Object.assign(target, source)
var $export = require('./$.export');

$export($export.S + $export.F, 'Object', {assign: require('./$.object-assign')});
},{"./$.export":68,"./$.object-assign":88}],115:[function(require,module,exports){
// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
var toIObject = require('./$.to-iobject');

require('./$.object-sap')('getOwnPropertyDescriptor', function($getOwnPropertyDescriptor){
  return function getOwnPropertyDescriptor(it, key){
    return $getOwnPropertyDescriptor(toIObject(it), key);
  };
});
},{"./$.object-sap":89,"./$.to-iobject":103}],116:[function(require,module,exports){
// 19.1.2.14 Object.keys(O)
var toObject = require('./$.to-object');

require('./$.object-sap')('keys', function($keys){
  return function keys(it){
    return $keys(toObject(it));
  };
});
},{"./$.object-sap":89,"./$.to-object":105}],117:[function(require,module,exports){
// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = require('./$.export');
$export($export.S, 'Object', {setPrototypeOf: require('./$.set-proto').set});
},{"./$.export":68,"./$.set-proto":94}],118:[function(require,module,exports){

},{}],119:[function(require,module,exports){
'use strict';
var $          = require('./$')
  , LIBRARY    = require('./$.library')
  , global     = require('./$.global')
  , ctx        = require('./$.ctx')
  , classof    = require('./$.classof')
  , $export    = require('./$.export')
  , isObject   = require('./$.is-object')
  , anObject   = require('./$.an-object')
  , aFunction  = require('./$.a-function')
  , strictNew  = require('./$.strict-new')
  , forOf      = require('./$.for-of')
  , setProto   = require('./$.set-proto').set
  , same       = require('./$.same-value')
  , SPECIES    = require('./$.wks')('species')
  , speciesConstructor = require('./$.species-constructor')
  , asap       = require('./$.microtask')
  , PROMISE    = 'Promise'
  , process    = global.process
  , isNode     = classof(process) == 'process'
  , P          = global[PROMISE]
  , Wrapper;

var testResolve = function(sub){
  var test = new P(function(){});
  if(sub)test.constructor = Object;
  return P.resolve(test) === test;
};

var USE_NATIVE = function(){
  var works = false;
  function P2(x){
    var self = new P(x);
    setProto(self, P2.prototype);
    return self;
  }
  try {
    works = P && P.resolve && testResolve();
    setProto(P2, P);
    P2.prototype = $.create(P.prototype, {constructor: {value: P2}});
    // actual Firefox has broken subclass support, test that
    if(!(P2.resolve(5).then(function(){}) instanceof P2)){
      works = false;
    }
    // actual V8 bug, https://code.google.com/p/v8/issues/detail?id=4162
    if(works && require('./$.descriptors')){
      var thenableThenGotten = false;
      P.resolve($.setDesc({}, 'then', {
        get: function(){ thenableThenGotten = true; }
      }));
      works = thenableThenGotten;
    }
  } catch(e){ works = false; }
  return works;
}();

// helpers
var sameConstructor = function(a, b){
  // library wrapper special case
  if(LIBRARY && a === P && b === Wrapper)return true;
  return same(a, b);
};
var getConstructor = function(C){
  var S = anObject(C)[SPECIES];
  return S != undefined ? S : C;
};
var isThenable = function(it){
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var PromiseCapability = function(C){
  var resolve, reject;
  this.promise = new C(function($$resolve, $$reject){
    if(resolve !== undefined || reject !== undefined)throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject  = $$reject;
  });
  this.resolve = aFunction(resolve),
  this.reject  = aFunction(reject)
};
var perform = function(exec){
  try {
    exec();
  } catch(e){
    return {error: e};
  }
};
var notify = function(record, isReject){
  if(record.n)return;
  record.n = true;
  var chain = record.c;
  asap(function(){
    var value = record.v
      , ok    = record.s == 1
      , i     = 0;
    var run = function(reaction){
      var handler = ok ? reaction.ok : reaction.fail
        , resolve = reaction.resolve
        , reject  = reaction.reject
        , result, then;
      try {
        if(handler){
          if(!ok)record.h = true;
          result = handler === true ? value : handler(value);
          if(result === reaction.promise){
            reject(TypeError('Promise-chain cycle'));
          } else if(then = isThenable(result)){
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch(e){
        reject(e);
      }
    };
    while(chain.length > i)run(chain[i++]); // variable length - can't use forEach
    chain.length = 0;
    record.n = false;
    if(isReject)setTimeout(function(){
      var promise = record.p
        , handler, console;
      if(isUnhandled(promise)){
        if(isNode){
          process.emit('unhandledRejection', value, promise);
        } else if(handler = global.onunhandledrejection){
          handler({promise: promise, reason: value});
        } else if((console = global.console) && console.error){
          console.error('Unhandled promise rejection', value);
        }
      } record.a = undefined;
    }, 1);
  });
};
var isUnhandled = function(promise){
  var record = promise._d
    , chain  = record.a || record.c
    , i      = 0
    , reaction;
  if(record.h)return false;
  while(chain.length > i){
    reaction = chain[i++];
    if(reaction.fail || !isUnhandled(reaction.promise))return false;
  } return true;
};
var $reject = function(value){
  var record = this;
  if(record.d)return;
  record.d = true;
  record = record.r || record; // unwrap
  record.v = value;
  record.s = 2;
  record.a = record.c.slice();
  notify(record, true);
};
var $resolve = function(value){
  var record = this
    , then;
  if(record.d)return;
  record.d = true;
  record = record.r || record; // unwrap
  try {
    if(record.p === value)throw TypeError("Promise can't be resolved itself");
    if(then = isThenable(value)){
      asap(function(){
        var wrapper = {r: record, d: false}; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch(e){
          $reject.call(wrapper, e);
        }
      });
    } else {
      record.v = value;
      record.s = 1;
      notify(record, false);
    }
  } catch(e){
    $reject.call({r: record, d: false}, e); // wrap
  }
};

// constructor polyfill
if(!USE_NATIVE){
  // 25.4.3.1 Promise(executor)
  P = function Promise(executor){
    aFunction(executor);
    var record = this._d = {
      p: strictNew(this, P, PROMISE),         // <- promise
      c: [],                                  // <- awaiting reactions
      a: undefined,                           // <- checked in isUnhandled reactions
      s: 0,                                   // <- state
      d: false,                               // <- done
      v: undefined,                           // <- value
      h: false,                               // <- handled rejection
      n: false                                // <- notify
    };
    try {
      executor(ctx($resolve, record, 1), ctx($reject, record, 1));
    } catch(err){
      $reject.call(record, err);
    }
  };
  require('./$.redefine-all')(P.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected){
      var reaction = new PromiseCapability(speciesConstructor(this, P))
        , promise  = reaction.promise
        , record   = this._d;
      reaction.ok   = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      record.c.push(reaction);
      if(record.a)record.a.push(reaction);
      if(record.s)notify(record, false);
      return promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function(onRejected){
      return this.then(undefined, onRejected);
    }
  });
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, {Promise: P});
require('./$.set-to-string-tag')(P, PROMISE);
require('./$.set-species')(PROMISE);
Wrapper = require('./$.core')[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r){
    var capability = new PromiseCapability(this)
      , $$reject   = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (!USE_NATIVE || testResolve(true)), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x){
    // instanceof instead of internal slot check because we should fix it without replacement native Promise core
    if(x instanceof P && sameConstructor(x.constructor, this))return x;
    var capability = new PromiseCapability(this)
      , $$resolve  = capability.resolve;
    $$resolve(x);
    return capability.promise;
  }
});
$export($export.S + $export.F * !(USE_NATIVE && require('./$.iter-detect')(function(iter){
  P.all(iter)['catch'](function(){});
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable){
    var C          = getConstructor(this)
      , capability = new PromiseCapability(C)
      , resolve    = capability.resolve
      , reject     = capability.reject
      , values     = [];
    var abrupt = perform(function(){
      forOf(iterable, false, values.push, values);
      var remaining = values.length
        , results   = Array(remaining);
      if(remaining)$.each.call(values, function(promise, index){
        var alreadyCalled = false;
        C.resolve(promise).then(function(value){
          if(alreadyCalled)return;
          alreadyCalled = true;
          results[index] = value;
          --remaining || resolve(results);
        }, reject);
      });
      else resolve(results);
    });
    if(abrupt)reject(abrupt.error);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable){
    var C          = getConstructor(this)
      , capability = new PromiseCapability(C)
      , reject     = capability.reject;
    var abrupt = perform(function(){
      forOf(iterable, false, function(promise){
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if(abrupt)reject(abrupt.error);
    return capability.promise;
  }
});
},{"./$":85,"./$.a-function":55,"./$.an-object":57,"./$.classof":58,"./$.core":63,"./$.ctx":64,"./$.descriptors":66,"./$.export":68,"./$.for-of":70,"./$.global":71,"./$.is-object":78,"./$.iter-detect":82,"./$.library":86,"./$.microtask":87,"./$.redefine-all":91,"./$.same-value":93,"./$.set-proto":94,"./$.set-species":95,"./$.set-to-string-tag":96,"./$.species-constructor":98,"./$.strict-new":99,"./$.wks":107}],120:[function(require,module,exports){
'use strict';
var strong = require('./$.collection-strong');

// 23.2 Set Objects
require('./$.collection')('Set', function(get){
  return function Set(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value){
    return strong.def(this, value = value === 0 ? 0 : value, value);
  }
}, strong);
},{"./$.collection":62,"./$.collection-strong":60}],121:[function(require,module,exports){
'use strict';
var $at  = require('./$.string-at')(true);

// 21.1.3.27 String.prototype[@@iterator]()
require('./$.iter-define')(String, 'String', function(iterated){
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , index = this._i
    , point;
  if(index >= O.length)return {value: undefined, done: true};
  point = $at(O, index);
  this._i += point.length;
  return {value: point, done: false};
});
},{"./$.iter-define":81,"./$.string-at":100}],122:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export  = require('./$.export');

$export($export.P, 'Map', {toJSON: require('./$.collection-to-json')('Map')});
},{"./$.collection-to-json":61,"./$.export":68}],123:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export  = require('./$.export');

$export($export.P, 'Set', {toJSON: require('./$.collection-to-json')('Set')});
},{"./$.collection-to-json":61,"./$.export":68}],124:[function(require,module,exports){
require('./es6.array.iterator');
var Iterators = require('./$.iterators');
Iterators.NodeList = Iterators.HTMLCollection = Iterators.Array;
},{"./$.iterators":84,"./es6.array.iterator":112}],125:[function(require,module,exports){

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
},{"../jsutils/invariant":11,"../jsutils/isNullish":12,"../jsutils/keyMap":13,"../language/kinds":15,"babel-runtime/core-js/map":25,"babel-runtime/core-js/object/create":27,"babel-runtime/core-js/object/keys":30,"babel-runtime/helpers/class-call-check":34,"babel-runtime/helpers/create-class":35,"babel-runtime/helpers/extends":36,"babel-runtime/helpers/interop-require-default":39}],126:[function(require,module,exports){

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _definition = require('./definition');

var _scalars = require('./scalars');

/**
 * Directives are used by the GraphQL runtime as a way of modifying execution
 * behavior. Type system creators will usually not create these directly.
 */

var GraphQLDirective = function GraphQLDirective(config) {
  _classCallCheck(this, GraphQLDirective);

  this.name = config.name;
  this.description = config.description;
  this.args = config.args || [];
  this.onOperation = Boolean(config.onOperation);
  this.onFragment = Boolean(config.onFragment);
  this.onField = Boolean(config.onField);
};

exports.GraphQLDirective = GraphQLDirective;

/**
 * Used to conditionally include fields or fragments
 */
var GraphQLIncludeDirective = new GraphQLDirective({
  name: 'include',
  description: 'Directs the executor to include this field or fragment only when ' + 'the `if` argument is true.',
  args: [{ name: 'if',
    type: new _definition.GraphQLNonNull(_scalars.GraphQLBoolean),
    description: 'Included when true.' }],
  onOperation: false,
  onFragment: true,
  onField: true
});

exports.GraphQLIncludeDirective = GraphQLIncludeDirective;
/**
 * Used to conditionally skip (exclude) fields or fragments
 */
var GraphQLSkipDirective = new GraphQLDirective({
  name: 'skip',
  description: 'Directs the executor to skip this field or fragment when the `if` ' + 'argument is true.',
  args: [{ name: 'if',
    type: new _definition.GraphQLNonNull(_scalars.GraphQLBoolean),
    description: 'Skipped when true.' }],
  onOperation: false,
  onFragment: true,
  onField: true
});
exports.GraphQLSkipDirective = GraphQLSkipDirective;
},{"./definition":125,"./scalars":128,"babel-runtime/helpers/class-call-check":34}],127:[function(require,module,exports){
/*  weak */
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

var _jsutilsIsNullish = require('../jsutils/isNullish');

var _jsutilsIsNullish2 = _interopRequireDefault(_jsutilsIsNullish);

var _utilitiesAstFromValue = require('../utilities/astFromValue');

var _languagePrinter = require('../language/printer');

var _definition = require('./definition');

var _scalars = require('./scalars');

var __Schema = new _definition.GraphQLObjectType({
  name: '__Schema',
  description: 'A GraphQL Schema defines the capabilities of a GraphQL server. It ' + 'exposes all available types and directives on the server, as well as ' + 'the entry points for query, mutation, and subscription operations.',
  fields: function fields() {
    return {
      types: {
        description: 'A list of all types supported by this server.',
        type: new _definition.GraphQLNonNull(new _definition.GraphQLList(new _definition.GraphQLNonNull(__Type))),
        resolve: function resolve(schema) {
          var typeMap = schema.getTypeMap();
          return _Object$keys(typeMap).map(function (key) {
            return typeMap[key];
          });
        }
      },
      queryType: {
        description: 'The type that query operations will be rooted at.',
        type: new _definition.GraphQLNonNull(__Type),
        resolve: function resolve(schema) {
          return schema.getQueryType();
        }
      },
      mutationType: {
        description: 'If this server supports mutation, the type that ' + 'mutation operations will be rooted at.',
        type: __Type,
        resolve: function resolve(schema) {
          return schema.getMutationType();
        }
      },
      subscriptionType: {
        description: 'If this server support subscription, the type that ' + 'subscription operations will be rooted at.',
        type: __Type,
        resolve: function resolve(schema) {
          return schema.getSubscriptionType();
        }
      },
      directives: {
        description: 'A list of all directives supported by this server.',
        type: new _definition.GraphQLNonNull(new _definition.GraphQLList(new _definition.GraphQLNonNull(__Directive))),
        resolve: function resolve(schema) {
          return schema.getDirectives();
        }
      }
    };
  }
});

exports.__Schema = __Schema;
var __Directive = new _definition.GraphQLObjectType({
  name: '__Directive',
  description: 'A Directive provides a way to describe alternate runtime execution and ' + 'type validation behavior in a GraphQL document.' + '\n\nIn some cases, you need to provide options to alter GraphQL’s ' + 'execution behavior in ways field arguments will not suffice, such as ' + 'conditionally including or skipping a field. Directives provide this by ' + 'describing additional information to the executor.',
  fields: function fields() {
    return {
      name: { type: new _definition.GraphQLNonNull(_scalars.GraphQLString) },
      description: { type: _scalars.GraphQLString },
      args: {
        type: new _definition.GraphQLNonNull(new _definition.GraphQLList(new _definition.GraphQLNonNull(__InputValue))),
        resolve: function resolve(directive) {
          return directive.args || [];
        }
      },
      onOperation: { type: new _definition.GraphQLNonNull(_scalars.GraphQLBoolean) },
      onFragment: { type: new _definition.GraphQLNonNull(_scalars.GraphQLBoolean) },
      onField: { type: new _definition.GraphQLNonNull(_scalars.GraphQLBoolean) }
    };
  }
});

var __Type = new _definition.GraphQLObjectType({
  name: '__Type',
  description: 'The fundamental unit of any GraphQL Schema is the type. There are ' + 'many kinds of types in GraphQL as represented by the `__TypeKind` enum.' + '\n\nDepending on the kind of a type, certain fields describe ' + 'information about that type. Scalar types provide no information ' + 'beyond a name and description, while Enum types provide their values. ' + 'Object and Interface types provide the fields they describe. Abstract ' + 'types, Union and Interface, provide the Object types possible ' + 'at runtime. List and NonNull types compose other types.',
  fields: function fields() {
    return {
      kind: {
        type: new _definition.GraphQLNonNull(__TypeKind),
        resolve: function resolve(type) {
          if (type instanceof _definition.GraphQLScalarType) {
            return TypeKind.SCALAR;
          } else if (type instanceof _definition.GraphQLObjectType) {
            return TypeKind.OBJECT;
          } else if (type instanceof _definition.GraphQLInterfaceType) {
            return TypeKind.INTERFACE;
          } else if (type instanceof _definition.GraphQLUnionType) {
            return TypeKind.UNION;
          } else if (type instanceof _definition.GraphQLEnumType) {
            return TypeKind.ENUM;
          } else if (type instanceof _definition.GraphQLInputObjectType) {
            return TypeKind.INPUT_OBJECT;
          } else if (type instanceof _definition.GraphQLList) {
            return TypeKind.LIST;
          } else if (type instanceof _definition.GraphQLNonNull) {
            return TypeKind.NON_NULL;
          }
          throw new Error('Unknown kind of type: ' + type);
        }
      },
      name: { type: _scalars.GraphQLString },
      description: { type: _scalars.GraphQLString },
      fields: {
        type: new _definition.GraphQLList(new _definition.GraphQLNonNull(__Field)),
        args: {
          includeDeprecated: { type: _scalars.GraphQLBoolean, defaultValue: false }
        },
        resolve: function resolve(type, _ref) {
          var includeDeprecated = _ref.includeDeprecated;

          if (type instanceof _definition.GraphQLObjectType || type instanceof _definition.GraphQLInterfaceType) {
            var fieldMap = type.getFields();
            var fields = _Object$keys(fieldMap).map(function (fieldName) {
              return fieldMap[fieldName];
            });
            if (!includeDeprecated) {
              fields = fields.filter(function (field) {
                return !field.deprecationReason;
              });
            }
            return fields;
          }
          return null;
        }
      },
      interfaces: {
        type: new _definition.GraphQLList(new _definition.GraphQLNonNull(__Type)),
        resolve: function resolve(type) {
          if (type instanceof _definition.GraphQLObjectType) {
            return type.getInterfaces();
          }
        }
      },
      possibleTypes: {
        type: new _definition.GraphQLList(new _definition.GraphQLNonNull(__Type)),
        resolve: function resolve(type) {
          if (type instanceof _definition.GraphQLInterfaceType || type instanceof _definition.GraphQLUnionType) {
            return type.getPossibleTypes();
          }
        }
      },
      enumValues: {
        type: new _definition.GraphQLList(new _definition.GraphQLNonNull(__EnumValue)),
        args: {
          includeDeprecated: { type: _scalars.GraphQLBoolean, defaultValue: false }
        },
        resolve: function resolve(type, _ref2) {
          var includeDeprecated = _ref2.includeDeprecated;

          if (type instanceof _definition.GraphQLEnumType) {
            var values = type.getValues();
            if (!includeDeprecated) {
              values = values.filter(function (value) {
                return !value.deprecationReason;
              });
            }
            return values;
          }
        }
      },
      inputFields: {
        type: new _definition.GraphQLList(new _definition.GraphQLNonNull(__InputValue)),
        resolve: function resolve(type) {
          if (type instanceof _definition.GraphQLInputObjectType) {
            var fieldMap = type.getFields();
            return _Object$keys(fieldMap).map(function (fieldName) {
              return fieldMap[fieldName];
            });
          }
        }
      },
      ofType: { type: __Type }
    };
  }
});

var __Field = new _definition.GraphQLObjectType({
  name: '__Field',
  description: 'Object and Interface types are described by a list of Fields, each of ' + 'which has a name, potentially a list of arguments, and a return type.',
  fields: function fields() {
    return {
      name: { type: new _definition.GraphQLNonNull(_scalars.GraphQLString) },
      description: { type: _scalars.GraphQLString },
      args: {
        type: new _definition.GraphQLNonNull(new _definition.GraphQLList(new _definition.GraphQLNonNull(__InputValue))),
        resolve: function resolve(field) {
          return field.args || [];
        }
      },
      type: { type: new _definition.GraphQLNonNull(__Type) },
      isDeprecated: {
        type: new _definition.GraphQLNonNull(_scalars.GraphQLBoolean),
        resolve: function resolve(field) {
          return !(0, _jsutilsIsNullish2['default'])(field.deprecationReason);
        }
      },
      deprecationReason: {
        type: _scalars.GraphQLString
      }
    };
  }
});

var __InputValue = new _definition.GraphQLObjectType({
  name: '__InputValue',
  description: 'Arguments provided to Fields or Directives and the input fields of an ' + 'InputObject are represented as Input Values which describe their type ' + 'and optionally a default value.',
  fields: function fields() {
    return {
      name: { type: new _definition.GraphQLNonNull(_scalars.GraphQLString) },
      description: { type: _scalars.GraphQLString },
      type: { type: new _definition.GraphQLNonNull(__Type) },
      defaultValue: {
        type: _scalars.GraphQLString,
        description: 'A GraphQL-formatted string representing the default value for this ' + 'input value.',
        resolve: function resolve(inputVal) {
          return (0, _jsutilsIsNullish2['default'])(inputVal.defaultValue) ? null : (0, _languagePrinter.print)((0, _utilitiesAstFromValue.astFromValue)(inputVal.defaultValue, inputVal));
        }
      }
    };
  }
});

var __EnumValue = new _definition.GraphQLObjectType({
  name: '__EnumValue',
  description: 'One possible value for a given Enum. Enum values are unique values, not ' + 'a placeholder for a string or numeric value. However an Enum value is ' + 'returned in a JSON response as a string.',
  fields: {
    name: { type: new _definition.GraphQLNonNull(_scalars.GraphQLString) },
    description: { type: _scalars.GraphQLString },
    isDeprecated: {
      type: new _definition.GraphQLNonNull(_scalars.GraphQLBoolean),
      resolve: function resolve(enumValue) {
        return !(0, _jsutilsIsNullish2['default'])(enumValue.deprecationReason);
      }
    },
    deprecationReason: {
      type: _scalars.GraphQLString
    }
  }
});

var TypeKind = {
  SCALAR: 'SCALAR',
  OBJECT: 'OBJECT',
  INTERFACE: 'INTERFACE',
  UNION: 'UNION',
  ENUM: 'ENUM',
  INPUT_OBJECT: 'INPUT_OBJECT',
  LIST: 'LIST',
  NON_NULL: 'NON_NULL'
};

exports.TypeKind = TypeKind;
var __TypeKind = new _definition.GraphQLEnumType({
  name: '__TypeKind',
  description: 'An enum describing what kind of type a given `__Type` is.',
  values: {
    SCALAR: {
      value: TypeKind.SCALAR,
      description: 'Indicates this type is a scalar.'
    },
    OBJECT: {
      value: TypeKind.OBJECT,
      description: 'Indicates this type is an object. ' + '`fields` and `interfaces` are valid fields.'
    },
    INTERFACE: {
      value: TypeKind.INTERFACE,
      description: 'Indicates this type is an interface. ' + '`fields` and `possibleTypes` are valid fields.'
    },
    UNION: {
      value: TypeKind.UNION,
      description: 'Indicates this type is a union. ' + '`possibleTypes` is a valid field.'
    },
    ENUM: {
      value: TypeKind.ENUM,
      description: 'Indicates this type is an enum. ' + '`enumValues` is a valid field.'
    },
    INPUT_OBJECT: {
      value: TypeKind.INPUT_OBJECT,
      description: 'Indicates this type is an input object. ' + '`inputFields` is a valid field.'
    },
    LIST: {
      value: TypeKind.LIST,
      description: 'Indicates this type is a list. ' + '`ofType` is a valid field.'
    },
    NON_NULL: {
      value: TypeKind.NON_NULL,
      description: 'Indicates this type is a non-null. ' + '`ofType` is a valid field.'
    }
  }
});

/**
 * Note that these are GraphQLFieldDefinition and not GraphQLFieldConfig,
 * so the format for args is different.
 */

var SchemaMetaFieldDef = {
  name: '__schema',
  type: new _definition.GraphQLNonNull(__Schema),
  description: 'Access the current type schema of this server.',
  args: [],
  resolve: function resolve(source, args, _ref3) {
    var schema = _ref3.schema;
    return schema;
  }
};

exports.SchemaMetaFieldDef = SchemaMetaFieldDef;
var TypeMetaFieldDef = {
  name: '__type',
  type: __Type,
  description: 'Request the type information of a single type.',
  args: [{ name: 'name', type: new _definition.GraphQLNonNull(_scalars.GraphQLString) }],
  resolve: function resolve(source, _ref4, _ref5) {
    var name = _ref4.name;
    var schema = _ref5.schema;
    return schema.getType(name);
  }
};

exports.TypeMetaFieldDef = TypeMetaFieldDef;
var TypeNameMetaFieldDef = {
  name: '__typename',
  type: new _definition.GraphQLNonNull(_scalars.GraphQLString),
  description: 'The name of the current Object type at runtime.',
  args: [],
  resolve: function resolve(source, args, _ref6) {
    var parentType = _ref6.parentType;
    return parentType.name;
  }
};
exports.TypeNameMetaFieldDef = TypeNameMetaFieldDef;
},{"../jsutils/isNullish":12,"../language/printer":19,"../utilities/astFromValue":131,"./definition":125,"./scalars":128,"babel-runtime/core-js/object/keys":30,"babel-runtime/helpers/interop-require-default":39}],128:[function(require,module,exports){

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _definition = require('./definition');

var _language = require('../language');

// As per the GraphQL Spec, Integers are only treated as valid when a valid
// 32-bit signed integer, providing the broadest support across platforms.
//
// n.b. JavaScript's integers are safe between -(2^53 - 1) and 2^53 - 1 because
// they are internally represented as IEEE 754 doubles.
var MAX_INT = 2147483647;
var MIN_INT = -2147483648;

function coerceInt(value) {
  var num = Number(value);
  if (num === num && num <= MAX_INT && num >= MIN_INT) {
    return (num < 0 ? Math.ceil : Math.floor)(num);
  }
  return null;
}

var GraphQLInt = new _definition.GraphQLScalarType({
  name: 'Int',
  description: 'The `Int` scalar type represents non-fractional signed whole numeric ' + 'values. Int can represent values between -(2^53 - 1) and 2^53 - 1 since ' + 'represented in JSON as double-precision floating point numbers specified' + 'by [IEEE 754](http://en.wikipedia.org/wiki/IEEE_floating_point).',
  serialize: coerceInt,
  parseValue: coerceInt,
  parseLiteral: function parseLiteral(ast) {
    if (ast.kind === _language.Kind.INT) {
      var num = parseInt(ast.value, 10);
      if (num <= MAX_INT && num >= MIN_INT) {
        return num;
      }
    }
    return null;
  }
});

exports.GraphQLInt = GraphQLInt;
function coerceFloat(value) {
  var num = Number(value);
  return num === num ? num : null;
}

var GraphQLFloat = new _definition.GraphQLScalarType({
  name: 'Float',
  description: 'The `Float` scalar type represents signed double-precision fractional ' + 'values as specified by ' + '[IEEE 754](http://en.wikipedia.org/wiki/IEEE_floating_point). ',
  serialize: coerceFloat,
  parseValue: coerceFloat,
  parseLiteral: function parseLiteral(ast) {
    return ast.kind === _language.Kind.FLOAT || ast.kind === _language.Kind.INT ? parseFloat(ast.value) : null;
  }
});

exports.GraphQLFloat = GraphQLFloat;
var GraphQLString = new _definition.GraphQLScalarType({
  name: 'String',
  description: 'The `String` scalar type represents textual data, represented as UTF-8 ' + 'character sequences. The String type is most often used by GraphQL to ' + 'represent free-form human-readable text.',
  serialize: String,
  parseValue: String,
  parseLiteral: function parseLiteral(ast) {
    return ast.kind === _language.Kind.STRING ? ast.value : null;
  }
});

exports.GraphQLString = GraphQLString;
var GraphQLBoolean = new _definition.GraphQLScalarType({
  name: 'Boolean',
  description: 'The `Boolean` scalar type represents `true` or `false`.',
  serialize: Boolean,
  parseValue: Boolean,
  parseLiteral: function parseLiteral(ast) {
    return ast.kind === _language.Kind.BOOLEAN ? ast.value : null;
  }
});

exports.GraphQLBoolean = GraphQLBoolean;
var GraphQLID = new _definition.GraphQLScalarType({
  name: 'ID',
  description: 'The `ID` scalar type represents a unique identifier, often used to ' + 'refetch an object or as key for a cache. The ID type appears in a JSON ' + 'response as a String; however, it is not intended to be human-readable. ' + 'When expected as an input type, any string (such as `"4"`) or integer ' + '(such as `4`) input value will be accepted as an ID.',
  serialize: String,
  parseValue: String,
  parseLiteral: function parseLiteral(ast) {
    return ast.kind === _language.Kind.STRING || ast.kind === _language.Kind.INT ? ast.value : null;
  }
});
exports.GraphQLID = GraphQLID;
},{"../language":14,"./definition":125}],129:[function(require,module,exports){

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
},{"../jsutils/find":10,"../jsutils/invariant":11,"../utilities/typeComparators":134,"./definition":125,"./directives":126,"./introspection":127,"babel-runtime/core-js/object/keys":30,"babel-runtime/helpers/class-call-check":34,"babel-runtime/helpers/create-class":35,"babel-runtime/helpers/interop-require-default":39}],130:[function(require,module,exports){

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

var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _languageKinds = require('../language/kinds');

var Kind = _interopRequireWildcard(_languageKinds);

var _typeDefinition = require('../type/definition');

var _typeIntrospection = require('../type/introspection');

var _typeFromAST = require('./typeFromAST');

var _jsutilsFind = require('../jsutils/find');

var _jsutilsFind2 = _interopRequireDefault(_jsutilsFind);

/**
 * TypeInfo is a utility class which, given a GraphQL schema, can keep track
 * of the current field and type definitions at any point in a GraphQL document
 * AST during a recursive descent by calling `enter(node)` and `leave(node)`.
 */

var TypeInfo = (function () {
  function TypeInfo(schema,
  // NOTE: this experimental optional second parameter is only needed in order
  // to support non-spec-compliant codebases. You should never need to use it.
  getFieldDefFn) {
    _classCallCheck(this, TypeInfo);

    this._schema = schema;
    this._typeStack = [];
    this._parentTypeStack = [];
    this._inputTypeStack = [];
    this._fieldDefStack = [];
    this._directive = null;
    this._argument = null;
    this._getFieldDef = getFieldDefFn || getFieldDef;
  }

  /**
   * Not exactly the same as the executor's definition of getFieldDef, in this
   * statically evaluated environment we do not always have an Object type,
   * and need to handle Interface and Union types.
   */

  _createClass(TypeInfo, [{
    key: 'getType',
    value: function getType() {
      if (this._typeStack.length > 0) {
        return this._typeStack[this._typeStack.length - 1];
      }
    }
  }, {
    key: 'getParentType',
    value: function getParentType() {
      if (this._parentTypeStack.length > 0) {
        return this._parentTypeStack[this._parentTypeStack.length - 1];
      }
    }
  }, {
    key: 'getInputType',
    value: function getInputType() {
      if (this._inputTypeStack.length > 0) {
        return this._inputTypeStack[this._inputTypeStack.length - 1];
      }
    }
  }, {
    key: 'getFieldDef',
    value: function getFieldDef() {
      if (this._fieldDefStack.length > 0) {
        return this._fieldDefStack[this._fieldDefStack.length - 1];
      }
    }
  }, {
    key: 'getDirective',
    value: function getDirective() {
      return this._directive;
    }
  }, {
    key: 'getArgument',
    value: function getArgument() {
      return this._argument;
    }

    // Flow does not yet handle this case.
  }, {
    key: 'enter',
    value: function enter(node /* Node */) {
      var schema = this._schema;
      switch (node.kind) {
        case Kind.SELECTION_SET:
          var namedType = (0, _typeDefinition.getNamedType)(this.getType());
          var compositeType;
          if ((0, _typeDefinition.isCompositeType)(namedType)) {
            // isCompositeType is a type refining predicate, so this is safe.
            compositeType = namedType;
          }
          this._parentTypeStack.push(compositeType);
          break;
        case Kind.FIELD:
          var parentType = this.getParentType();
          var fieldDef;
          if (parentType) {
            fieldDef = this._getFieldDef(schema, parentType, node);
          }
          this._fieldDefStack.push(fieldDef);
          this._typeStack.push(fieldDef && fieldDef.type);
          break;
        case Kind.DIRECTIVE:
          this._directive = schema.getDirective(node.name.value);
          break;
        case Kind.OPERATION_DEFINITION:
          var type = undefined;
          if (node.operation === 'query') {
            type = schema.getQueryType();
          } else if (node.operation === 'mutation') {
            type = schema.getMutationType();
          } else if (node.operation === 'subscription') {
            type = schema.getSubscriptionType();
          }
          this._typeStack.push(type);
          break;
        case Kind.INLINE_FRAGMENT:
        case Kind.FRAGMENT_DEFINITION:
          var typeConditionAST = node.typeCondition;
          var outputType = typeConditionAST ? (0, _typeFromAST.typeFromAST)(schema, typeConditionAST) : this.getType();
          this._typeStack.push(outputType);
          break;
        case Kind.VARIABLE_DEFINITION:
          var inputType = (0, _typeFromAST.typeFromAST)(schema, node.type);
          this._inputTypeStack.push(inputType);
          break;
        case Kind.ARGUMENT:
          var argDef;
          var argType;
          var fieldOrDirective = this.getDirective() || this.getFieldDef();
          if (fieldOrDirective) {
            argDef = (0, _jsutilsFind2['default'])(fieldOrDirective.args, function (arg) {
              return arg.name === node.name.value;
            });
            if (argDef) {
              argType = argDef.type;
            }
          }
          this._argument = argDef;
          this._inputTypeStack.push(argType);
          break;
        case Kind.LIST:
          var listType = (0, _typeDefinition.getNullableType)(this.getInputType());
          this._inputTypeStack.push(listType instanceof _typeDefinition.GraphQLList ? listType.ofType : undefined);
          break;
        case Kind.OBJECT_FIELD:
          var objectType = (0, _typeDefinition.getNamedType)(this.getInputType());
          var fieldType;
          if (objectType instanceof _typeDefinition.GraphQLInputObjectType) {
            var inputField = objectType.getFields()[node.name.value];
            fieldType = inputField ? inputField.type : undefined;
          }
          this._inputTypeStack.push(fieldType);
          break;
      }
    }
  }, {
    key: 'leave',
    value: function leave(node) {
      switch (node.kind) {
        case Kind.SELECTION_SET:
          this._parentTypeStack.pop();
          break;
        case Kind.FIELD:
          this._fieldDefStack.pop();
          this._typeStack.pop();
          break;
        case Kind.DIRECTIVE:
          this._directive = null;
          break;
        case Kind.OPERATION_DEFINITION:
        case Kind.INLINE_FRAGMENT:
        case Kind.FRAGMENT_DEFINITION:
          this._typeStack.pop();
          break;
        case Kind.VARIABLE_DEFINITION:
          this._inputTypeStack.pop();
          break;
        case Kind.ARGUMENT:
          this._argument = null;
          this._inputTypeStack.pop();
          break;
        case Kind.LIST:
        case Kind.OBJECT_FIELD:
          this._inputTypeStack.pop();
          break;
      }
    }
  }]);

  return TypeInfo;
})();

exports.TypeInfo = TypeInfo;
function getFieldDef(schema, parentType, fieldAST) {
  var name = fieldAST.name.value;
  if (name === _typeIntrospection.SchemaMetaFieldDef.name && schema.getQueryType() === parentType) {
    return _typeIntrospection.SchemaMetaFieldDef;
  }
  if (name === _typeIntrospection.TypeMetaFieldDef.name && schema.getQueryType() === parentType) {
    return _typeIntrospection.TypeMetaFieldDef;
  }
  if (name === _typeIntrospection.TypeNameMetaFieldDef.name && (parentType instanceof _typeDefinition.GraphQLObjectType || parentType instanceof _typeDefinition.GraphQLInterfaceType || parentType instanceof _typeDefinition.GraphQLUnionType)) {
    return _typeIntrospection.TypeNameMetaFieldDef;
  }
  if (parentType instanceof _typeDefinition.GraphQLObjectType || parentType instanceof _typeDefinition.GraphQLInterfaceType) {
    return parentType.getFields()[name];
  }
}
// It may disappear in the future.
},{"../jsutils/find":10,"../language/kinds":15,"../type/definition":125,"../type/introspection":127,"./typeFromAST":135,"babel-runtime/helpers/class-call-check":34,"babel-runtime/helpers/create-class":35,"babel-runtime/helpers/interop-require-default":39,"babel-runtime/helpers/interop-require-wildcard":40}],131:[function(require,module,exports){

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
},{"../jsutils/invariant":11,"../jsutils/isNullish":12,"../language/kinds":15,"../type/definition":125,"../type/scalars":128,"babel-runtime/core-js/object/keys":30,"babel-runtime/helpers/interop-require-default":39}],132:[function(require,module,exports){

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

/**
 * Given a JavaScript value and a GraphQL type, determine if the value will be
 * accepted for that type. This is primarily useful for validating the
 * runtime values of query variables.
 */
'use strict';

var _toConsumableArray = require('babel-runtime/helpers/to-consumable-array')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.isValidJSValue = isValidJSValue;

var _jsutilsInvariant = require('../jsutils/invariant');

var _jsutilsInvariant2 = _interopRequireDefault(_jsutilsInvariant);

var _jsutilsIsNullish = require('../jsutils/isNullish');

var _jsutilsIsNullish2 = _interopRequireDefault(_jsutilsIsNullish);

var _typeDefinition = require('../type/definition');

function isValidJSValue(_x, _x2) {
  var _again = true;

  _function: while (_again) {
    var value = _x,
        type = _x2;
    ofType = itemType = fields = errors = _iteratorNormalCompletion = _didIteratorError = _iteratorError = _iteratorNormalCompletion2 = _didIteratorError2 = _iteratorError2 = parseResult = undefined;
    _again = false;

    // A value must be provided if the type is non-null.
    if (type instanceof _typeDefinition.GraphQLNonNull) {
      var ofType = type.ofType;
      if ((0, _jsutilsIsNullish2['default'])(value)) {
        if (ofType.name) {
          return ['Expected "' + ofType.name + '!", found null.'];
        }
        return ['Expected non-null value, found null.'];
      }
      _x = value;
      _x2 = ofType;
      _again = true;
      continue _function;
    }

    if ((0, _jsutilsIsNullish2['default'])(value)) {
      return [];
    }

    // Lists accept a non-list value as a list of one.
    if (type instanceof _typeDefinition.GraphQLList) {
      var itemType = type.ofType;
      if (Array.isArray(value)) {
        return value.reduce(function (acc, item, index) {
          var errors = isValidJSValue(item, itemType);
          return acc.concat(errors.map(function (error) {
            return 'In element #' + index + ': ' + error;
          }));
        }, []);
      }
      _x = value;
      _x2 = itemType;
      _again = true;
      continue _function;
    }

    // Input objects check each defined field.
    if (type instanceof _typeDefinition.GraphQLInputObjectType) {
      if (typeof value !== 'object') {
        return ['Expected "' + type.name + '", found not an object.'];
      }
      var fields = type.getFields();

      var errors = [];

      // Ensure every provided field is defined.
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = _getIterator(_Object$keys(value)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var providedField = _step.value;

          if (!fields[providedField]) {
            errors.push('In field "${providedField}": Unknown field.');
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

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = _getIterator(_Object$keys(fields)), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var fieldName = _step2.value;

          var newErrors = isValidJSValue(value[fieldName], fields[fieldName].type);
          errors.push.apply(errors, _toConsumableArray(newErrors.map(function (error) {
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
    var parseResult = type.parseValue(value);
    if ((0, _jsutilsIsNullish2['default'])(parseResult)) {
      return ['Expected type "' + type.name + '", found ' + JSON.stringify(value) + '.'];
    }

    return [];
  }
}
},{"../jsutils/invariant":11,"../jsutils/isNullish":12,"../type/definition":125,"babel-runtime/core-js/get-iterator":23,"babel-runtime/core-js/object/keys":30,"babel-runtime/helpers/interop-require-default":39,"babel-runtime/helpers/to-consumable-array":42}],133:[function(require,module,exports){

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
},{"../jsutils/invariant":11,"../jsutils/isNullish":12,"../jsutils/keyMap":13,"../language/kinds":15,"../language/printer":19,"../type/definition":125,"babel-runtime/core-js/get-iterator":23,"babel-runtime/core-js/object/keys":30,"babel-runtime/helpers/interop-require-default":39,"babel-runtime/helpers/to-consumable-array":42}],134:[function(require,module,exports){

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

/**
 * Provided two types, return true if the types are equal (invariant).
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.isEqualType = isEqualType;
exports.isTypeSubTypeOf = isTypeSubTypeOf;

var _typeDefinition = require('../type/definition');

function isEqualType(_x, _x2) {
  var _again = true;

  _function: while (_again) {
    var typeA = _x,
        typeB = _x2;
    _again = false;

    // Equivalent types are equal.
    if (typeA === typeB) {
      return true;
    }

    // If either type is non-null, the other must also be non-null.
    if (typeA instanceof _typeDefinition.GraphQLNonNull && typeB instanceof _typeDefinition.GraphQLNonNull) {
      _x = typeA.ofType;
      _x2 = typeB.ofType;
      _again = true;
      continue _function;
    }

    // If either type is a list, the other must also be a list.
    if (typeA instanceof _typeDefinition.GraphQLList && typeB instanceof _typeDefinition.GraphQLList) {
      _x = typeA.ofType;
      _x2 = typeB.ofType;
      _again = true;
      continue _function;
    }

    // Otherwise the types are not equal.
    return false;
  }
}

/**
 * Provided a type and a super type, return true if the first type is either
 * equal or a subset of the second super type (covariant).
 */

function isTypeSubTypeOf(_x3, _x4) {
  var _again2 = true;

  _function2: while (_again2) {
    var maybeSubType = _x3,
        superType = _x4;
    _again2 = false;

    // Equivalent type is a valid subtype
    if (maybeSubType === superType) {
      return true;
    }

    // If superType is non-null, maybeSubType must also be nullable.
    if (superType instanceof _typeDefinition.GraphQLNonNull) {
      if (maybeSubType instanceof _typeDefinition.GraphQLNonNull) {
        _x3 = maybeSubType.ofType;
        _x4 = superType.ofType;
        _again2 = true;
        continue _function2;
      }
      return false;
    } else if (maybeSubType instanceof _typeDefinition.GraphQLNonNull) {
      // If superType is nullable, maybeSubType may be non-null.
      _x3 = maybeSubType.ofType;
      _x4 = superType;
      _again2 = true;
      continue _function2;
    }

    // If superType type is a list, maybeSubType type must also be a list.
    if (superType instanceof _typeDefinition.GraphQLList) {
      if (maybeSubType instanceof _typeDefinition.GraphQLList) {
        _x3 = maybeSubType.ofType;
        _x4 = superType.ofType;
        _again2 = true;
        continue _function2;
      }
      return false;
    } else if (maybeSubType instanceof _typeDefinition.GraphQLList) {
      // If superType is not a list, maybeSubType must also be not a list.
      return false;
    }

    // If superType type is an abstract type, maybeSubType type may be a currently
    // possible object type.
    if ((0, _typeDefinition.isAbstractType)(superType) && maybeSubType instanceof _typeDefinition.GraphQLObjectType && superType.isPossibleType(maybeSubType)) {
      return true;
    }

    // Otherwise, the child type is not a valid subtype of the parent type.
    return false;
  }
}
},{"../type/definition":125}],135:[function(require,module,exports){

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
exports.typeFromAST = typeFromAST;

var _jsutilsInvariant = require('../jsutils/invariant');

var _jsutilsInvariant2 = _interopRequireDefault(_jsutilsInvariant);

var _languageKinds = require('../language/kinds');

var _typeDefinition = require('../type/definition');

function typeFromAST(schema, inputTypeAST) {
  var innerType;
  if (inputTypeAST.kind === _languageKinds.LIST_TYPE) {
    innerType = typeFromAST(schema, inputTypeAST.type);
    return innerType && new _typeDefinition.GraphQLList(innerType);
  }
  if (inputTypeAST.kind === _languageKinds.NON_NULL_TYPE) {
    innerType = typeFromAST(schema, inputTypeAST.type);
    return innerType && new _typeDefinition.GraphQLNonNull(innerType);
  }
  (0, _jsutilsInvariant2['default'])(inputTypeAST.kind === _languageKinds.NAMED_TYPE, 'Must be a named type.');
  return schema.getType(inputTypeAST.name.value);
}
},{"../jsutils/invariant":11,"../language/kinds":15,"../type/definition":125,"babel-runtime/helpers/interop-require-default":39}],136:[function(require,module,exports){

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

/**
 * Produces a JavaScript value given a GraphQL Value AST.
 *
 * A GraphQL type must be provided, which will be used to interpret different
 * GraphQL Value literals.
 *
 * | GraphQL Value        | JSON Value    |
 * | -------------------- | ------------- |
 * | Input Object         | Object        |
 * | List                 | Array         |
 * | Boolean              | Boolean       |
 * | String / Enum Value  | String        |
 * | Int / Float          | Number        |
 *
 */
'use strict';

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.valueFromAST = valueFromAST;

var _jsutilsKeyMap = require('../jsutils/keyMap');

var _jsutilsKeyMap2 = _interopRequireDefault(_jsutilsKeyMap);

var _jsutilsInvariant = require('../jsutils/invariant');

var _jsutilsInvariant2 = _interopRequireDefault(_jsutilsInvariant);

var _jsutilsIsNullish = require('../jsutils/isNullish');

var _jsutilsIsNullish2 = _interopRequireDefault(_jsutilsIsNullish);

var _languageKinds = require('../language/kinds');

var Kind = _interopRequireWildcard(_languageKinds);

var _typeDefinition = require('../type/definition');

function valueFromAST(_x, _x2, _x3) {
  var _again = true;

  _function: while (_again) {
    var valueAST = _x,
        type = _x2,
        variables = _x3;
    nullableType = variableName = itemType = fields = fieldASTs = parsed = undefined;
    _again = false;

    if (type instanceof _typeDefinition.GraphQLNonNull) {
      var nullableType = type.ofType;
      // Note: we're not checking that the result of valueFromAST is non-null.
      // We're assuming that this query has been validated and the value used
      // here is of the correct type.
      _x = valueAST;
      _x2 = nullableType;
      _x3 = variables;
      _again = true;
      continue _function;
    }

    if (!valueAST) {
      return null;
    }

    if (valueAST.kind === Kind.VARIABLE) {
      var variableName = valueAST.name.value;
      if (!variables || !variables.hasOwnProperty(variableName)) {
        return null;
      }
      // Note: we're not doing any checking that this variable is correct. We're
      // assuming that this query has been validated and the variable usage here
      // is of the correct type.
      return variables[variableName];
    }

    if (type instanceof _typeDefinition.GraphQLList) {
      var itemType = type.ofType;
      if (valueAST.kind === Kind.LIST) {
        return valueAST.values.map(function (itemAST) {
          return valueFromAST(itemAST, itemType, variables);
        });
      }
      return [valueFromAST(valueAST, itemType, variables)];
    }

    if (type instanceof _typeDefinition.GraphQLInputObjectType) {
      var fields = type.getFields();
      if (valueAST.kind !== Kind.OBJECT) {
        return null;
      }
      var fieldASTs = (0, _jsutilsKeyMap2['default'])(valueAST.fields, function (field) {
        return field.name.value;
      });
      return _Object$keys(fields).reduce(function (obj, fieldName) {
        var field = fields[fieldName];
        var fieldAST = fieldASTs[fieldName];
        var fieldValue = valueFromAST(fieldAST && fieldAST.value, field.type, variables);
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

    var parsed = type.parseLiteral(valueAST);
    if (!(0, _jsutilsIsNullish2['default'])(parsed)) {
      return parsed;
    }
  }
}
},{"../jsutils/invariant":11,"../jsutils/isNullish":12,"../jsutils/keyMap":13,"../language/kinds":15,"../type/definition":125,"babel-runtime/core-js/object/keys":30,"babel-runtime/helpers/interop-require-default":39,"babel-runtime/helpers/interop-require-wildcard":40}],137:[function(require,module,exports){

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.badValueMessage = badValueMessage;
exports.ArgumentsOfCorrectType = ArgumentsOfCorrectType;

var _error = require('../../error');

var _languagePrinter = require('../../language/printer');

var _utilitiesIsValidLiteralValue = require('../../utilities/isValidLiteralValue');

function badValueMessage(argName, type, value, verboseErrors) {
  var message = verboseErrors ? '\n' + verboseErrors.join('\n') : '';
  return 'Argument "' + argName + '" has invalid value ' + value + '.' + message;
}

/**
 * Argument values of correct type
 *
 * A GraphQL document is only valid if all field argument literal values are
 * of the type expected by their position.
 */

function ArgumentsOfCorrectType(context) {
  return {
    Argument: function Argument(argAST) {
      var argDef = context.getArgument();
      if (argDef) {
        var errors = (0, _utilitiesIsValidLiteralValue.isValidLiteralValue)(argDef.type, argAST.value);
        if (errors && errors.length > 0) {
          context.reportError(new _error.GraphQLError(badValueMessage(argAST.name.value, argDef.type, (0, _languagePrinter.print)(argAST.value), errors), [argAST.value]));
        }
      }
      return false;
    }
  };
}
},{"../../error":3,"../../language/printer":19,"../../utilities/isValidLiteralValue":133}],138:[function(require,module,exports){

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.defaultForNonNullArgMessage = defaultForNonNullArgMessage;
exports.badValueForDefaultArgMessage = badValueForDefaultArgMessage;
exports.DefaultValuesOfCorrectType = DefaultValuesOfCorrectType;

var _error = require('../../error');

var _languagePrinter = require('../../language/printer');

var _typeDefinition = require('../../type/definition');

var _utilitiesIsValidLiteralValue = require('../../utilities/isValidLiteralValue');

function defaultForNonNullArgMessage(varName, type, guessType) {
  return 'Variable "$' + varName + '" of type "' + type + '" is required and will not ' + ('use the default value. Perhaps you meant to use type "' + guessType + '".');
}

function badValueForDefaultArgMessage(varName, type, value, verboseErrors) {
  var message = verboseErrors ? '\n' + verboseErrors.join('\n') : '';
  return 'Variable "$' + varName + ' has invalid default value ' + value + '.' + message;
}

/**
 * Variable default values of correct type
 *
 * A GraphQL document is only valid if all variable default values are of the
 * type expected by their definition.
 */

function DefaultValuesOfCorrectType(context) {
  return {
    VariableDefinition: function VariableDefinition(varDefAST) {
      var name = varDefAST.variable.name.value;
      var defaultValue = varDefAST.defaultValue;
      var type = context.getInputType();
      if (type instanceof _typeDefinition.GraphQLNonNull && defaultValue) {
        context.reportError(new _error.GraphQLError(defaultForNonNullArgMessage(name, type, type.ofType), [defaultValue]));
      }
      if (type && defaultValue) {
        var errors = (0, _utilitiesIsValidLiteralValue.isValidLiteralValue)(type, defaultValue);
        if (errors && errors.length > 0) {
          context.reportError(new _error.GraphQLError(badValueForDefaultArgMessage(name, type, (0, _languagePrinter.print)(defaultValue), errors), [defaultValue]));
        }
      }
      return false;
    },
    SelectionSet: function SelectionSet() {
      return false;
    },
    FragmentDefinition: function FragmentDefinition() {
      return false;
    }
  };
}
},{"../../error":3,"../../language/printer":19,"../../type/definition":125,"../../utilities/isValidLiteralValue":133}],139:[function(require,module,exports){

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.undefinedFieldMessage = undefinedFieldMessage;
exports.FieldsOnCorrectType = FieldsOnCorrectType;

var _error = require('../../error');

function undefinedFieldMessage(fieldName, type) {
  return 'Cannot query field "' + fieldName + '" on "' + type + '".';
}

/**
 * Fields on correct type
 *
 * A GraphQL document is only valid if all fields selected are defined by the
 * parent type, or are an allowed meta field such as __typenamme
 */

function FieldsOnCorrectType(context) {
  return {
    Field: function Field(node) {
      var type = context.getParentType();
      if (type) {
        var fieldDef = context.getFieldDef();
        if (!fieldDef) {
          context.reportError(new _error.GraphQLError(undefinedFieldMessage(node.name.value, type.name), [node]));
        }
      }
    }
  };
}
},{"../../error":3}],140:[function(require,module,exports){

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.inlineFragmentOnNonCompositeErrorMessage = inlineFragmentOnNonCompositeErrorMessage;
exports.fragmentOnNonCompositeErrorMessage = fragmentOnNonCompositeErrorMessage;
exports.FragmentsOnCompositeTypes = FragmentsOnCompositeTypes;

var _error = require('../../error');

var _languagePrinter = require('../../language/printer');

var _typeDefinition = require('../../type/definition');

function inlineFragmentOnNonCompositeErrorMessage(type) {
  return 'Fragment cannot condition on non composite type "' + type + '".';
}

function fragmentOnNonCompositeErrorMessage(fragName, type) {
  return 'Fragment "' + fragName + '" cannot condition on non composite ' + ('type "' + type + '".');
}

/**
 * Fragments on composite type
 *
 * Fragments use a type condition to determine if they apply, since fragments
 * can only be spread into a composite type (object, interface, or union), the
 * type condition must also be a composite type.
 */

function FragmentsOnCompositeTypes(context) {
  return {
    InlineFragment: function InlineFragment(node) {
      var type = context.getType();
      if (node.typeCondition && type && !(0, _typeDefinition.isCompositeType)(type)) {
        context.reportError(new _error.GraphQLError(inlineFragmentOnNonCompositeErrorMessage((0, _languagePrinter.print)(node.typeCondition)), [node.typeCondition]));
      }
    },
    FragmentDefinition: function FragmentDefinition(node) {
      var type = context.getType();
      if (type && !(0, _typeDefinition.isCompositeType)(type)) {
        context.reportError(new _error.GraphQLError(fragmentOnNonCompositeErrorMessage(node.name.value, (0, _languagePrinter.print)(node.typeCondition)), [node.typeCondition]));
      }
    }
  };
}
},{"../../error":3,"../../language/printer":19,"../../type/definition":125}],141:[function(require,module,exports){

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
exports.unknownArgMessage = unknownArgMessage;
exports.unknownDirectiveArgMessage = unknownDirectiveArgMessage;
exports.KnownArgumentNames = KnownArgumentNames;

var _error = require('../../error');

var _jsutilsFind = require('../../jsutils/find');

var _jsutilsFind2 = _interopRequireDefault(_jsutilsFind);

var _jsutilsInvariant = require('../../jsutils/invariant');

var _jsutilsInvariant2 = _interopRequireDefault(_jsutilsInvariant);

var _languageKinds = require('../../language/kinds');

function unknownArgMessage(argName, fieldName, type) {
  return 'Unknown argument "' + argName + '" on field "' + fieldName + '" of ' + ('type "' + type + '".');
}

function unknownDirectiveArgMessage(argName, directiveName) {
  return 'Unknown argument "' + argName + '" on directive "@' + directiveName + '".';
}

/**
 * Known argument names
 *
 * A GraphQL field is only valid if all supplied arguments are defined by
 * that field.
 */

function KnownArgumentNames(context) {
  return {
    Argument: function Argument(node, key, parent, path, ancestors) {
      var argumentOf = ancestors[ancestors.length - 1];
      if (argumentOf.kind === _languageKinds.FIELD) {
        var fieldDef = context.getFieldDef();
        if (fieldDef) {
          var fieldArgDef = (0, _jsutilsFind2['default'])(fieldDef.args, function (arg) {
            return arg.name === node.name.value;
          });
          if (!fieldArgDef) {
            var parentType = context.getParentType();
            (0, _jsutilsInvariant2['default'])(parentType);
            context.reportError(new _error.GraphQLError(unknownArgMessage(node.name.value, fieldDef.name, parentType.name), [node]));
          }
        }
      } else if (argumentOf.kind === _languageKinds.DIRECTIVE) {
        var directive = context.getDirective();
        if (directive) {
          var directiveArgDef = (0, _jsutilsFind2['default'])(directive.args, function (arg) {
            return arg.name === node.name.value;
          });
          if (!directiveArgDef) {
            context.reportError(new _error.GraphQLError(unknownDirectiveArgMessage(node.name.value, directive.name), [node]));
          }
        }
      }
    }
  };
}
},{"../../error":3,"../../jsutils/find":10,"../../jsutils/invariant":11,"../../language/kinds":15,"babel-runtime/helpers/interop-require-default":39}],142:[function(require,module,exports){

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
exports.unknownDirectiveMessage = unknownDirectiveMessage;
exports.misplacedDirectiveMessage = misplacedDirectiveMessage;
exports.KnownDirectives = KnownDirectives;

var _error = require('../../error');

var _jsutilsFind = require('../../jsutils/find');

var _jsutilsFind2 = _interopRequireDefault(_jsutilsFind);

var _languageKinds = require('../../language/kinds');

function unknownDirectiveMessage(directiveName) {
  return 'Unknown directive "' + directiveName + '".';
}

function misplacedDirectiveMessage(directiveName, placement) {
  return 'Directive "' + directiveName + '" may not be used on "' + placement + '".';
}

/**
 * Known directives
 *
 * A GraphQL document is only valid if all `@directives` are known by the
 * schema and legally positioned.
 */

function KnownDirectives(context) {
  return {
    Directive: function Directive(node, key, parent, path, ancestors) {
      var directiveDef = (0, _jsutilsFind2['default'])(context.getSchema().getDirectives(), function (def) {
        return def.name === node.name.value;
      });
      if (!directiveDef) {
        context.reportError(new _error.GraphQLError(unknownDirectiveMessage(node.name.value), [node]));
        return;
      }
      var appliedTo = ancestors[ancestors.length - 1];
      switch (appliedTo.kind) {
        case _languageKinds.OPERATION_DEFINITION:
          if (!directiveDef.onOperation) {
            context.reportError(new _error.GraphQLError(misplacedDirectiveMessage(node.name.value, 'operation'), [node]));
          }
          break;
        case _languageKinds.FIELD:
          if (!directiveDef.onField) {
            context.reportError(new _error.GraphQLError(misplacedDirectiveMessage(node.name.value, 'field'), [node]));
          }
          break;
        case _languageKinds.FRAGMENT_SPREAD:
        case _languageKinds.INLINE_FRAGMENT:
        case _languageKinds.FRAGMENT_DEFINITION:
          if (!directiveDef.onFragment) {
            context.reportError(new _error.GraphQLError(misplacedDirectiveMessage(node.name.value, 'fragment'), [node]));
          }
          break;
      }
    }
  };
}
},{"../../error":3,"../../jsutils/find":10,"../../language/kinds":15,"babel-runtime/helpers/interop-require-default":39}],143:[function(require,module,exports){

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.unknownFragmentMessage = unknownFragmentMessage;
exports.KnownFragmentNames = KnownFragmentNames;

var _error = require('../../error');

function unknownFragmentMessage(fragName) {
  return 'Unknown fragment "' + fragName + '".';
}

/**
 * Known fragment names
 *
 * A GraphQL document is only valid if all `...Fragment` fragment spreads refer
 * to fragments defined in the same document.
 */

function KnownFragmentNames(context) {
  return {
    FragmentSpread: function FragmentSpread(node) {
      var fragmentName = node.name.value;
      var fragment = context.getFragment(fragmentName);
      if (!fragment) {
        context.reportError(new _error.GraphQLError(unknownFragmentMessage(fragmentName), [node.name]));
      }
    }
  };
}
},{"../../error":3}],144:[function(require,module,exports){

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.unknownTypeMessage = unknownTypeMessage;
exports.KnownTypeNames = KnownTypeNames;

var _error = require('../../error');

function unknownTypeMessage(type) {
  return 'Unknown type "' + type + '".';
}

/**
 * Known type names
 *
 * A GraphQL document is only valid if referenced types (specifically
 * variable definitions and fragment conditions) are defined by the type schema.
 */

function KnownTypeNames(context) {
  return {
    // TODO: when validating IDL, re-enable these. Experimental version does not
    // add unreferenced types, resulting in false-positive errors. Squelched
    // errors for now.
    ObjectTypeDefinition: function ObjectTypeDefinition() {
      return false;
    },
    InterfaceTypeDefinition: function InterfaceTypeDefinition() {
      return false;
    },
    UnionTypeDefinition: function UnionTypeDefinition() {
      return false;
    },
    InputObjectTypeDefinition: function InputObjectTypeDefinition() {
      return false;
    },
    NamedType: function NamedType(node) {
      var typeName = node.name.value;
      var type = context.getSchema().getType(typeName);
      if (!type) {
        context.reportError(new _error.GraphQLError(unknownTypeMessage(typeName), [node]));
      }
    }
  };
}
},{"../../error":3}],145:[function(require,module,exports){

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.anonOperationNotAloneMessage = anonOperationNotAloneMessage;
exports.LoneAnonymousOperation = LoneAnonymousOperation;

var _error = require('../../error');

var _languageKinds = require('../../language/kinds');

function anonOperationNotAloneMessage() {
  return 'This anonymous operation must be the only defined operation.';
}

/**
 * Lone anonymous operation
 *
 * A GraphQL document is only valid if when it contains an anonymous operation
 * (the query short-hand) that it contains only that one operation definition.
 */

function LoneAnonymousOperation(context) {
  var operationCount = 0;
  return {
    Document: function Document(node) {
      operationCount = node.definitions.filter(function (definition) {
        return definition.kind === _languageKinds.OPERATION_DEFINITION;
      }).length;
    },
    OperationDefinition: function OperationDefinition(node) {
      if (!node.name && operationCount > 1) {
        context.reportError(new _error.GraphQLError(anonOperationNotAloneMessage(), [node]));
      }
    }
  };
}
},{"../../error":3,"../../language/kinds":15}],146:[function(require,module,exports){

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
exports.cycleErrorMessage = cycleErrorMessage;
exports.NoFragmentCycles = NoFragmentCycles;

var _error = require('../../error');

function cycleErrorMessage(fragName, spreadNames) {
  var via = spreadNames.length ? ' via ' + spreadNames.join(', ') : '';
  return 'Cannot spread fragment "' + fragName + '" within itself' + via + '.';
}

function NoFragmentCycles(context) {
  // Tracks already visited fragments to maintain O(N) and to ensure that cycles
  // are not redundantly reported.
  var visitedFrags = _Object$create(null);

  // Array of AST nodes used to produce meaningful errors
  var spreadPath = [];

  // Position in the spread path
  var spreadPathIndexByName = _Object$create(null);

  return {
    OperationDefinition: function OperationDefinition() {
      return false;
    },
    FragmentDefinition: function FragmentDefinition(node) {
      if (!visitedFrags[node.name.value]) {
        detectCycleRecursive(node);
      }
      return false;
    }
  };

  // This does a straight-forward DFS to find cycles.
  // It does not terminate when a cycle was found but continues to explore
  // the graph to find all possible cycles.
  function detectCycleRecursive(fragment) {
    var fragmentName = fragment.name.value;
    visitedFrags[fragmentName] = true;

    var spreadNodes = context.getFragmentSpreads(fragment);
    if (spreadNodes.length === 0) {
      return;
    }

    spreadPathIndexByName[fragmentName] = spreadPath.length;

    for (var i = 0; i < spreadNodes.length; i++) {
      var spreadNode = spreadNodes[i];
      var spreadName = spreadNode.name.value;
      var cycleIndex = spreadPathIndexByName[spreadName];

      if (cycleIndex === undefined) {
        spreadPath.push(spreadNode);
        if (!visitedFrags[spreadName]) {
          var spreadFragment = context.getFragment(spreadName);
          if (spreadFragment) {
            detectCycleRecursive(spreadFragment);
          }
        }
        spreadPath.pop();
      } else {
        var cyclePath = spreadPath.slice(cycleIndex);
        context.reportError(new _error.GraphQLError(cycleErrorMessage(spreadName, cyclePath.map(function (s) {
          return s.name.value;
        })), cyclePath.concat(spreadNode)));
      }
    }

    spreadPathIndexByName[fragmentName] = undefined;
  }
}
},{"../../error":3,"babel-runtime/core-js/object/create":27}],147:[function(require,module,exports){

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
},{"../../error":3,"babel-runtime/core-js/object/create":27}],148:[function(require,module,exports){

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
exports.unusedFragMessage = unusedFragMessage;
exports.NoUnusedFragments = NoUnusedFragments;

var _error = require('../../error');

function unusedFragMessage(fragName) {
  return 'Fragment "' + fragName + '" is never used.';
}

/**
 * No unused fragments
 *
 * A GraphQL document is only valid if all fragment definitions are spread
 * within operations, or spread within other fragments spread within operations.
 */

function NoUnusedFragments(context) {
  var operationDefs = [];
  var fragmentDefs = [];

  return {
    OperationDefinition: function OperationDefinition(node) {
      operationDefs.push(node);
      return false;
    },
    FragmentDefinition: function FragmentDefinition(node) {
      fragmentDefs.push(node);
      return false;
    },
    Document: {
      leave: function leave() {
        var fragmentNameUsed = _Object$create(null);
        operationDefs.forEach(function (operation) {
          context.getRecursivelyReferencedFragments(operation).forEach(function (fragment) {
            fragmentNameUsed[fragment.name.value] = true;
          });
        });

        fragmentDefs.forEach(function (fragmentDef) {
          var fragName = fragmentDef.name.value;
          if (fragmentNameUsed[fragName] !== true) {
            context.reportError(new _error.GraphQLError(unusedFragMessage(fragName), [fragmentDef]));
          }
        });
      }
    }
  };
}
},{"../../error":3,"babel-runtime/core-js/object/create":27}],149:[function(require,module,exports){

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
exports.unusedVariableMessage = unusedVariableMessage;
exports.NoUnusedVariables = NoUnusedVariables;

var _error = require('../../error');

function unusedVariableMessage(varName) {
  return 'Variable "$' + varName + '" is never used.';
}

/**
 * No unused variables
 *
 * A GraphQL operation is only valid if all variables defined by an operation
 * are used, either directly or within a spread fragment.
 */

function NoUnusedVariables(context) {
  var variableDefs = [];

  return {
    OperationDefinition: {
      enter: function enter() {
        variableDefs = [];
      },
      leave: function leave(operation) {
        var variableNameUsed = _Object$create(null);
        var usages = context.getRecursiveVariableUsages(operation);

        usages.forEach(function (_ref) {
          var node = _ref.node;

          variableNameUsed[node.name.value] = true;
        });

        variableDefs.forEach(function (variableDef) {
          var variableName = variableDef.variable.name.value;
          if (variableNameUsed[variableName] !== true) {
            context.reportError(new _error.GraphQLError(unusedVariableMessage(variableName), [variableDef]));
          }
        });
      }
    },
    VariableDefinition: function VariableDefinition(def) {
      variableDefs.push(def);
    }
  };
}
},{"../../error":3,"babel-runtime/core-js/object/create":27}],150:[function(require,module,exports){

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

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var _Map = require('babel-runtime/core-js/map')['default'];

var _Set = require('babel-runtime/core-js/set')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.fieldsConflictMessage = fieldsConflictMessage;
exports.OverlappingFieldsCanBeMerged = OverlappingFieldsCanBeMerged;

// Field name and reason.

// Reason is a string, or a nested list of conflicts.

var _error = require('../../error');

var _jsutilsFind = require('../../jsutils/find');

var _jsutilsFind2 = _interopRequireDefault(_jsutilsFind);

var _languageKinds = require('../../language/kinds');

var _languagePrinter = require('../../language/printer');

var _typeDefinition = require('../../type/definition');

var _utilitiesTypeComparators = require('../../utilities/typeComparators');

var _utilitiesTypeFromAST = require('../../utilities/typeFromAST');

function fieldsConflictMessage(responseName, reason) {
  return 'Fields "' + responseName + '" conflict because ' + reasonMessage(reason) + '.';
}

function reasonMessage(reason) {
  if (Array.isArray(reason)) {
    return reason.map(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2);

      var responseName = _ref2[0];
      var subreason = _ref2[1];
      return 'subfields "' + responseName + '" conflict because ' + reasonMessage(subreason);
    }).join(' and ');
  }
  return reason;
}

/**
 * Overlapping fields can be merged
 *
 * A selection set is only valid if all fields (including spreading any
 * fragments) either correspond to distinct response names or can be merged
 * without ambiguity.
 */

function OverlappingFieldsCanBeMerged(context) {
  var comparedSet = new PairSet();

  function findConflicts(fieldMap) {
    var conflicts = [];
    _Object$keys(fieldMap).forEach(function (responseName) {
      var fields = fieldMap[responseName];
      if (fields.length > 1) {
        for (var i = 0; i < fields.length; i++) {
          for (var j = i; j < fields.length; j++) {
            var conflict = findConflict(responseName, fields[i], fields[j]);
            if (conflict) {
              conflicts.push(conflict);
            }
          }
        }
      }
    });
    return conflicts;
  }

  function findConflict(responseName, field1, field2) {
    var _field1 = _slicedToArray(field1, 3);

    var parentType1 = _field1[0];
    var ast1 = _field1[1];
    var def1 = _field1[2];

    var _field2 = _slicedToArray(field2, 3);

    var parentType2 = _field2[0];
    var ast2 = _field2[1];
    var def2 = _field2[2];

    // Not a pair.
    if (ast1 === ast2) {
      return;
    }

    // If the statically known parent types could not possibly apply at the same
    // time, then it is safe to permit them to diverge as they will not present
    // any ambiguity by differing.
    // It is known that two parent types could never overlap if they are
    // different Object types. Interface or Union types might overlap - if not
    // in the current state of the schema, then perhaps in some future version,
    // thus may not safely diverge.
    if (parentType1 !== parentType2 && parentType1 instanceof _typeDefinition.GraphQLObjectType && parentType2 instanceof _typeDefinition.GraphQLObjectType) {
      return;
    }

    // Memoize, do not report the same issue twice.
    if (comparedSet.has(ast1, ast2)) {
      return;
    }
    comparedSet.add(ast1, ast2);

    var name1 = ast1.name.value;
    var name2 = ast2.name.value;
    if (name1 !== name2) {
      return [[responseName, name1 + ' and ' + name2 + ' are different fields'], [ast1], [ast2]];
    }

    var type1 = def1 && def1.type;
    var type2 = def2 && def2.type;
    if (type1 && type2 && !(0, _utilitiesTypeComparators.isEqualType)(type1, type2)) {
      return [[responseName, 'they return differing types ' + type1 + ' and ' + type2], [ast1], [ast2]];
    }

    if (!sameArguments(ast1.arguments || [], ast2.arguments || [])) {
      return [[responseName, 'they have differing arguments'], [ast1], [ast2]];
    }

    var selectionSet1 = ast1.selectionSet;
    var selectionSet2 = ast2.selectionSet;
    if (selectionSet1 && selectionSet2) {
      var visitedFragmentNames = {};
      var subfieldMap = collectFieldASTsAndDefs(context, (0, _typeDefinition.getNamedType)(type1), selectionSet1, visitedFragmentNames);
      subfieldMap = collectFieldASTsAndDefs(context, (0, _typeDefinition.getNamedType)(type2), selectionSet2, visitedFragmentNames, subfieldMap);
      var conflicts = findConflicts(subfieldMap);
      if (conflicts.length > 0) {
        return [[responseName, conflicts.map(function (_ref3) {
          var _ref32 = _slicedToArray(_ref3, 1);

          var reason = _ref32[0];
          return reason;
        })], conflicts.reduce(function (allFields, _ref4) {
          var _ref42 = _slicedToArray(_ref4, 2);

          var fields1 = _ref42[1];
          return allFields.concat(fields1);
        }, [ast1]), conflicts.reduce(function (allFields, _ref5) {
          var _ref52 = _slicedToArray(_ref5, 3);

          var fields2 = _ref52[2];
          return allFields.concat(fields2);
        }, [ast2])];
      }
    }
  }

  return {
    SelectionSet: {
      // Note: we validate on the reverse traversal so deeper conflicts will be
      // caught first, for clearer error messages.
      leave: function leave(selectionSet) {
        var fieldMap = collectFieldASTsAndDefs(context, context.getParentType(), selectionSet);
        var conflicts = findConflicts(fieldMap);
        conflicts.forEach(function (_ref6) {
          var _ref62 = _slicedToArray(_ref6, 3);

          var _ref62$0 = _slicedToArray(_ref62[0], 2);

          var responseName = _ref62$0[0];
          var reason = _ref62$0[1];
          var fields1 = _ref62[1];
          var fields2 = _ref62[2];
          return context.reportError(new _error.GraphQLError(fieldsConflictMessage(responseName, reason), fields1.concat(fields2)));
        });
      }
    }
  };
}

function sameArguments(arguments1, arguments2) {
  if (arguments1.length !== arguments2.length) {
    return false;
  }
  return arguments1.every(function (argument1) {
    var argument2 = (0, _jsutilsFind2['default'])(arguments2, function (argument) {
      return argument.name.value === argument1.name.value;
    });
    if (!argument2) {
      return false;
    }
    return sameValue(argument1.value, argument2.value);
  });
}

function sameValue(value1, value2) {
  return !value1 && !value2 || (0, _languagePrinter.print)(value1) === (0, _languagePrinter.print)(value2);
}

/**
 * Given a selectionSet, adds all of the fields in that selection to
 * the passed in map of fields, and returns it at the end.
 *
 * Note: This is not the same as execution's collectFields because at static
 * time we do not know what object type will be used, so we unconditionally
 * spread in all fragments.
 */
function collectFieldASTsAndDefs(context, parentType, selectionSet, visitedFragmentNames, astAndDefs) {
  var _visitedFragmentNames = visitedFragmentNames || {};
  var _astAndDefs = astAndDefs || {};
  for (var i = 0; i < selectionSet.selections.length; i++) {
    var selection = selectionSet.selections[i];
    switch (selection.kind) {
      case _languageKinds.FIELD:
        var fieldName = selection.name.value;
        var fieldDef;
        if (parentType instanceof _typeDefinition.GraphQLObjectType || parentType instanceof _typeDefinition.GraphQLInterfaceType) {
          fieldDef = parentType.getFields()[fieldName];
        }
        var responseName = selection.alias ? selection.alias.value : fieldName;
        if (!_astAndDefs[responseName]) {
          _astAndDefs[responseName] = [];
        }
        _astAndDefs[responseName].push([parentType, selection, fieldDef]);
        break;
      case _languageKinds.INLINE_FRAGMENT:
        var typeCondition = selection.typeCondition;
        var inlineFragmentType = typeCondition ? (0, _utilitiesTypeFromAST.typeFromAST)(context.getSchema(), selection.typeCondition) : parentType;
        _astAndDefs = collectFieldASTsAndDefs(context, inlineFragmentType, selection.selectionSet, _visitedFragmentNames, _astAndDefs);
        break;
      case _languageKinds.FRAGMENT_SPREAD:
        var fragName = selection.name.value;
        if (_visitedFragmentNames[fragName]) {
          continue;
        }
        _visitedFragmentNames[fragName] = true;
        var fragment = context.getFragment(fragName);
        if (!fragment) {
          continue;
        }
        var fragmentType = (0, _utilitiesTypeFromAST.typeFromAST)(context.getSchema(), fragment.typeCondition);
        _astAndDefs = collectFieldASTsAndDefs(context, fragmentType, fragment.selectionSet, _visitedFragmentNames, _astAndDefs);
        break;
    }
  }
  return _astAndDefs;
}

/**
 * A way to keep track of pairs of things when the ordering of the pair does
 * not matter. We do this by maintaining a sort of double adjacency sets.
 */

var PairSet = (function () {
  function PairSet() {
    _classCallCheck(this, PairSet);

    this._data = new _Map();
  }

  _createClass(PairSet, [{
    key: 'has',
    value: function has(a, b) {
      var first = this._data.get(a);
      return first && first.has(b);
    }
  }, {
    key: 'add',
    value: function add(a, b) {
      _pairSetAdd(this._data, a, b);
      _pairSetAdd(this._data, b, a);
    }
  }]);

  return PairSet;
})();

function _pairSetAdd(data, a, b) {
  var set = data.get(a);
  if (!set) {
    set = new _Set();
    data.set(a, set);
  }
  set.add(b);
}
},{"../../error":3,"../../jsutils/find":10,"../../language/kinds":15,"../../language/printer":19,"../../type/definition":125,"../../utilities/typeComparators":134,"../../utilities/typeFromAST":135,"babel-runtime/core-js/map":25,"babel-runtime/core-js/object/keys":30,"babel-runtime/core-js/set":33,"babel-runtime/helpers/class-call-check":34,"babel-runtime/helpers/create-class":35,"babel-runtime/helpers/interop-require-default":39,"babel-runtime/helpers/sliced-to-array":41}],151:[function(require,module,exports){

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
},{"../../error":3,"../../jsutils/keyMap":13,"../../type/definition":125,"../../utilities/typeFromAST":135,"babel-runtime/helpers/interop-require-default":39}],152:[function(require,module,exports){

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
exports.missingFieldArgMessage = missingFieldArgMessage;
exports.missingDirectiveArgMessage = missingDirectiveArgMessage;
exports.ProvidedNonNullArguments = ProvidedNonNullArguments;

var _error = require('../../error');

var _jsutilsKeyMap = require('../../jsutils/keyMap');

var _jsutilsKeyMap2 = _interopRequireDefault(_jsutilsKeyMap);

var _typeDefinition = require('../../type/definition');

function missingFieldArgMessage(fieldName, argName, type) {
  return 'Field "' + fieldName + '" argument "' + argName + '" of type "' + type + '" ' + 'is required but not provided.';
}

function missingDirectiveArgMessage(directiveName, argName, type) {
  return 'Directive "@' + directiveName + '" argument "' + argName + '" of type ' + ('"' + type + '" is required but not provided.');
}

/**
 * Provided required arguments
 *
 * A field or directive is only valid if all required (non-null) field arguments
 * have been provided.
 */

function ProvidedNonNullArguments(context) {
  return {
    Field: {
      // Validate on leave to allow for deeper errors to appear first.
      leave: function leave(fieldAST) {
        var fieldDef = context.getFieldDef();
        if (!fieldDef) {
          return false;
        }
        var argASTs = fieldAST.arguments || [];

        var argASTMap = (0, _jsutilsKeyMap2['default'])(argASTs, function (arg) {
          return arg.name.value;
        });
        fieldDef.args.forEach(function (argDef) {
          var argAST = argASTMap[argDef.name];
          if (!argAST && argDef.type instanceof _typeDefinition.GraphQLNonNull) {
            context.reportError(new _error.GraphQLError(missingFieldArgMessage(fieldAST.name.value, argDef.name, argDef.type), [fieldAST]));
          }
        });
      }
    },

    Directive: {
      // Validate on leave to allow for deeper errors to appear first.
      leave: function leave(directiveAST) {
        var directiveDef = context.getDirective();
        if (!directiveDef) {
          return false;
        }
        var argASTs = directiveAST.arguments || [];

        var argASTMap = (0, _jsutilsKeyMap2['default'])(argASTs, function (arg) {
          return arg.name.value;
        });
        directiveDef.args.forEach(function (argDef) {
          var argAST = argASTMap[argDef.name];
          if (!argAST && argDef.type instanceof _typeDefinition.GraphQLNonNull) {
            context.reportError(new _error.GraphQLError(missingDirectiveArgMessage(directiveAST.name.value, argDef.name, argDef.type), [directiveAST]));
          }
        });
      }
    }
  };
}
},{"../../error":3,"../../jsutils/keyMap":13,"../../type/definition":125,"babel-runtime/helpers/interop-require-default":39}],153:[function(require,module,exports){

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.noSubselectionAllowedMessage = noSubselectionAllowedMessage;
exports.requiredSubselectionMessage = requiredSubselectionMessage;
exports.ScalarLeafs = ScalarLeafs;

var _error = require('../../error');

var _typeDefinition = require('../../type/definition');

function noSubselectionAllowedMessage(field, type) {
  return 'Field "' + field + '" of type "' + type + '" must not have a sub selection.';
}

function requiredSubselectionMessage(field, type) {
  return 'Field "' + field + '" of type "' + type + '" must have a sub selection.';
}

/**
 * Scalar leafs
 *
 * A GraphQL document is valid only if all leaf fields (fields without
 * sub selections) are of scalar or enum types.
 */

function ScalarLeafs(context) {
  return {
    Field: function Field(node) {
      var type = context.getType();
      if (type) {
        if ((0, _typeDefinition.isLeafType)(type)) {
          if (node.selectionSet) {
            context.reportError(new _error.GraphQLError(noSubselectionAllowedMessage(node.name.value, type), [node.selectionSet]));
          }
        } else if (!node.selectionSet) {
          context.reportError(new _error.GraphQLError(requiredSubselectionMessage(node.name.value, type), [node]));
        }
      }
    }
  };
}
},{"../../error":3,"../../type/definition":125}],154:[function(require,module,exports){

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
exports.duplicateArgMessage = duplicateArgMessage;
exports.UniqueArgumentNames = UniqueArgumentNames;

var _error = require('../../error');

function duplicateArgMessage(argName) {
  return 'There can be only one argument named "' + argName + '".';
}

/**
 * Unique argument names
 *
 * A GraphQL field or directive is only valid if all supplied arguments are
 * uniquely named.
 */

function UniqueArgumentNames(context) {
  var knownArgNames = _Object$create(null);
  return {
    Field: function Field() {
      knownArgNames = _Object$create(null);
    },
    Directive: function Directive() {
      knownArgNames = _Object$create(null);
    },
    Argument: function Argument(node) {
      var argName = node.name.value;
      if (knownArgNames[argName]) {
        context.reportError(new _error.GraphQLError(duplicateArgMessage(argName), [knownArgNames[argName], node.name]));
      } else {
        knownArgNames[argName] = node.name;
      }
      return false;
    }
  };
}
},{"../../error":3,"babel-runtime/core-js/object/create":27}],155:[function(require,module,exports){

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
exports.duplicateFragmentNameMessage = duplicateFragmentNameMessage;
exports.UniqueFragmentNames = UniqueFragmentNames;

var _error = require('../../error');

function duplicateFragmentNameMessage(fragName) {
  return 'There can only be one fragment named "' + fragName + '".';
}

/**
 * Unique fragment names
 *
 * A GraphQL document is only valid if all defined fragments have unique names.
 */

function UniqueFragmentNames(context) {
  var knownFragmentNames = _Object$create(null);
  return {
    OperationDefinition: function OperationDefinition() {
      return false;
    },
    FragmentDefinition: function FragmentDefinition(node) {
      var fragmentName = node.name.value;
      if (knownFragmentNames[fragmentName]) {
        context.reportError(new _error.GraphQLError(duplicateFragmentNameMessage(fragmentName), [knownFragmentNames[fragmentName], node.name]));
      } else {
        knownFragmentNames[fragmentName] = node.name;
      }
      return false;
    }
  };
}
},{"../../error":3,"babel-runtime/core-js/object/create":27}],156:[function(require,module,exports){

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
exports.duplicateInputFieldMessage = duplicateInputFieldMessage;
exports.UniqueInputFieldNames = UniqueInputFieldNames;

var _error = require('../../error');

function duplicateInputFieldMessage(fieldName) {
  return 'There can be only one input field named "' + fieldName + '".';
}

/**
 * Unique input field names
 *
 * A GraphQL input object value is only valid if all supplied fields are
 * uniquely named.
 */

function UniqueInputFieldNames(context) {
  var knownNameStack = [];
  var knownNames = _Object$create(null);

  return {
    ObjectValue: {
      enter: function enter() {
        knownNameStack.push(knownNames);
        knownNames = _Object$create(null);
      },
      leave: function leave() {
        knownNames = knownNameStack.pop();
      }
    },
    ObjectField: function ObjectField(node) {
      var fieldName = node.name.value;
      if (knownNames[fieldName]) {
        context.reportError(new _error.GraphQLError(duplicateInputFieldMessage(fieldName), [knownNames[fieldName], node.name]));
      } else {
        knownNames[fieldName] = node.name;
      }
      return false;
    }
  };
}
},{"../../error":3,"babel-runtime/core-js/object/create":27}],157:[function(require,module,exports){

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
exports.duplicateOperationNameMessage = duplicateOperationNameMessage;
exports.UniqueOperationNames = UniqueOperationNames;

var _error = require('../../error');

function duplicateOperationNameMessage(operationName) {
  return 'There can only be one operation named "' + operationName + '".';
}

/**
 * Unique operation names
 *
 * A GraphQL document is only valid if all defined operations have unique names.
 */

function UniqueOperationNames(context) {
  var knownOperationNames = _Object$create(null);
  return {
    OperationDefinition: function OperationDefinition(node) {
      var operationName = node.name;
      if (operationName) {
        if (knownOperationNames[operationName.value]) {
          context.reportError(new _error.GraphQLError(duplicateOperationNameMessage(operationName.value), [knownOperationNames[operationName.value], operationName]));
        } else {
          knownOperationNames[operationName.value] = operationName;
        }
      }
      return false;
    },
    FragmentDefinition: function FragmentDefinition() {
      return false;
    }
  };
}
},{"../../error":3,"babel-runtime/core-js/object/create":27}],158:[function(require,module,exports){

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.nonInputTypeOnVarMessage = nonInputTypeOnVarMessage;
exports.VariablesAreInputTypes = VariablesAreInputTypes;

var _error = require('../../error');

var _languagePrinter = require('../../language/printer');

var _typeDefinition = require('../../type/definition');

var _utilitiesTypeFromAST = require('../../utilities/typeFromAST');

function nonInputTypeOnVarMessage(variableName, typeName) {
  return 'Variable "$' + variableName + '" cannot be non-input type "' + typeName + '".';
}

/**
 * Variables are input types
 *
 * A GraphQL operation is only valid if all the variables it defines are of
 * input types (scalar, enum, or input object).
 */

function VariablesAreInputTypes(context) {
  return {
    VariableDefinition: function VariableDefinition(node) {
      var type = (0, _utilitiesTypeFromAST.typeFromAST)(context.getSchema(), node.type);

      // If the variable type is not an input type, return an error.
      if (type && !(0, _typeDefinition.isInputType)(type)) {
        var variableName = node.variable.name.value;
        context.reportError(new _error.GraphQLError(nonInputTypeOnVarMessage(variableName, (0, _languagePrinter.print)(node.type)), [node.type]));
      }
    }
  };
}
},{"../../error":3,"../../language/printer":19,"../../type/definition":125,"../../utilities/typeFromAST":135}],159:[function(require,module,exports){

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
exports.badVarPosMessage = badVarPosMessage;
exports.VariablesInAllowedPosition = VariablesInAllowedPosition;

var _error = require('../../error');

var _typeDefinition = require('../../type/definition');

var _utilitiesTypeComparators = require('../../utilities/typeComparators');

var _utilitiesTypeFromAST = require('../../utilities/typeFromAST');

function badVarPosMessage(varName, varType, expectedType) {
  return 'Variable "$' + varName + '" of type "' + varType + '" used in position ' + ('expecting type "' + expectedType + '".');
}

/**
 * Variables passed to field arguments conform to type
 */

function VariablesInAllowedPosition(context) {
  var varDefMap = _Object$create(null);

  return {
    OperationDefinition: {
      enter: function enter() {
        varDefMap = _Object$create(null);
      },
      leave: function leave(operation) {
        var usages = context.getRecursiveVariableUsages(operation);

        usages.forEach(function (_ref) {
          var node = _ref.node;
          var type = _ref.type;

          var varName = node.name.value;
          var varDef = varDefMap[varName];
          if (varDef && type) {
            // A var type is allowed if it is the same or more strict (e.g. is
            // a subtype of) than the expected type. It can be more strict if
            // the variable type is non-null when the expected type is nullable.
            // If both are list types, the variable item type can be more strict
            // than the expected item type (contravariant).
            var varType = (0, _utilitiesTypeFromAST.typeFromAST)(context.getSchema(), varDef.type);
            if (varType && !(0, _utilitiesTypeComparators.isTypeSubTypeOf)(effectiveType(varType, varDef), type)) {
              context.reportError(new _error.GraphQLError(badVarPosMessage(varName, varType, type), [varDef, node]));
            }
          }
        });
      }
    },
    VariableDefinition: function VariableDefinition(varDefAST) {
      varDefMap[varDefAST.variable.name.value] = varDefAST;
    }
  };
}

// If a variable definition has a default value, it's effectively non-null.
function effectiveType(varType, varDef) {
  return !varDef.defaultValue || varType instanceof _typeDefinition.GraphQLNonNull ? varType : new _typeDefinition.GraphQLNonNull(varType);
}
},{"../../error":3,"../../type/definition":125,"../../utilities/typeComparators":134,"../../utilities/typeFromAST":135,"babel-runtime/core-js/object/create":27}],160:[function(require,module,exports){

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

// Spec Section: "Operation Name Uniqueness"
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _rulesUniqueOperationNames = require('./rules/UniqueOperationNames');

// Spec Section: "Lone Anonymous Operation"

var _rulesLoneAnonymousOperation = require('./rules/LoneAnonymousOperation');

// Spec Section: "Fragment Spread Type Existence"

var _rulesKnownTypeNames = require('./rules/KnownTypeNames');

// Spec Section: "Fragments on Composite Types"

var _rulesFragmentsOnCompositeTypes = require('./rules/FragmentsOnCompositeTypes');

// Spec Section: "Variables are Input Types"

var _rulesVariablesAreInputTypes = require('./rules/VariablesAreInputTypes');

// Spec Section: "Leaf Field Selections"

var _rulesScalarLeafs = require('./rules/ScalarLeafs');

// Spec Section: "Field Selections on Objects, Interfaces, and Unions Types"

var _rulesFieldsOnCorrectType = require('./rules/FieldsOnCorrectType');

// Spec Section: "Fragment Name Uniqueness"

var _rulesUniqueFragmentNames = require('./rules/UniqueFragmentNames');

// Spec Section: "Fragment spread target defined"

var _rulesKnownFragmentNames = require('./rules/KnownFragmentNames');

// Spec Section: "Fragments must be used"

var _rulesNoUnusedFragments = require('./rules/NoUnusedFragments');

// Spec Section: "Fragment spread is possible"

var _rulesPossibleFragmentSpreads = require('./rules/PossibleFragmentSpreads');

// Spec Section: "Fragments must not form cycles"

var _rulesNoFragmentCycles = require('./rules/NoFragmentCycles');

// Spec Section: "All Variable Used Defined"

var _rulesNoUndefinedVariables = require('./rules/NoUndefinedVariables');

// Spec Section: "All Variables Used"

var _rulesNoUnusedVariables = require('./rules/NoUnusedVariables');

// Spec Section: "Directives Are Defined"

var _rulesKnownDirectives = require('./rules/KnownDirectives');

// Spec Section: "Argument Names"

var _rulesKnownArgumentNames = require('./rules/KnownArgumentNames');

// Spec Section: "Argument Uniqueness"

var _rulesUniqueArgumentNames = require('./rules/UniqueArgumentNames');

// Spec Section: "Argument Values Type Correctness"

var _rulesArgumentsOfCorrectType = require('./rules/ArgumentsOfCorrectType');

// Spec Section: "Argument Optionality"

var _rulesProvidedNonNullArguments = require('./rules/ProvidedNonNullArguments');

// Spec Section: "Variable Default Values Are Correctly Typed"

var _rulesDefaultValuesOfCorrectType = require('./rules/DefaultValuesOfCorrectType');

// Spec Section: "All Variable Usages Are Allowed"

var _rulesVariablesInAllowedPosition = require('./rules/VariablesInAllowedPosition');

// Spec Section: "Field Selection Merging"

var _rulesOverlappingFieldsCanBeMerged = require('./rules/OverlappingFieldsCanBeMerged');

// Spec Section: "Input Object Field Uniqueness"

var _rulesUniqueInputFieldNames = require('./rules/UniqueInputFieldNames');

/**
 * This set includes all validation rules defined by the GraphQL spec.
 */
var specifiedRules = [_rulesUniqueOperationNames.UniqueOperationNames, _rulesLoneAnonymousOperation.LoneAnonymousOperation, _rulesKnownTypeNames.KnownTypeNames, _rulesFragmentsOnCompositeTypes.FragmentsOnCompositeTypes, _rulesVariablesAreInputTypes.VariablesAreInputTypes, _rulesScalarLeafs.ScalarLeafs, _rulesFieldsOnCorrectType.FieldsOnCorrectType, _rulesUniqueFragmentNames.UniqueFragmentNames, _rulesKnownFragmentNames.KnownFragmentNames, _rulesNoUnusedFragments.NoUnusedFragments, _rulesPossibleFragmentSpreads.PossibleFragmentSpreads, _rulesNoFragmentCycles.NoFragmentCycles, _rulesNoUndefinedVariables.NoUndefinedVariables, _rulesNoUnusedVariables.NoUnusedVariables, _rulesKnownDirectives.KnownDirectives, _rulesKnownArgumentNames.KnownArgumentNames, _rulesUniqueArgumentNames.UniqueArgumentNames, _rulesArgumentsOfCorrectType.ArgumentsOfCorrectType, _rulesProvidedNonNullArguments.ProvidedNonNullArguments, _rulesDefaultValuesOfCorrectType.DefaultValuesOfCorrectType, _rulesVariablesInAllowedPosition.VariablesInAllowedPosition, _rulesOverlappingFieldsCanBeMerged.OverlappingFieldsCanBeMerged, _rulesUniqueInputFieldNames.UniqueInputFieldNames];
exports.specifiedRules = specifiedRules;
},{"./rules/ArgumentsOfCorrectType":137,"./rules/DefaultValuesOfCorrectType":138,"./rules/FieldsOnCorrectType":139,"./rules/FragmentsOnCompositeTypes":140,"./rules/KnownArgumentNames":141,"./rules/KnownDirectives":142,"./rules/KnownFragmentNames":143,"./rules/KnownTypeNames":144,"./rules/LoneAnonymousOperation":145,"./rules/NoFragmentCycles":146,"./rules/NoUndefinedVariables":147,"./rules/NoUnusedFragments":148,"./rules/NoUnusedVariables":149,"./rules/OverlappingFieldsCanBeMerged":150,"./rules/PossibleFragmentSpreads":151,"./rules/ProvidedNonNullArguments":152,"./rules/ScalarLeafs":153,"./rules/UniqueArgumentNames":154,"./rules/UniqueFragmentNames":155,"./rules/UniqueInputFieldNames":156,"./rules/UniqueOperationNames":157,"./rules/VariablesAreInputTypes":158,"./rules/VariablesInAllowedPosition":159}],161:[function(require,module,exports){

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

var _Map = require('babel-runtime/core-js/map')['default'];

var _Object$create = require('babel-runtime/core-js/object/create')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.validate = validate;
exports.visitUsingRules = visitUsingRules;

var _jsutilsInvariant = require('../jsutils/invariant');

var _jsutilsInvariant2 = _interopRequireDefault(_jsutilsInvariant);

var _error = require('../error');

var _languageVisitor = require('../language/visitor');

var _languageKinds = require('../language/kinds');

var Kind = _interopRequireWildcard(_languageKinds);

var _typeSchema = require('../type/schema');

var _utilitiesTypeInfo = require('../utilities/TypeInfo');

var _specifiedRules = require('./specifiedRules');

/**
 * Implements the "Validation" section of the spec.
 *
 * Validation runs synchronously, returning an array of encountered errors, or
 * an empty array if no errors were encountered and the document is valid.
 *
 * A list of specific validation rules may be provided. If not provided, the
 * default list of rules defined by the GraphQL specification will be used.
 *
 * Each validation rules is a function which returns a visitor
 * (see the language/visitor API). Visitor methods are expected to return
 * GraphQLErrors, or Arrays of GraphQLErrors when invalid.
 */

function validate(schema, ast, rules) {
  (0, _jsutilsInvariant2['default'])(schema, 'Must provide schema');
  (0, _jsutilsInvariant2['default'])(ast, 'Must provide document');
  (0, _jsutilsInvariant2['default'])(schema instanceof _typeSchema.GraphQLSchema, 'Schema must be an instance of GraphQLSchema. Also ensure that there are ' + 'not multiple versions of GraphQL installed in your node_modules directory.');
  var typeInfo = new _utilitiesTypeInfo.TypeInfo(schema);
  return visitUsingRules(schema, typeInfo, ast, rules || _specifiedRules.specifiedRules);
}

/**
 * This uses a specialized visitor which runs multiple visitors in parallel,
 * while maintaining the visitor skip and break API.
 *
 * @internal
 */

function visitUsingRules(schema, typeInfo, documentAST, rules) {
  var context = new ValidationContext(schema, documentAST, typeInfo);
  var visitors = rules.map(function (rule) {
    return rule(context);
  });
  // Visit the whole document with each instance of all provided rules.
  (0, _languageVisitor.visit)(documentAST, (0, _languageVisitor.visitWithTypeInfo)(typeInfo, (0, _languageVisitor.visitInParallel)(visitors)));
  return context.getErrors();
}

/**
 * An instance of this class is passed as the "this" context to all validators,
 * allowing access to commonly useful contextual information from within a
 * validation rule.
 */

var ValidationContext = (function () {
  function ValidationContext(schema, ast, typeInfo) {
    _classCallCheck(this, ValidationContext);

    this._schema = schema;
    this._ast = ast;
    this._typeInfo = typeInfo;
    this._errors = [];
    this._fragmentSpreads = new _Map();
    this._recursivelyReferencedFragments = new _Map();
    this._variableUsages = new _Map();
    this._recursiveVariableUsages = new _Map();
  }

  _createClass(ValidationContext, [{
    key: 'reportError',
    value: function reportError(error) {
      this._errors.push(error);
    }
  }, {
    key: 'getErrors',
    value: function getErrors() {
      return this._errors;
    }
  }, {
    key: 'getSchema',
    value: function getSchema() {
      return this._schema;
    }
  }, {
    key: 'getDocument',
    value: function getDocument() {
      return this._ast;
    }
  }, {
    key: 'getFragment',
    value: function getFragment(name) {
      var fragments = this._fragments;
      if (!fragments) {
        this._fragments = fragments = this.getDocument().definitions.reduce(function (frags, statement) {
          if (statement.kind === Kind.FRAGMENT_DEFINITION) {
            frags[statement.name.value] = statement;
          }
          return frags;
        }, {});
      }
      return fragments[name];
    }
  }, {
    key: 'getFragmentSpreads',
    value: function getFragmentSpreads(node) {
      var spreads = this._fragmentSpreads.get(node);
      if (!spreads) {
        spreads = [];
        var setsToVisit = [node.selectionSet];
        while (setsToVisit.length !== 0) {
          var set = setsToVisit.pop();
          for (var i = 0; i < set.selections.length; i++) {
            var selection = set.selections[i];
            if (selection.kind === Kind.FRAGMENT_SPREAD) {
              spreads.push(selection);
            } else if (selection.selectionSet) {
              setsToVisit.push(selection.selectionSet);
            }
          }
        }
        this._fragmentSpreads.set(node, spreads);
      }
      return spreads;
    }
  }, {
    key: 'getRecursivelyReferencedFragments',
    value: function getRecursivelyReferencedFragments(operation) {
      var fragments = this._recursivelyReferencedFragments.get(operation);
      if (!fragments) {
        fragments = [];
        var collectedNames = _Object$create(null);
        var nodesToVisit = [operation];
        while (nodesToVisit.length !== 0) {
          var _node = nodesToVisit.pop();
          var spreads = this.getFragmentSpreads(_node);
          for (var i = 0; i < spreads.length; i++) {
            var fragName = spreads[i].name.value;
            if (collectedNames[fragName] !== true) {
              collectedNames[fragName] = true;
              var fragment = this.getFragment(fragName);
              if (fragment) {
                fragments.push(fragment);
                nodesToVisit.push(fragment);
              }
            }
          }
        }
        this._recursivelyReferencedFragments.set(operation, fragments);
      }
      return fragments;
    }
  }, {
    key: 'getVariableUsages',
    value: function getVariableUsages(node) {
      var _this = this;

      var usages = this._variableUsages.get(node);
      if (!usages) {
        (function () {
          usages = [];
          var typeInfo = new _utilitiesTypeInfo.TypeInfo(_this._schema);
          (0, _languageVisitor.visit)(node, (0, _languageVisitor.visitWithTypeInfo)(typeInfo, {
            VariableDefinition: function VariableDefinition() {
              return false;
            },
            Variable: function Variable(variable) {
              usages.push({ node: variable, type: typeInfo.getInputType() });
            }
          }));
          _this._variableUsages.set(node, usages);
        })();
      }
      return usages;
    }
  }, {
    key: 'getRecursiveVariableUsages',
    value: function getRecursiveVariableUsages(operation) {
      var usages = this._recursiveVariableUsages.get(operation);
      if (!usages) {
        usages = this.getVariableUsages(operation);
        var fragments = this.getRecursivelyReferencedFragments(operation);
        for (var i = 0; i < fragments.length; i++) {
          Array.prototype.push.apply(usages, this.getVariableUsages(fragments[i]));
        }
        this._recursiveVariableUsages.set(operation, usages);
      }
      return usages;
    }
  }, {
    key: 'getType',
    value: function getType() {
      return this._typeInfo.getType();
    }
  }, {
    key: 'getParentType',
    value: function getParentType() {
      return this._typeInfo.getParentType();
    }
  }, {
    key: 'getInputType',
    value: function getInputType() {
      return this._typeInfo.getInputType();
    }
  }, {
    key: 'getFieldDef',
    value: function getFieldDef() {
      return this._typeInfo.getFieldDef();
    }
  }, {
    key: 'getDirective',
    value: function getDirective() {
      return this._typeInfo.getDirective();
    }
  }, {
    key: 'getArgument',
    value: function getArgument() {
      return this._typeInfo.getArgument();
    }
  }]);

  return ValidationContext;
})();

exports.ValidationContext = ValidationContext;
},{"../error":3,"../jsutils/invariant":11,"../language/kinds":15,"../language/visitor":21,"../type/schema":129,"../utilities/TypeInfo":130,"./specifiedRules":160,"babel-runtime/core-js/map":25,"babel-runtime/core-js/object/create":27,"babel-runtime/helpers/class-call-check":34,"babel-runtime/helpers/create-class":35,"babel-runtime/helpers/interop-require-default":39,"babel-runtime/helpers/interop-require-wildcard":40}],162:[function(require,module,exports){
var _graphql = require('graphql');
var GraphQLSchemaLanguage = require('graphql/language');

var schema = new _graphql.GraphQLSchema({
  query: new _graphql.GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      hello: {
        type: _graphql.GraphQLString,
        resolve: function resolve() {
          return 'world';
        }
      }
    }
  })
});
console.log(GraphQLSchemaLanguage.parseSchemaIntoAST(schema));
var query = '{ hello }';

_graphql.graphql(schema, query)
  .then(function (result) {

  // Prints
  // {
  //   data: { hello: "world" }
  // }
  console.log(result);
});
},{"graphql":9,"graphql/language":14}]},{},[162]);
