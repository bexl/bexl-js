// @flow

import {FUNCTIONS} from '../Dispatcher';
import {Type, Value, makeValue, cast, TRUE, FALSE} from '../types';


[
  'equal',
  'notEqual',
  'greater',
  'greaterEqual',
  'lesser',
  'lesserEqual',
].forEach((spec) => {
  FUNCTIONS.register(
    spec,
    [
    ],
    (left, right) => {
      if (left.dataType !== right.dataType) {
        right = cast(right, left.dataType);
      }
      // $FlowFixMe
      return makeValue(Type.BOOLEAN, left[spec](right));
    },
  );
});


function between(value: Value<mixed>, start: Value<mixed>, end: Value<mixed>): Value<mixed> {
  if (value.isNull || start.isNull || end.isNull) {
    return FALSE;
  }

  start = cast(start, value.dataType);
  end = cast(end, value.dataType);

  if (
      (Number(start.rawValue) <= Number(value.rawValue))
      && (Number(value.rawValue) <= Number(end.rawValue))) {
    return TRUE;
  }
  return FALSE;
}

FUNCTIONS.register(
  'between',
  [
    [Type.INTEGER, Type.INTEGER, Type.INTEGER],
    [Type.INTEGER, Type.FLOAT, Type.INTEGER],
    [Type.INTEGER, Type.INTEGER, Type.FLOAT],
    [Type.INTEGER, Type.FLOAT, Type.FLOAT],
    [Type.FLOAT, Type.INTEGER, Type.INTEGER],
    [Type.FLOAT, Type.FLOAT, Type.INTEGER],
    [Type.FLOAT, Type.INTEGER, Type.FLOAT],
    [Type.FLOAT, Type.FLOAT, Type.FLOAT],
  ],
  between,
);

