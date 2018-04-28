// @flow

import Node from './Node';
import Token from '../Token';


export default class Unary extends Node {
  operator: Token;
  right: Node;

  constructor(operator: Token, right: Node) {
    super('unary', operator, right.endToken);
    this.operator = operator;
    this.right = right;
  }

  pretty(indent: number = 0, indentIncrement: number = 2): string {
    let pad = ' '.repeat(indent);
    let inner = ' '.repeat(indent + indentIncrement);
    let right = this.right.pretty(indent + indentIncrement, indentIncrement);

    return `${pad}Unary(\n${inner}${this.operator.name},\n${right}\n${pad})`;
  }
}

