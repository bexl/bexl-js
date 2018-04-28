// @flow

import mapValues from 'lodash/mapValues';

import Type from './Type';
import Value from './Value';


type Record = {
  [string]: Value<mixed>,
};

export default class RecordValue extends Value<Record> {
  constructor(rawValue: ?Record) {
    super(Type.RECORD, rawValue);
  }

  get isEmpty(): boolean {
    return this.isNull || (Object.keys(this.rawValue || {}).length === 0);
  }

  get value(): ?{} {
    if (this.isNull) {
      return null;
    }
    return mapValues(this.rawValue || {}, (value) => value.value);
  }

  toPlainString(): string {
    if (this.isNull) {
      return 'NULL';
    }
    let rec = this.rawValue || {};
    let out = Object.keys(rec).map((name) =>
      `${name}: ${rec[name].toPlainString()}`
    ).join(', ');
    return `{${out}}`;
  }

  toString(): string {
    let val;
    if (this.isNull) {
      val = 'NULL';
    } else {
      let rec = this.rawValue || {};
      val = Object.keys(rec).map((name) =>
        `${name}: ${rec[name].toString()}`
      ).join(', ');
    }
    return `${this.constructor.name}(${val})`;
  }

  // $FlowFixMe
  static fromValue(value: Value<mixed>): RecordValue {
    if (value.isNull || (value.dataType === Type.RECORD)) {
      return new RecordValue(value.rawValue);
    }

    throw this._makeConversionError(value, Type.RECORD);
  }
}

