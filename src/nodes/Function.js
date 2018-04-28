// @flow

import Node from './Node';
import Token from '../Token';


export default class Function extends Node {
  args: Array<Node>;

  constructor(startToken: Token, endToken: Token, args: Array<Node>) {
    super('function', startToken, endToken);
    this.args = args;
  }

  get name(): string {
    return this.startToken.lexeme || '';
  }

  pretty(indent: number = 0, indentIncrement: number = 2): string {
    let pad = ' '.repeat(indent);
    let inner = ' '.repeat(indent + indentIncrement);
    let args = [`${inner}"${this.name}"`].concat(this.args.map(
      (arg) => arg.pretty(indent + indentIncrement, indentIncrement)
    )).join(',\n');

    return `${pad}Function(\n${args}\n${pad})`;
  }
}

