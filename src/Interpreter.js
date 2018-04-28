// @flow

import {InterpreterError} from './errors';
import VariableResolver from './VariableResolver';
import * as nodes from './nodes';
import {Type, makeValue, Value} from './types';
import {UNARY_OPERATORS, BINARY_OPERATORS, FUNCTIONS} from './Dispatcher';


export default class Interpreter {
  interpret(tree: nodes.Node, resolver: ?({} | VariableResolver) = null): Value<mixed> {
    resolver = VariableResolver.makeFrom(resolver);
    return tree.accept(this, resolver);
  }

  visit_literal(node: nodes.Literal): Value<mixed> {
    return makeValue(node.dataType, node.value);
  }

  visit_grouping(node: nodes.Grouping, resolver: VariableResolver): Value<mixed> {
    return node.expression.accept(this, resolver);
  }

  visit_list(node: nodes.List, resolver: VariableResolver): Value<mixed> {
    return makeValue(
      Type.LIST,
      node.elements.map((element) => element.accept(this, resolver)),
    );
  }

  visit_variable(node: nodes.Variable, resolver: VariableResolver): Value<mixed> {
    try {
      return resolver.get(node.name);
    } catch (exc) {
      if (exc instanceof InterpreterError) {
        exc.node = node;
      }
      throw exc;
    }
  }

  visit_property(node: nodes.Property, resolver: VariableResolver): Value<mixed> {
    let expression = node.expression.accept(this, resolver);
    let property = makeValue(Type.STRING, node.name);
    try {
      return FUNCTIONS.call('property', [expression, property]);
    } catch (exc) {
      if (exc instanceof InterpreterError) {
        exc.node = node;
      }
      throw exc;
    }
  }

  visit_indexing(node: nodes.Indexing, resolver: VariableResolver): Value<mixed> {
    let expression = node.expression.accept(this, resolver);
    if (node.index != null) {
      let index = node.index.accept(this, resolver);
      try {
        return FUNCTIONS.call('at', [expression, index]);
      } catch (exc) {
        if (exc instanceof InterpreterError) {
          exc.node = node;
        }
        throw exc;
      }
    } else {
      let start, end;
      if (node.start) {
        start = node.start.accept(this, resolver);
      } else {
        start = makeValue(Type.INTEGER, 0);
      }
      if (node.end) {
        end = node.end.accept(this, resolver);
      }

      try {
        if (end) {
          return FUNCTIONS.call('slice', [expression, start, end]);
        }
        return FUNCTIONS.call('slice', [expression, start]);
      } catch (exc) {
        if (exc instanceof InterpreterError) {
          exc.node = node;
        }
        throw exc;
      }
    }
  }

  visit_unary(node: nodes.Unary, resolver: VariableResolver): Value<mixed> {
    let right = node.right.accept(this, resolver);
    try {
      return UNARY_OPERATORS.call(node.name, [right]);
    } catch (exc) {
      if (exc instanceof InterpreterError) {
        exc.node = node;
      }
      throw exc;
    }
  }

  visit_binary(node: nodes.Binary, resolver: VariableResolver): Value<mixed> {
    let left = node.left.accept(this, resolver);
    let right = node.right.accept(this, resolver);
    try {
      return BINARY_OPERATORS.call(node.name, [left, right]);
    } catch (exc) {
      if (exc instanceof InterpreterError) {
        exc.node = node;
      }
      throw exc;
    }
  }

  visit_function(node: nodes.Function, resolver: VariableResolver): Value<mixed> {
    let args = (node.args || []).map((arg) => arg.accept(this, resolver));
    try {
      return FUNCTIONS.call(node.name, args);
    } catch (exc) {
      if (exc instanceof InterpreterError) {
        exc.node = node;
      }
      throw exc;
    }
  }
}

