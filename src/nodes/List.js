// @flow

import Node from './Node';
import Token from '../Token';


export default class List extends Node {
  elements: Array<Node>;

  constructor(startToken: Token, endToken: Token, elements: Array<Node>) {
    super('list', startToken, endToken);
    this.elements = elements;
  }

  pretty(indent: number = 0, indentIncrement: number = 2): string {
    let pad = ' '.repeat(indent);
    let elements = this.elements.map(
      (element) => element.pretty(indent + indentIncrement, indentIncrement)
    ).join(',\n');

    return `${pad}List(\n${elements}\n${pad})`;
  }
}

