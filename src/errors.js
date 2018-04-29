// @flow

import type Token from './Token';
import type {Value, Type} from './types';


export class BexlError extends Error {
  constructor(...params: Array<mixed>) {
    super(...params);
    this.name = 'BexlError';
    this.constructor = Error;
    this.__proto__ = Error.prototype;
  }
}


export class LexerError extends BexlError {
  line: number;
  column: number;

  constructor(message: string, line: number, column: number) {
    super(message);
    this.name = 'LexerError';
    this.constructor = BexlError;
    this.__proto__ = BexlError.prototype;
    this.line = line;
    this.column = column;
  }
}


export class ParserError extends BexlError {
  token: Token;

  constructor(message: string, token: Token) {
    super(message);
    this.name = 'ParserError';
    this.constructor = BexlError;
    this.__proto__ = BexlError.prototype;
    this.token = token;
  }

  get line(): ?number {
    return this.token ? this.token.line : undefined;
  }

  get column(): ?number {
    return this.token ? this.token.column : undefined;
  }
}


export class InterpreterError extends BexlError {
  node: ?Node;

  constructor(message: string, node?: Node) {
    super(message);
    this.name = 'InterpreterError';
    this.constructor = BexlError;
    this.__proto__ = BexlError.prototype;
    this.node = node;
  }
}


export class ResolverError extends InterpreterError {
  constructor(message: string) {
    super(message);
    this.name = 'ResolverError';
    this.constructor = InterpreterError;
    this.__proto__ = InterpreterError.prototype;
  }
}


export class DispatchError extends InterpreterError {
  constructor(message: string) {
    super(message);
    this.name = 'DispatchError';
    this.constructor = InterpreterError;
    this.__proto__ = InterpreterError.prototype;
  }
}


export class ExecutionError extends InterpreterError {
  constructor(message: string) {
    super(message);
    this.name = 'ExecutionError';
    this.constructor = InterpreterError;
    this.__proto__ = InterpreterError.prototype;
  }
}

export class ConversionError extends InterpreterError {
  value: Value<mixed>;
  dataType: Type;

  constructor(message: string, value: Value<mixed>, dataType: Type) {
    super(message);
    this.name = 'ConversionError';
    this.constructor = InterpreterError;
    this.__proto__ = InterpreterError.prototype;
    this.value = value;
    this.dataType = dataType;
  }
}

