// @flow

import {DateTime} from 'luxon';

import Type from './Type';
import Value from './Value';


export default class DateTimeValue extends Value<DateTime> {
  static REGEX = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d{3})?)?)?$/;

  constructor(rawValue: ?DateTime) {
    super(Type.DATETIME, rawValue);
  }

  get value(): ?mixed {
    if (this.rawValue == null) {
      return null;
    }
    return this.rawValue.toJSDate();
  }

  toPlainString(): string {
    return this.rawValue ? this.rawValue.toISO({
      suppressMilliseconds: true,
      includeOffset: false,
    }) : '';
  }

  static fromValue(value: Value<mixed>): DateTimeValue {
    if (value.isNull) {
      return new DateTimeValue(null);
    }

    switch (value.dataType) {
      case Type.STRING: {
        let val = String(value.rawValue);
        if (this.REGEX.test(val)) {
          try {
            return new DateTimeValue(DateTime.fromISO(val, {zone: 'UTC'}));
          } catch (exc) {
            throw this._makeConversionError(value, Type.DATETIME);
          }
        }
        break;
      }

      case Type.DATE:
      case Type.DATETIME:
        return new DateTimeValue(value.rawValue);
    }

    throw this._makeConversionError(value, Type.DATETIME);
  }
}

