/* eslint-disable flowtype/no-types-missing-file-annotation */

import {DateTime} from 'luxon';

import {FUNCTIONS} from '../Dispatcher';
import {ExecutionError} from '../errors';
import {Type, Value, makeValue} from '../types';


function makeDate(year: Value<mixed>, month: Value<mixed>, day: Value<mixed>): Value<mixed> {
  let y = year.isNull ? 1 : year.rawValue;
  let m = month.isNull ? 1 : month.rawValue;
  let d = day.isNull ? 1 : day.rawValue;
  if (y < 1) {
    throw new ExecutionError('Year must be > 1');
  }

  let date = DateTime.fromObject({
    year: y, month: m, day: d,
    hour: 0, minute: 0, second: 0, millisecond: 0,
    zone: 'UTC',
  });
  if (!date.isValid) {
    throw new ExecutionError(`Cannot create DATE: ${date.invalidReason}`);
  }

  return makeValue(Type.DATE, date);
}

FUNCTIONS.register(
  'date',
  [
    [Type.INTEGER, Type.INTEGER, Type.INTEGER],
  ],
  makeDate,
);


function makeTime(hour: Value<mixed>, minute: Value<mixed>, second: Value<mixed>, millisecond: Value<mixed>): Value<mixed> {
  let h = hour.isNull ? 0 : hour.rawValue;
  let mi = minute.isNull ? 0 : minute.rawValue;
  let s = second.isNull ? 0 : second.rawValue;
  let i = 0;
  if (millisecond && !millisecond.isNull) {
    i = millisecond.rawValue;
  }

  let time = DateTime.fromObject({
    year: 1, month: 1, day: 1,
    hour: h, minute: mi, second: s, millisecond: i,
    zone: 'UTC',
  });
  if (!time.isValid) {
    throw new ExecutionError(`Cannot create TIME: ${time.invalidReason}`);
  }

  return makeValue(Type.TIME, time);
}

FUNCTIONS.register(
  'time',
  [
    [Type.INTEGER, Type.INTEGER, Type.INTEGER],
    [Type.INTEGER, Type.INTEGER, Type.INTEGER, Type.INTEGER],
  ],
  makeTime
);


function makeDateTime(year: Value<mixed>, month: Value<mixed>, day: Value<mixed>, hour: Value<mixed>, minute: Value<mixed>, second: Value<mixed>, millisecond: Value<mixed>): Value<mixed> {
  let y = year.isNull ? 1 : year.rawValue;
  let m = month.isNull ? 1 : month.rawValue;
  let d = day.isNull ? 1 : day.rawValue;
  let h = hour.isNull ? 0 : hour.rawValue;
  let mi = minute.isNull ? 0 : minute.rawValue;
  let s = second.isNull ? 0 : second.rawValue;
  let i = 0;
  if (millisecond && !millisecond.isNull) {
    i = millisecond.rawValue;
  }
  if (y < 1) {
    throw new ExecutionError('Year must be > 1');
  }

  let dt = DateTime.fromObject({
    year: y, month: m, day: d,
    hour: h, minute: mi, second: s, millisecond: i,
    zone: 'UTC',
  });
  if (!dt.isValid) {
    throw new ExecutionError(`Cannot create DATETIME: ${dt.invalidReason}`);
  }

  return makeValue(Type.DATETIME, dt);
}

FUNCTIONS.register(
  'datetime',
  [
    [
        Type.INTEGER,
        Type.INTEGER,
        Type.INTEGER,
        Type.INTEGER,
        Type.INTEGER,
        Type.INTEGER,
    ],
    [
        Type.INTEGER,
        Type.INTEGER,
        Type.INTEGER,
        Type.INTEGER,
        Type.INTEGER,
        Type.INTEGER,
        Type.INTEGER,
    ],
  ],
  makeDateTime,
);


FUNCTIONS.register(
  'today',
  [],
  () => makeValue(Type.DATE, DateTime.fromObject({hour: 0, minute: 0, second: 0, millisecond: 0}, {zone: 'UTC'})),
);


FUNCTIONS.register(
  'now',
  [],
  () => makeValue(Type.DATETIME, DateTime.fromObject({}, {zone: 'UTC'})),
);


FUNCTIONS.register(
  'year',
  [
    [Type.DATE],
    [Type.DATETIME],
  ],
  (value) => makeValue(Type.INTEGER, value.isNull ? null : value.rawValue.year),
);


FUNCTIONS.register(
  'month',
  [
    [Type.DATE],
    [Type.DATETIME],
  ],
  (value) => makeValue(Type.INTEGER, value.isNull ? null : value.rawValue.month),
);


FUNCTIONS.register(
  'day',
  [
    [Type.DATE],
    [Type.DATETIME],
  ],
  (value) => makeValue(Type.INTEGER, value.isNull ? null : value.rawValue.day),
);


