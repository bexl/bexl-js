// @flow

import Node from './Node';
import Token from '../Token';


export default class Variable extends Node {
  constructor(token: Token) {
    super('variable', token, token);
  }

  get name(): string {
    return this.startToken.lexeme || '';
  }

  pretty(indent: number = 0): string {
    let pad = ' '.repeat(indent);
    return `${pad}Variable(${this.name})`;
  }
}

