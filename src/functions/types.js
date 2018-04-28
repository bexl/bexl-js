// @flow

import capitalize from 'lodash/capitalize';

import {FUNCTIONS} from '../Dispatcher';
import {ExecutionError} from '../errors';
import {Type, Value, makeValue, cast, NULL} from '../types';


const FULL_SPECS = [
  ['integer', Type.INTEGER],
  ['float', Type.FLOAT],
  ['boolean', Type.BOOLEAN],
  ['string', Type.STRING],
];

const IS_SPECS = [
  ['date', Type.DATE],
  ['time', Type.TIME],
  ['datetime', Type.DATETIME],
  ['list', Type.LIST],
  ['record', Type.RECORD],
];

FULL_SPECS.concat(IS_SPECS).forEach((spec) => {
  FUNCTIONS.register(
    `is${capitalize(spec[0])}`,
    [],
    (value) => makeValue(Type.BOOLEAN, value.dataType === spec[1]),
  );
});

FULL_SPECS.forEach((spec) => {
  FUNCTIONS.register(
    spec[0],
    [],
    (value) => cast(value, spec[1]),
  );
});


FUNCTIONS.register(
  'list',
  [],
  (...values) => makeValue(Type.LIST, values),
);


function record(...values: Array<Value<mixed>>): Value<mixed> {
  if ((values.length === 0) || ((values.length % 2) !== 0)) {
    throw new ExecutionError('Incorrect number of arguments');
  }

  let rec = {};
  for (let i = 0; i < values.length; i += 2) {
    if (values[i].dataType !== Type.STRING) {
      throw new ExecutionError(
        `Property names must be a STRING, not ${values[i].dataType.name}`
      );
    }
    if (values[i].isNull) {
      throw new ExecutionError('Property names cannot be null');
    }
    rec[String(values[i].rawValue)] = values[i + 1];
  }

  return makeValue(Type.RECORD, rec);
}


FUNCTIONS.register(
  'record',
  [],
  record,
);


function property(record: Value<mixed>, prop: Value<mixed>): Value<mixed> {
  if (record.isNull) {
    return NULL;
  }
  if (prop.isNull) {
    throw new ExecutionError('Property name cannot be null');
  }

  // $FlowFixMe
  let value = record.rawValue[prop.rawValue];
  if (value === undefined) {
    throw new ExecutionError(
      `Record does not contain a property named "${String(prop.rawValue)}"`
    );
  }

  return value;
}


FUNCTIONS.register(
  'property',
  [
    [Type.RECORD, Type.STRING],
  ],
  property,
);


FUNCTIONS.register(
  'isNull',
  [],
  (value) => makeValue(Type.BOOLEAN, value.isNull),
);


function coalesce(...values: Array<Value<mixed>>): Value<mixed> {
  for (let i = 0; i < values.length; i += 1) {
    if (!values[i].isNull) {
        return values[i];
    }
  }

  return NULL;
}

FUNCTIONS.register(
  'coalesce',
  [],
  coalesce,
);


FUNCTIONS.register(
  'date',
  [
    [Type.INTEGER],
    [Type.FLOAT],
    [Type.STRING],
    [Type.BOOLEAN],
    [Type.DATE],
    [Type.TIME],
    [Type.DATETIME],
    [Type.LIST],
    [Type.RECORD],
    [Type.UNTYPED],
  ],
  (value) => cast(value, Type.DATE),
);


FUNCTIONS.register(
  'time',
  [
    [Type.INTEGER],
    [Type.FLOAT],
    [Type.STRING],
    [Type.BOOLEAN],
    [Type.DATE],
    [Type.TIME],
    [Type.DATETIME],
    [Type.LIST],
    [Type.RECORD],
    [Type.UNTYPED],
  ],
  (value) => cast(value, Type.TIME),
);


FUNCTIONS.register(
  'datetime',
  [
    [Type.INTEGER],
    [Type.FLOAT],
    [Type.STRING],
    [Type.BOOLEAN],
    [Type.DATE],
    [Type.TIME],
    [Type.DATETIME],
    [Type.LIST],
    [Type.RECORD],
    [Type.UNTYPED],
  ],
  (value) => cast(value, Type.DATETIME),
);

