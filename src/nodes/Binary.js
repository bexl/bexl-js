// @flow

import Node from './Node';
import Token from '../Token';


export default class Binary extends Node {
  operator: Token;
  left: Node;
  right: Node;

  constructor(left: Node, operator: Token, right: Node) {
    super('binary', left.startToken, right.endToken);
    this.left = left;
    this.operator = operator;
    this.right = right;
  }

  get name(): string {
    return this.operator.name;
  }

  pretty(indent: number = 0, indentIncrement: number = 2): string {
    let pad = ' '.repeat(indent);
    let inner = ' '.repeat(indent + indentIncrement);
    let left = this.left.pretty(indent + indentIncrement, indentIncrement);
    let right = this.right.pretty(indent + indentIncrement, indentIncrement);

    return `${pad}Binary(\n${inner}${this.operator.name},\n${left},\n${right}\n${pad})`;
  }
}

