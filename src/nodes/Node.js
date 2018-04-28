// @flow

import Token from '../Token';


export default class Node {
  type: string;
  startToken: Token;
  endToken: Token;

  constructor(type: string, startToken: Token, endToken: Token) {
    this.type = type;
    this.startToken = startToken;
    this.endToken = endToken;
  }

  accept(visitor: {}, ...args: Array<mixed>) {
    return visitor[`visit_${this.type}`](this, ...args);
  }

  get name(): string {
    return this.startToken.name;
  }

  pretty(indent: number = 0, indentIncrement: number = 2): string {  // eslint-disable-line no-unused-vars
    return '';
  }
}

