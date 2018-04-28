// @flow

import Node from './Node';
import Token from '../Token';


export default class Grouping extends Node {
  expression: Node;

  constructor(startToken: Token, endToken: Token, expression: Node) {
    super('grouping', startToken, endToken);
    this.expression = expression;
  }

  pretty(indent: number = 0, indentIncrement: number = 2): string {
    let pad = ' '.repeat(indent);
    let expr = this.expression.pretty(indent + indentIncrement, indentIncrement);

    return `${pad}Grouping(\n${expr}\n${pad})`;
  }
}

