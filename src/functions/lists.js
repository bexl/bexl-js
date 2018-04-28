// @flow

import minBy from 'lodash/minBy';
import maxBy from 'lodash/maxBy';
import sumBy from 'lodash/sumBy';

import {FUNCTIONS} from '../Dispatcher';
import {DispatchError} from '../errors';
import {Type, Value, makeValue, isConsistentlyTyped, cast, NULL, TRUE, FALSE} from '../types';


function min(values: Value<mixed>): Value<mixed> {
  if (values.isNull) {
    return NULL;
  }

  // $FlowFixMe
  let vals: Array<Value<mixed>> = values.rawValue;
  let allNumbers = isConsistentlyTyped(vals, Type.INTEGER, Type.FLOAT);
  let allDates = isConsistentlyTyped(vals, Type.DATE, Type.DATETIME);
  let allTimes = isConsistentlyTyped(vals, Type.TIME);
  if (!allNumbers && !allDates && !allTimes) {
    throw new DispatchError(
      '"min" must be invoked on a list that contains all INTEGER/FLOAT, all DATE/DATETIME, or all TIME values',
    );
  }

  let result = minBy(
    vals.filter((value) => !value.isNull),
    (value) => value.rawValue,
  );
  if (!result) {
    return NULL;
  }
  return result;
}

FUNCTIONS.register(
  'min',
  [
    [Type.LIST],
  ],
  min,
);


function max(values: Value<mixed>): Value<mixed> {
  if (values.isNull) {
    return NULL;
  }

  // $FlowFixMe
  let vals: Array<Value<mixed>> = values.rawValue;
  let allNumbers = isConsistentlyTyped(vals, Type.INTEGER, Type.FLOAT);
  let allDates = isConsistentlyTyped(vals, Type.DATE, Type.DATETIME);
  let allTimes = isConsistentlyTyped(vals, Type.TIME);
  if (!allNumbers && !allDates && !allTimes) {
    throw new DispatchError(
      '"min" must be invoked on a list that contains all INTEGER/FLOAT, all DATE/DATETIME, or all TIME values',
    );
  }

  let result = maxBy(
    vals.filter((value) => !value.isNull),
    (value) => value.rawValue,
  );
  if (!result) {
    return NULL;
  }
  return result;
}

FUNCTIONS.register(
  'max',
  [
    [Type.LIST],
  ],
  max,
);


function sum(values: Value<mixed>): Value<mixed> {
  if (values.isNull) {
    return NULL;
  }

  // $FlowFixMe
  let vals: Array<Value<mixed>> = values.rawValue;
  if (!isConsistentlyTyped(vals, Type.INTEGER, Type.FLOAT)) {
    throw new DispatchError(
      `"sum" cannot be invoked on a list containing values of types other than INTEGER or FLOAT`,
    );
  }

  let result = sumBy(
    vals.filter((value) => !value.isNull),
    (value) => value.rawValue,
  );
  return makeValue(
    Number.isInteger(result) ? Type.INTEGER : Type.FLOAT,
    result,
  );
}

FUNCTIONS.register(
  'sum',
  [
    [Type.LIST],
  ],
  sum,
);


function average(values: Value<mixed>): Value<mixed> {
  if (values.isNull) {
    return NULL;
  }

  // $FlowFixMe
  let vals: Array<Value<mixed>> = values.rawValue;
  if (!isConsistentlyTyped(vals, Type.INTEGER, Type.FLOAT)) {
    throw new DispatchError(
      `"sum" cannot be invoked on a list containing values of types other than INTEGER or FLOAT`,
    );
  }

  vals = vals.filter((value) => !value.isNull);
  if (vals.length === 0) {
    return NULL;
  }
  let result = sumBy(vals, (value) => value.rawValue) / vals.length;
  return makeValue(Type.FLOAT, result);
}

FUNCTIONS.register(
  'average',
  [
    [Type.LIST],
  ],
  average,
);


function countTruthy(values: Value<mixed>): number {
  // $FlowFixMe
  return values.rawValue.filter(
    (value) => cast(value, Type.BOOLEAN).rawValue
  ).length;
}


function all(values: Value<mixed>): Value<mixed> {
  if (values.isEmpty) {
    return TRUE;
  }
  // $FlowFixMe
  return countTruthy(values) === values.rawValue.length ? TRUE : FALSE;
}

FUNCTIONS.register(
  'all',
  [
    [Type.LIST],
  ],
  all,
);


function any(values: Value<mixed>): Value<mixed> {
  if (values.isEmpty) {
    return FALSE;
  }
  return countTruthy(values) > 0 ? TRUE : FALSE;
}

FUNCTIONS.register(
  'any',
  [
    [Type.LIST],
  ],
  any,
);


function none(values: Value<mixed>): Value<mixed> {
  if (values.isEmpty) {
    return TRUE;
  }
  return countTruthy(values) === 0 ? TRUE : FALSE;
}

FUNCTIONS.register(
  'none',
  [
    [Type.LIST],
  ],
  none,
);


function count(values: Value<mixed>): Value<mixed> {
  let cnt = 0;
  if (!values.isEmpty) {
    cnt = countTruthy(values);
  }
  return makeValue(Type.INTEGER, cnt);
}

FUNCTIONS.register(
  'count',
  [
    [Type.LIST],
  ],
  count,
);

