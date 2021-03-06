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