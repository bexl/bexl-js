// @flow

import Type from './Type';
import Value from './Value';


export default class UntypedValue extends Value<mixed> {
  constructor() {
    super(Type.UNTYPED, null);
  }

  static fromValue(value: Value<mixed>): UntypedValue {  // eslint-disable-line no-unused-vars
    return new UntypedValue();
  }
}

