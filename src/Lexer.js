// @flow

import {LexerError} from './errors';
import Token from './Token';
import TokenType from './TokenType';


type TokenMap = {
  [string]: TokenMap,
  _default: TokenType,
};

const TOKEN_MAP: {[string]: TokenMap} = {
    '+': {
        _default: TokenType.PLUS,
    },
    '-': {
        _default: TokenType.MINUS,
    },
    '/': {
        _default: TokenType.SLASH,
    },
    '%': {
        _default: TokenType.PERCENT,
    },
    '&': {
        _default: TokenType.AMPERSAND,
    },
    '|': {
        _default: TokenType.PIPE,
    },
    '^': {
        _default: TokenType.CARET,
    },
    '(': {
        _default: TokenType.LEFT_PAREN,
    },
    ')': {
        _default: TokenType.RIGHT_PAREN,
    },
    '[': {
        _default: TokenType.LEFT_BRACKET,
    },
    ']': {
        _default: TokenType.RIGHT_BRACKET,
    },
    ',': {
        _default: TokenType.COMMA,
    },
    '$': {
        _default: TokenType.DOLLAR,
    },
    ':': {
        _default: TokenType.COLON,
    },
    '.': {
        _default: TokenType.PERIOD,
    },
    '*': {
        '*': {
            _default: TokenType.STAR_STAR,
        },
        _default: TokenType.STAR,
    },
    '!': {
        '=': {
            _default: TokenType.BANG_EQUAL,
        },
        _default: TokenType.BANG,
    },
    '<': {
        '=': {
            _default: TokenType.LESSER_EQUAL,
        },
        _default: TokenType.LESSER,
    },
    '>': {
        '=': {
            _default: TokenType.GREATER_EQUAL,
        },
        _default: TokenType.GREATER,
    },
};


const KEYWORD_TOKENS = {
  True: TokenType.TRUE,
  False: TokenType.FALSE,
  Null: TokenType.NULL,
};


export default class Lexer {
  source: string;
  _start: number;
  _current: number;
  _line: number;
  _lineStart: number;

  constructor(source: string) {
    this.source = source;
    this._reset();
  }

  lex(): Array<Token> {
    this._reset();

    let tokens = [];

    while (true) {  // eslint-disable-line no-constant-condition
      let token = this._scanToken();
      tokens.push(token);
      if (token.tokenType === TokenType.EOF) {
        break;
      }
    }

    return tokens;
  }

  _reset(): void {
    this._start = 0;
    this._current = 0;
    this._line = 0;
    this._lineStart = 0;
  }

  _isAtEnd(): boolean {
    return this._current >= this.source.length;
  }

  _advance(depth: number = 1): string {
    this._current += depth;
    return this.source[this._current - 1];
  }

  _peek(depth: number = 1): ?string {
    let pos = this._current + (depth - 1);
    if (pos >= this.source.length) {
      return null;
    }
    return this.source[pos];
  }

  _match(character: string): boolean {
    if (this._peek() === character) {
      this._advance();
      return true;
    }
    return false;
  }

  _isWhitespace(character: ?string): boolean {
    return /[\s]/.test(character || '');
  }

  _isDigit(character: ?string): boolean {
    return /[0-9]/.test(character || '');
  }

  _isAlpha(character: ?string): boolean {
    return /[a-zA-Z]/.test(character || '');
  }

  _isAlphaNumeric(character: ?string): boolean {
    return this._isDigit(character) || this._isAlpha(character);
  }

  _isIdentifierCharacter(character: ?string): boolean {
    return ('_' === character) || this._isAlphaNumeric(character);
  }

  _findInMap(map: TokenMap): TokenType {
    if (Object.keys(map).length === 1) {
      return map._default;
    }

    let character = this._peek();
    if (character && (character in map)) {
      return this._findInMap(map[this._advance()]);
    }

    return map._default;
  }

  _makeError(message: string): LexerError {
    return new LexerError(
      message,
      this._line,
      (this._start - this._lineStart),
    );
  }

  _makeToken(tokenType: TokenType, literal?: string | number, length?: number, srcLine?: number, srcColumn?: number): Token {
    let text;
    if (tokenType !== TokenType.EOF) {
      text = this.source.substring(this._start, this._current);
    }

    let tokLine = srcLine || this._line;
    let tokColumn = srcColumn || (this._start - this._lineStart);

    if (!length) {
      length = literal ? String(literal).length : (this._current - this._start);
    }

    return new Token(tokenType, text, literal, tokLine, tokColumn, length);
  }

  _makeString(): Token {
    let sLine = this._line;
    let sColumn = this._current - 1;

    while (!this._isAtEnd() && (this._peek() !== "'")) {
      let character = this._advance();

      if (character === "\\") {
        if (this._peek() === "'") {
          this._advance();
        }
      } else if (character === "\n") {
        this._line += 1;
        this._lineStart = this._current + 1;
      }
    }

    if (this._isAtEnd()) {
      throw this._makeError('Unterminated string literal');
    }

    this._advance();
    let value = this.source.substring(this._start + 1, this._current - 1);
    let length = value.length + 2;
    value = value.replace("\\'", "'");

    return this._makeToken(TokenType.STRING, value, length, sLine, sColumn);
  }

  _makeNumber(): Token {
    let decimal = this._peek(0) === '.';

    while (this._isDigit(this._peek())) {
      this._advance();
    }

    if (!decimal && (this._peek() === '.') && this._isDigit(this._peek(2))) {
      decimal = true;
      this._advance();
      while (this._isDigit(this._peek())) {
        this._advance();
      }
    }

    if (['e', 'E'].includes(this._peek())) {
      let after = this._peek(2);
      if (['+', '-'].includes(after) || this._isDigit(after)) {
        this._advance(2);
        while (this._isDigit(this._peek())) {
          this._advance();
        }
      }
    }

    let lexeme = this.source.substring(this._start, this._current).toLowerCase();
    return this._makeToken(
      (lexeme.includes('e') || lexeme.includes('.')) ? TokenType.FLOAT : TokenType.INTEGER,
      Number(lexeme),
      lexeme.length,
    );
  }

  _makeIdentifier(): Token {
    while (this._isIdentifierCharacter(this._peek())) {
      this._advance();
    }
    let text = this.source.substring(this._start, this._current);
    if (text in KEYWORD_TOKENS) {
      return this._makeToken(KEYWORD_TOKENS[text]);
    }
    return this._makeToken(TokenType.IDENTIFIER);
  }

  _scanToken(): Token {
    this._start = this._current;
    if (this._isAtEnd()) {
      return this._makeToken(TokenType.EOF);
    }

    let character = this._advance();

    if (character in TOKEN_MAP) {
      return this._makeToken(this._findInMap(TOKEN_MAP[character]));
    }

    if ((character === '=') && this._match('=')) {
      return this._makeToken(TokenType.EQUAL_EQUAL);
    }

    if (this._isWhitespace(character)) {
      if (character === '\n') {
        this._line += 1;
        this._lineStart = this._current;
      }
      return this._scanToken();
    }

    if (character === "'") {
      return this._makeString();
    }

    if (this._isDigit(character)) {
      return this._makeNumber();
    }

    if (this._isAlpha(character)) {
      return this._makeIdentifier();
    }

    throw this._makeError(`Unexpected character "${character}"`);
  }
}

