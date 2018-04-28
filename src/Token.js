// @flow

import TokenType from './TokenType';


export default class Token {
  tokenType: TokenType;
  lexeme: ?string;
  literal: ?(string | number);
  line: number;
  column: number;
  length: number;

  constructor(tokenType: TokenType, lexeme?: string, literal?: string | number, line: number, column: number, length: number) {
    this.tokenType = tokenType;
    this.lexeme = lexeme;
    this.literal = literal;
    this.line = line;
    this.column = column;
    this.length = length;
  }

  get name(): string {
    return this.tokenType.name;
  }

  pretty(indent: number = 0): string {
    let pad = ' '.repeat(indent);
    let type = this.tokenType.name;
    let value = this.literal || this.lexeme || '';
    return `${pad}Token(${this.line}:${this.column}, ${type}, "${value}")`;
  }
}

