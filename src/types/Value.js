// @flow

import isEqual from 'lodash/isEqual';

import {ConversionError} from '../errors';
import Type from './Type';


export default class Value<T> {
  dataType: Type;
  rawValue: ?T;

  constructor(dataType: Type, rawValue: ?T) {
    this.dataType = dataType;
    this.rawValue = rawValue;
  }

  get value(): ?mixed {
    return this.rawValue;
  }

  get isNull(): boolean {
    return this.rawValue == null;
  }

  get isEmpty(): boolean {
    return this.isNull;
  }

  equal(other: Value<T>): boolean {
    // $FlowFixMe
    return isEqual(this.rawValue, other.rawValue);
  }

  notEqual(other: Value<T>): boolean {
    // $FlowFixMe
    return !isEqual(this.rawValue, other.rawValue);
  }

  greater(other: Value<T>): boolean {
    // $FlowFixMe
    return this.rawValue > other.rawValue;
  }

  greaterEqual(other: Value<T>): boolean {
    // $FlowFixMe
    return this.rawValue >= other.rawValue;
  }

  lesser(other: Value<T>): boolean {
    // $FlowFixMe
    return this.rawValue < other.rawValue;
  }

  lesserEqual(other: Value<T>): boolean {
    // $FlowFixMe
    return this.rawValue <= other.rawValue;
  }

  toPlainString(): string {
    return this.isNull ? 'NULL' : String(this.rawValue);
  }

  toString(): string {
    return `${this.constructor.name}(${this.toPlainString()})`;
  }

  static _makeConversionError(value: Value<mixed>, dataType: Type): ConversionError {
    return new ConversionError(
      `Cannot convert "${String(value.rawValue)}" to ${dataType.name}`,
      value,
      dataType,
    );
  }
}

