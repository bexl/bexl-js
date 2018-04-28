// @flow

import {DateTime} from 'luxon';

import Type from './Type';
import Value from './Value';


export default class TimeValue extends Value<DateTime> {
  static REGEX = /^\d{2}:\d{2}(:\d{2}(\.\d{3})?)?$/;

  constructor(rawValue: ?DateTime) {
    if (rawValue) {
      rawValue = rawValue.set({year: 1, month: 1, day: 1});
    }
    super(Type.TIME, rawValue);
  }

  get value(): ?mixed {
    if (this.rawValue == null) {
      return null;
    }
    return this.rawValue.toJSDate();
  }

  toPlainString(): string {
    return this.rawValue ? this.rawValue.toISOTime({
      suppressMilliseconds: true,
      includeOffset: false,
    }) : '';
  }

  static fromValue(value: Value<mixed>): TimeValue {
    if (value.isNull) {
      return new TimeValue(null);
    }

    switch (value.dataType) {
      case Type.STRING: {
        let val = String(value.rawValue);
        if (this.REGEX.test(val)) {
          try {
            return new TimeValue(DateTime.fromISO(`0001-01-01T${val}`, {zone: 'UTC'}));
          } catch (exc) {
            throw this._makeConversionError(value, Type.TIME);
          }
        }
        break;
      }

      case Type.DATETIME: {
        let {hour, minute, second, milisecond} = (value.rawValue: DateTime).toObject();
        return new TimeValue(DateTime.fromObject({
          hour, minute, second, milisecond,
          year: 1, month: 1, day: 1,
          zone: 'UTC',
        }));
      }
    }

    throw this._makeConversionError(value, Type.TIME);
  }
}

