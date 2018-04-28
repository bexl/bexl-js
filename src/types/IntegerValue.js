// @flow

import toNumber from 'lodash/toNumber';

import Type from './Type';
import Value from './Value';


export default class IntegerValue extends Value<number> {
  constructor(rawValue: ?number) {
    super(Type.INTEGER, rawValue);
  }

  static fromValue(value: Value<mixed>): IntegerValue {
    if (value.isNull) {
      return new IntegerValue(null);
    }

    switch (value.dataType) {
      case Type.INTEGER:
      case Type.FLOAT:
        return new IntegerValue(Math.trunc(Number(value.rawValue)));

      case Type.BOOLEAN:
        return new IntegerValue(value.rawValue ? 1 : 0);

      case Type.STRING: {
        let val = toNumber(value.rawValue);
        if (!Number.isNaN(val)) {
          return new IntegerValue(Math.trunc(val));
        }
      }
    }

    throw this._makeConversionError(value, Type.INTEGER);
  }
}

