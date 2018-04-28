// @flow

import {DateTime} from 'luxon';

import Type from './Type';
import Value from './Value';


export default class DateValue extends Value<DateTime> {
  static REGEX = /^\d{4}-\d{2}-\d{2}$/;

  constructor(rawValue: ?DateTime) {
    if (rawValue) {
      rawValue = rawValue.set({hour: 0, minute: 0, second: 0, millisecond: 0});
    }
    super(Type.DATE, rawValue);
  }

  get value(): ?mixed {
    if (this.rawValue == null) {
      return null;
    }
    return this.rawValue.toJSDate();
  }

  toPlainString(): string {
    return this.rawValue ? this.rawValue.toISODate() : '';
  }

  static fromValue(value: Value<mixed>): DateValue {
    if (value.isNull) {
      return new DateValue(null);
    }

    switch (value.dataType) {
      case Type.STRING: {
        let val = String(value.rawValue);
        if (this.REGEX.test(val)) {
          try {
            return new DateValue(DateTime.fromISO(val, {zone: 'UTC'}));
          } catch (exc) {
            throw this._makeConversionError(value, Type.DATE);
          }
        }
        break;
      }

      case Type.DATE:
      case Type.DATETIME: {
        let {year, month, day} = (value.rawValue: DateTime).toObject();
        return new DateValue(DateTime.fromObject({
          year, month, day,
          hour: 0, minute: 0, second: 0, milisecond: 0,
          zone: 'UTC',
        }));
      }
    }

    throw this._makeConversionError(value, Type.DATE);
  }
}

