// @flow

import isPlainObject from 'lodash/isPlainObject';

import {DispatchError} from './errors';
import {Value, Type} from './types';


export class Dispatcher {
  _functions: {};

  constructor() {
    this._functions = {};
  }

  register(name: string, signatures: Array<Array<Type>>, implementation: (...args: Array<Value<mixed>>) => Value<mixed>): void {
    if (!this._functions[name]) {
      this._functions[name] = {};
    }

    if (signatures.length) {
      signatures.forEach((signature) => {
        let sig = signature.map((type) => type.name).join('-');
        this._functions[name][sig] = implementation;
      });
    } else {
      this._functions[name] = implementation;
    }
  }

  call(name: string, args: Array<Value<mixed>>): Value<mixed> {
    let spec = this._functions[name];
    if (!spec) {
      throw new DispatchError(`No implementation exists for "${name}"`);
    }

    let func;
    if (!isPlainObject(spec)) {
      func = spec;
    } else {
      let argTypes = args.map((arg) => arg.dataType.name);
      func = spec[argTypes.join('-')];
      if (!func) {
        throw new DispatchError(
          `"${name}" cannot be invoked on arguments of type: ${argTypes.join(', ')}`
        );
      }
    }

    return func(...args);
  }
}


export const UNARY_OPERATORS = new Dispatcher();
export const BINARY_OPERATORS = new Dispatcher();
export const FUNCTIONS = new Dispatcher();

