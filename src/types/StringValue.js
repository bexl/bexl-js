// @flow

import Type from './Type';
import Value from './Value';


export default class StringValue extends Value<string> {
  constructor(rawValue: ?string) {
    super(Type.STRING, rawValue);
  }

  get isEmpty(): boolean {
    return this.isNull || !this.rawValue;
  }

  toPlainString(): string {
    return this.isNull ? 'NULL' : `"${String(this.rawValue)}"`;
  }

  static fromValue(value: Value<mixed>): StringValue {
    if (value.isNull) {
      return new StringValue(null);
    }

    switch (value.dataType) {
      case Type.STRING:
      case Type.INTEGER:
      case Type.FLOAT:
      case Type.BOOLEAN:
      case Type.DATE:
      case Type.TIME:
      case Type.DATETIME:
        return new StringValue(value.toPlainString());
    }

    throw this._makeConversionError(value, Type.STRING);
  }
}

