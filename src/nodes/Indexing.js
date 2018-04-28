// @flow

import Node from './Node';
import Token from '../Token';


export default class Indexing extends Node {
  expression: Node;
  index: ?Node;
  start: ?Node;
  end: ?Node;

  constructor(startToken: Token, endToken: Token, expression: Node, index: ?Node, start: ?Node, end: ?Node) {
    super('indexing', startToken, endToken);
    this.expression = expression;
    this.index = index;
    this.start = start;
    this.end = end;
  }

  pretty(indent: number = 0, indentIncrement: number = 2): string {
    let pad = ' '.repeat(indent);
    let expr = this.expression.pretty(
      indent + indentIncrement,
      indentIncrement,
    );
    let loc;

    if (this.index == null) {
      let inner = ' '.repeat(indent + indentIncrement);
      let nul = `${inner} ${' '.repeat(indentIncrement)}null`;
      let start = this.start ? this.start.pretty(
        indent + (indentIncrement * 2),
        indentIncrement,
      ) : nul;
      let end = this.end ? this.end.pretty(
        indent + (indentIncrement * 2),
        indentIncrement,
      ) : nul;
      loc = `${inner}(\n${start},\n${end}\n${inner})`;
    } else {
      loc = this.index.pretty(
        indent + indentIncrement,
        indentIncrement,
      );
    }

    return `${pad}Indexing(\n${expr},\n${loc}\n${pad})`;
  }
}

