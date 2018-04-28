// @flow

import isPlainObject from 'lodash/isPlainObject';
import mapValues from 'lodash/mapValues';

import {BexlError, ResolverError} from './errors';
import {Value, jsToBexl} from './types';


export default class VariableResolver {
  _variables: {};

  constructor(values: ?{[string]: mixed}) {
    this._variables = mapValues(values || {}, (val) => jsToBexl(val));
  }

  get(name: string): Value<mixed> {
    if (this._variables[name]) {
      return this._variables[name];
    }
    throw new ResolverError(`Could not resolve variable "${name}"`);
  }

  set(name: string, value: mixed) {
    if (!(value instanceof Value)) {
      value = jsToBexl(value);
    }
    this._variables[name] = value;
  }

  remove(name: string) {
    delete this._variables[name];
  }

  all(): {} {
    return this._variables;
  }

  static makeFrom(value: ?({} | VariableResolver)): VariableResolver {
    value = value || {};

    if (value instanceof VariableResolver) {
      return value;
    }

    if (isPlainObject(value)) {
      return new VariableResolver(value);
    }

    throw new BexlError(
      `Cannot create VariableResolver from: ${String(value)}`,
    );
  }
}