FUNCTIONS.register(
  'hour',
  [
    [Type.TIME],
    [Type.DATETIME],
  ],
  (value) => makeValue(Type.INTEGER, value.isNull ? null : value.rawValue.hour),
);


FUNCTIONS.register(
  'minute',
  [
    [Type.TIME],
    [Type.DATETIME],
  ],
  (value) => makeValue(Type.INTEGER, value.isNull ? null : value.rawValue.minute),
);


FUNCTIONS.register(
  'second',
  [
    [Type.TIME],
    [Type.DATETIME],
  ],
  (value) => makeValue(Type.INTEGER, value.isNull ? null : value.rawValue.second),
);


FUNCTIONS.register(
  'millisecond',
  [
    [Type.TIME],
    [Type.DATETIME],
  ],
  (value) => makeValue(Type.INTEGER, value.isNull ? null : value.rawValue.millisecond),
);


function addDate(left: Value<mixed>, right: Value<mixed>): Value<mixed> {
  let value, mod;
  if ([Type.DATE, Type.DATETIME].includes(left.dataType)) {
    value = left;
    mod = right;
  } else {
    value = right;
    mod = left;
  }

  if (value.isNull || mod.isNull) {
    return makeValue(value.dataType, null);
  }

  return makeValue(value.dataType, value.rawValue.plus({days: mod.rawValue}));
}

FUNCTIONS.register(
  'add',
  [
    [Type.DATE, Type.INTEGER],
    [Type.DATE, Type.FLOAT],
    [Type.INTEGER, Type.DATE],
    [Type.FLOAT, Type.DATE],
    [Type.DATETIME, Type.INTEGER],
    [Type.DATETIME, Type.FLOAT],
    [Type.INTEGER, Type.DATETIME],
    [Type.FLOAT, Type.DATETIME],
  ],
  addDate,
);


function addTime(left: Value<mixed>, right: Value<mixed>): Value<mixed> {
  let value, mod;
  if (left.dataType === Type.TIME) {
    value = left;
    mod = right;
  } else {
    value = right;
    mod = left;
  }

  if (value.isNull || mod.isNull) {
    return makeValue(value.dataType, null);
  }

  return makeValue(value.dataType, value.rawValue.plus({seconds: mod.rawValue}));
}

FUNCTIONS.register(
  'add',
  [
    [Type.TIME, Type.INTEGER],
    [Type.TIME, Type.FLOAT],
    [Type.INTEGER, Type.TIME],
    [Type.FLOAT, Type.TIME],
  ],
  addTime,
);


function subtractDate(left: Value<mixed>, right: Value<mixed>): Value<mixed> {
  if (left.isNull || right.isNull) {
    return makeValue(left.dataType, null);
  }
  return makeValue(left.dataType, left.rawValue.minus({days: right.rawValue}));
}

FUNCTIONS.register(
  'subtract',
  [
    [Type.DATE, Type.INTEGER],
    [Type.DATE, Type.FLOAT],
    [Type.DATETIME, Type.INTEGER],
    [Type.DATETIME, Type.FLOAT],
  ],
  subtractDate,
);


function subtractDates(left: Value<mixed>, right: Value<mixed>): Value<mixed> {
  let type = Type.INTEGER;
  if ((left.dataType === Type.DATETIME) || (right.dataType === Type.DATETIME)) {
    type = Type.FLOAT;
  }

  if (left.isNull || right.isNull) {
    return makeValue(type, null);
  }

  let diff = left.rawValue.diff(right.rawValue);
  return makeValue(type, diff.as('days'));
}

FUNCTIONS.register(
  'subtract',
  [
    [Type.DATE, Type.DATE],
    [Type.DATE, Type.DATETIME],
    [Type.DATETIME, Type.DATE],
    [Type.DATETIME, Type.DATETIME],
  ],
  subtractDates,
);


function subtractTime(left: Value<mixed>, right: Value<mixed>): Value<mixed> {
  if (left.isNull || right.isNull) {
    return makeValue(left.dataType, null);
  }
  return makeValue(left.dataType, left.rawValue.minus({seconds: right.rawValue}));
}

FUNCTIONS.register(
  'subtract',
  [
    [Type.TIME, Type.INTEGER],
    [Type.TIME, Type.FLOAT],
  ],
  subtractTime,
);


function subtractTimes(left: Value<mixed>, right: Value<mixed>): Value<mixed> {
  if (left.isNull || right.isNull) {
    return makeValue(Type.FLOAT, null);
  }

  let diff = left.rawValue.diff(right.rawValue);
  return makeValue(Type.FLOAT, diff.as('seconds'));
}

FUNCTIONS.register(
  'subtract',
  [
    [Type.TIME, Type.TIME],
  ],
  subtractTimes,
);

