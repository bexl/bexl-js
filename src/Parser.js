// @flow

import {ParserError} from './errors';
import Lexer from './Lexer';
import * as nodes from './nodes';
import Token from './Token';
import TokenType from './TokenType';
import Type from './types/Type';


export default class Parser {
  lexer: Class<Lexer>;
  _current: number;
  _tokens: Array<Token>;

  constructor(lexer: Class<Lexer> = Lexer) {
    this.lexer = lexer;
    this._reset();
  }

  parse(source: string): nodes.Node {
    this._reset();
    let lexer = new this.lexer(source);
    this._tokens = lexer.lex();

    let expression = this._expression();

    if (!this._isAtEnd()) {
      let token = this._peek();
      throw new ParserError(`Unexpected token ${token.name}`, token);
    }

    return expression;
  }

  _reset() {
    this._current = 0;
    this._tokens = [];
  }

  _peek(): Token {
    return this._tokens[this._current];
  }

  _isAtEnd(): boolean {
    return this._peek().tokenType === TokenType.EOF;
  }

  _check(tokenType: TokenType): boolean {
    if (this._isAtEnd()) {
      return false;
    }
    return this._peek().tokenType === tokenType;
  }

  _previous(): Token {
    return this._tokens[this._current - 1];
  }

  _advance(): Token {
    if (!this._isAtEnd()) {
      this._current += 1;
    }
    return this._previous();
  }

  _match(...args: Array<TokenType>): boolean {
    for (let i = 0; i < args.length; i++) {
      if (this._check(args[i])) {
        this._advance();
        return true;
      }
    }
    return false;
  }

  _consume(tokenType: TokenType, errorMsg?: string): Token {
    if (this._check(tokenType)) {
      return this._advance();
    }
    if (!errorMsg) {
      errorMsg = `Expected token ${tokenType.name}`;
    }
    throw new ParserError(errorMsg, this._peek());
  }

  _args(endToken: TokenType): Array<nodes.Node> {
    let args = [];

    while (!this._check(endToken)) {
      args.push(this._expression());
      if (!this._match(TokenType.COMMA)) {
        break;
      }
    }

    this._consume(endToken);
    return args;
  }

  _literal(): ?nodes.Literal {
    if (this._match(TokenType.INTEGER)) {
      return new nodes.Literal(this._previous(), Type.INTEGER);
    }
    if (this._match(TokenType.FLOAT)) {
      return new nodes.Literal(this._previous(), Type.FLOAT);
    }
    if (this._match(TokenType.STRING)) {
      return new nodes.Literal(this._previous(), Type.STRING);
    }
    if (this._match(TokenType.FALSE)) {
      return new nodes.Literal(this._previous(), Type.BOOLEAN, false);
    }
    if (this._match(TokenType.TRUE)) {
      return new nodes.Literal(this._previous(), Type.BOOLEAN, true);
    }
    if (this._match(TokenType.NULL)) {
      return new nodes.Literal(this._previous(), Type.UNTYPED, null);
    }
  }

  _primary(): nodes.Node {
    let literal = this._literal();
    if (literal) {
      return literal;
    }

    if (this._match(TokenType.IDENTIFIER)) {
      let identifier = this._previous();
      this._consume(TokenType.LEFT_PAREN);
      let args = this._args(TokenType.RIGHT_PAREN);
      let end = this._previous();
      return new nodes.Function(identifier, end, args);
    }

    if (this._match(TokenType.LEFT_PAREN)) {
      let start = this._previous();
      let expr = this._expression();
      let end = this._consume(TokenType.RIGHT_PAREN);
      return new nodes.Grouping(start, end, expr);
    }

    if (this._match(TokenType.LEFT_BRACKET)) {
      let start = this._previous();
      let args = this._args(TokenType.RIGHT_BRACKET);
      let end = this._previous();
      return new nodes.List(start, end, args);
    }

    if (this._match(TokenType.DOLLAR)) {
      let identifier = this._consume(TokenType.IDENTIFIER);
      return new nodes.Variable(identifier);
    }

    let token = this._peek();
    throw new ParserError(`Unexpected token ${token.name}`, token);
  }

  _unary(): nodes.Node {
    if (this._match(TokenType.BANG, TokenType.MINUS)) {
      return new nodes.Unary(this._previous(), this._unary());
    }

    let primary = this._primary();

    while (true) {  // eslint-disable-line no-constant-condition
      if (this._match(TokenType.LEFT_BRACKET)) {
        let start, end;

        if (this._match(TokenType.COLON)) {
          end = this._expression();
        } else {
          start = this._expression();
          if (this._match(TokenType.COLON)) {
            if (!this._check(TokenType.RIGHT_BRACKET)) {
              end = this._expression();
            } else {
              end = null;
            }
          }
        }

        let endToken = this._consume(TokenType.RIGHT_BRACKET);

        primary = new nodes.Indexing(
          primary.startToken,
          endToken,
          primary,
          end === undefined ? start : null,
          end === undefined ? null : start,
          end,
        );

      } else if (this._match(TokenType.PERIOD)) {
        let identifier = this._consume(TokenType.IDENTIFIER);
        primary = new nodes.Property(
          primary.startToken,
          identifier,
          primary,
        );

      } else {
        break;
      }
    }

    return primary;
  }

  _binary(term: () => nodes.Node, ...operators: Array<TokenType>): nodes.Node {
    term = term.bind(this);
    let expr = term();

    while (this._match(...operators)) {
      let oper = this._previous();
      let right = term();
      expr = new nodes.Binary(expr, oper, right);
    }

    return expr;
  }

  _factor(): nodes.Node {
    return this._binary(
      this._unary,
      TokenType.SLASH,
      TokenType.STAR,
      TokenType.STAR_STAR,
      TokenType.PERCENT,
    );
  }

  _term(): nodes.Node {
    return this._binary(
      this._factor,
      TokenType.MINUS,
      TokenType.PLUS,
    );
  }

  _comparison(): nodes.Node {
    return this._binary(
      this._term,
      TokenType.EQUAL_EQUAL,
      TokenType.BANG_EQUAL,
      TokenType.LESSER,
      TokenType.LESSER_EQUAL,
      TokenType.GREATER,
      TokenType.GREATER_EQUAL,
    );
  }

  _boolean(): nodes.Node {
    return this._binary(
      this._comparison,
      TokenType.AMPERSAND,
      TokenType.PIPE,
      TokenType.CARET,
    );
  }

  _expression(): nodes.Node {
    return this._boolean();
  }
}

