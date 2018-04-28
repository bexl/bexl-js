/* eslint-disable flowtype/no-types-missing-file-annotation */

import {FUNCTIONS} from '../Dispatcher';
import {Type, Value, makeValue, TRUE, FALSE} from '../types';
import {ExecutionError, DispatchError} from '../errors';


function valueIn(needle: Value<mixed>, haystack: Value<mixed>): Value<mixed> {
  if (haystack.dataType === Type.LIST) {
    if (haystack.isEmpty) {
      return FALSE;
    }

    for (let i = 0; i < haystack.rawValue.length; i++) {
      let hVal = haystack.rawValue[i];
      if ((hVal.dataType === needle.dataType) && (hVal.rawValue === needle.rawValue)) {
        return TRUE;
      }
    }
    return FALSE;

  } else if ((haystack.dataType === Type.STRING) && (needle.dataType === Type.STRING)) {
    if (needle.isNull || haystack.isNull) {
      return FALSE;
    }

    return haystack.rawValue.includes(needle.rawValue) ? TRUE : FALSE;

  } else {
    throw new DispatchError(
      `"in" cannot be invoked on arguments of type: ${needle.dataType.name}, ${haystack.dataType.name}`,
    );
  }
}

FUNCTIONS.register(
  'in',
  [],
  valueIn,
);


function length(value: Value<mixed>): Value<mixed> {
  let len = 0;
  if (!value.isEmpty) {
    len = value.rawValue.length;
  }
  return makeValue(Type.INTEGER, len);
}

FUNCTIONS.register(
  'length',
  [
    [Type.STRING],
    [Type.LIST],
  ],
  length,
);


function head(value: Value<mixed>, length: Value<mixed>): Value<mixed> {
  if (value.isNull) {
    return makeValue(value.dataType, null);
  }

  let len = 1;
  if (length && !length.isNull) {
    len = length.rawValue;
  }

  return makeValue(value.dataType, value.rawValue.slice(0, len));
}


FUNCTIONS.register(
  'head',
  [
    [Type.STRING],
    [Type.STRING, Type.INTEGER],
    [Type.STRING, Type.FLOAT],
    [Type.LIST],
    [Type.LIST, Type.INTEGER],
    [Type.LIST, Type.FLOAT],
  ],
  head,
);


function tail(value: Value<mixed>, length: Value<mixed>): Value<mixed> {
  if (value.isNull) {
    return makeValue(value.dataType, null);
  }

  let len = 1;
  if (length && !length.isNull) {
    len = length.rawValue;
  }

  return makeValue(value.dataType, value.rawValue.slice(len * -1));
}

FUNCTIONS.register(
  'tail',
  [
    [Type.STRING],
    [Type.STRING, Type.INTEGER],
    [Type.STRING, Type.FLOAT],
    [Type.LIST],
    [Type.LIST, Type.INTEGER],
    [Type.LIST, Type.FLOAT],
  ],
  tail,
);


function concat(...values: Array<Value<mixed>>): Value<mixed> {
  if (values.length === 0) {
    throw new DispatchError('"concat" cannot be invoked without arguments');
  }

  let valueTypes = values.map((value) => value.dataType);
  let mismatched = valueTypes.filter((type) => type !== valueTypes[0]);
  if (![Type.STRING, Type.LIST].includes(valueTypes[0]) || mismatched.length) {
    let types = valueTypes.map((type) => type.name);
    throw new DispatchError(
      `"concat" cannot be invoked on arguments of type: ${types.join(', ')}`,
    );
  }

  let pieces = values.filter((val) => !val.isEmpty).map((val) => val.rawValue);
  return makeValue(
    valueTypes[0],
    pieces.reduce((a, b) => a.concat(b)),
  );
}

FUNCTIONS.register(
  'concat',
  [],
  concat,
);


function sliceEnd(value: Value<mixed>, start: Value<mixed>, end: Value<mixed>): Value<mixed> {
  if (value.isEmpty) {
    return value;
  }

  return makeValue(
    value.dataType,
    value.rawValue.slice(start.rawValue || undefined, end.rawValue || undefined),
  );
}

FUNCTIONS.register(
  'slice',
  [
    [Type.STRING, Type.INTEGER, Type.INTEGER],
    [Type.LIST, Type.INTEGER, Type.INTEGER],
  ],
  sliceEnd,
);


function slice(value: Value<mixed>, start: Value<mixed>): Value<mixed> {
  if (value.isEmpty) {
    return value;
  }

  return makeValue(
    value.dataType,
    value.rawValue.slice(start.rawValue || undefined),
  );
}

FUNCTIONS.register(
  'slice',
  [
    [Type.STRING, Type.INTEGER],
    [Type.LIST, Type.INTEGER],
  ],
  slice,
);



function at(value: Value<mixed>, position: Value<mixed>): Value<mixed> {
  if (value.isEmpty) {
    return makeValue(Type.UNTYPED, null);
  }
  if (position.isNull) {
    throw new ExecutionError('Position cannot be null');
  }

  let pos = Number(position.rawValue);

  if ((pos > (value.rawValue.length - 1)) || (pos < (-1 * value.rawValue.length))) {
    throw new ExecutionError('Position exceeds bounds of sequence');
  }

  let val = value.rawValue.slice(pos, pos + 1)[0];

  if (value.dataType === Type.LIST) {
    return val;
  }

  return makeValue(value.dataType, val);
}

FUNCTIONS.register(
  'at',
  [
    [Type.STRING, Type.INTEGER],
    [Type.LIST, Type.INTEGER],
  ],
  at,
);

