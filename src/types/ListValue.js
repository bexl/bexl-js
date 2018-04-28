// @flow

import Type from './Type';
import Value from './Value';


export default class ListValue extends Value<Array<Value<mixed>>> {
  constructor(rawValue: ?Array<Value<mixed>>) {
    super(Type.LIST, rawValue);
  }

  get isEmpty(): boolean {
    return this.isNull || ((this.rawValue || []).length === 0);
  }

  get value(): ?Array<mixed> {
    if (this.isNull) {
      return null;
    }
    return (this.rawValue || []).map((val) => val.value);
  }

  toPlainString(): string {
    return this.isNull ? 'NULL' : `[${(this.rawValue || []).map((elem) => elem.toPlainString()).join(', ')}]`;
  }

  toString(): string {
    let val = this.isNull ? 'NULL' : (this.rawValue || []).map((elem) => elem.toString()).join(', ');
    return `${this.constructor.name}(${val})`;
  }

  // $FlowFixMe
  static fromValue(value: Value<mixed>): ListValue {
    if (value.isNull || (value.dataType === Type.LIST)) {
      return new ListValue(value.rawValue);
    }

    throw this._makeConversionError(value, Type.LIST);
  }
}

