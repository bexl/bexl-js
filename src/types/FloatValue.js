// @flow

import toNumber from 'lodash/toNumber';

import Type from './Type';
import Value from './Value';


export default class FloatValue extends Value<number> {
  constructor(rawValue: ?number) {
    super(Type.FLOAT, rawValue);
  }

  static fromValue(value: Value<mixed>): FloatValue {
    if (value.isNull) {
      return new FloatValue(null);
    }

    switch (value.dataType) {
      case Type.FLOAT:
      case Type.INTEGER:
        return new FloatValue(Number(value.rawValue));

      case Type.BOOLEAN:
        return new FloatValue(value.rawValue ? 1.0 : 0.0);

      case Type.STRING: {
        let val = toNumber(value.rawValue);
        if (!Number.isNaN(val)) {
          return new FloatValue(val);
        }
      }
    }

    throw this._makeConversionError(value, Type.FLOAT);
  }
}

