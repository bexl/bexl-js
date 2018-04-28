// @flow

import {DateTime} from 'luxon';
import isPlainObject from 'lodash/isPlainObject';
import mapValues from 'lodash/mapValues';
import isDate from 'lodash/isDate';

import {ConversionError, BexlError} from '../errors';
import UntypedValue from './UntypedValue';
import StringValue from './StringValue';
import FloatValue from './FloatValue';
import IntegerValue from './IntegerValue';
import BooleanValue from './BooleanValue';
import ListValue from './ListValue';
import RecordValue from './RecordValue';
import DateValue from './DateValue';
import TimeValue from './TimeValue';
import DateTimeValue from './DateTimeValue';
import Type from './Type';
import Value from './Value';


const _TYPE_VALUES = {
  [Type.UNTYPED.name]: UntypedValue,
  [Type.STRING.name]: StringValue,
  [Type.FLOAT.name]: FloatValue,
  [Type.INTEGER.name]: IntegerValue,
  [Type.BOOLEAN.name]: BooleanValue,
  [Type.LIST.name]: ListValue,
  [Type.RECORD.name]: RecordValue,
  [Type.DATE.name]: DateValue,
  [Type.TIME.name]: TimeValue,
  [Type.DATETIME.name]: DateTimeValue,
};


export function makeValue(dataType: Type, rawValue: mixed): Value<mixed> {
  if (_TYPE_VALUES[dataType.name]) {
    return new _TYPE_VALUES[dataType.name](rawValue);
  }
  throw new ConversionError(`Unknown data type ${dataType.name}`, dataType);
}


export function cast(value: Value<mixed>, dataType: Type): Value<mixed> {
  if (value.dataType === dataType) {
    return value;
  }
  return _TYPE_VALUES[dataType.name].fromValue(value);
}


export function isConsistentlyTyped(values: Array<Value<mixed>>, ...types: Array<Type>): boolean {
  if (values.length === 0) {
    return true;
  }

  let vTypes = values.map((val) => val.dataType);

  if (types.length === 0) {
    types = [vTypes[0]];
  }

  let wrong = vTypes.filter((type) => !types.includes(type));

  return wrong.length === 0;
}


export function jsToBexl(value: mixed): Value<mixed> {
  switch (typeof value) {
    case 'boolean':
      return makeValue(Type.BOOLEAN, value);

    case 'string':
      return makeValue(Type.STRING, value);

    case 'number': {
      let type = Number.isInteger(value) ? Type.INTEGER : Type.FLOAT;
      return makeValue(type, value);
    }
  }

  if (isDate(value)) {
    return makeValue(Type.DATETIME, DateTime.fromJSDate(value, {zone: 'UTC'}));
  }

  if (Array.isArray(value)) {
    return makeValue(Type.LIST, value.map((val) => jsToBexl(val)));
  }

  if (isPlainObject(value)) {
    return makeValue(Type.RECORD, mapValues(value, (val) => jsToBexl(val)));
  }

  throw new BexlError(`Cannot create a BEXL value from ${String(value)}`);
}


export function bexlToJs(value: Value<mixed>): mixed {
  return value.value;
}


export const TRUE = makeValue(Type.BOOLEAN, true);
export const FALSE = makeValue(Type.BOOLEAN, false);
export const NULL = makeValue(Type.UNTYPED, null);

