// @flow

import Node from './Node';
import Token from '../Token';


export default class Property extends Node {
  expression: Node;

  constructor(startToken: Token, endToken: Token, expression: Node) {
    super('property', startToken, endToken);
    this.expression = expression;
  }

  get name(): string {
    return this.endToken.lexeme || '';
  }

  pretty(indent: number = 0, indentIncrement: number = 2): string {
    let pad = ' '.repeat(indent);
    let inner = ' '.repeat(indent + indentIncrement);
    let expr = this.expression.pretty(
      indent + indentIncrement,
      indentIncrement,
    );

    return `${pad}Property(\n${inner}"${this.name}",\n${expr}\n${pad})`;
  }
}

