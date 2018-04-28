// @flow

import Type from './Type';
import Value from './Value';


export default class BooleanValue extends Value<boolean> {
  constructor(rawValue: ?boolean) {
    super(Type.BOOLEAN, rawValue);
  }

  toPlainString(): string {
    return this.isNull ? 'NULL' : this.rawValue ? 'True' : 'False';
  }

  static fromValue(value: Value<mixed>): BooleanValue {
    if (value.isEmpty) {
      return new BooleanValue(false);
    }

    switch (value.dataType) {
      case Type.BOOLEAN:
      case Type.INTEGER:
      case Type.FLOAT:
      case Type.STRING:
        return new BooleanValue(Boolean(value.rawValue));

      case Type.LIST:
      case Type.RECORD:
      case Type.DATE:
      case Type.TIME:
      case Type.DATETIME:
        return new BooleanValue(true);
    }

    throw this._makeConversionError(value, Type.BOOLEAN);
  }
}

