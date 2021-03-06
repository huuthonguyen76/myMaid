
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