// @flow

import {FUNCTIONS} from '../Dispatcher';
import {Type, Value, makeValue} from '../types';
import {ExecutionError} from '../errors';



function roundHalfEven(value: number, decimals: number) {
  let precision = Math.pow(10, decimals);

  value *= precision;
  let rounded = Math.round(value);

  if ((Math.abs(value) % 1) === 0.5) {
    if ((rounded % 2) !== 0)  {
      rounded -= 1;
    }
  }

  return rounded / precision;
}


function negative(value: Value<mixed>): Value<mixed> {
  if (value.isNull) {
    return value;
  }
  let num = Number(value.rawValue);
  if (num) {
    num *= -1;
  }
  return makeValue(value.dataType, num);
}

FUNCTIONS.register(
  'negative',
  [
    [Type.INTEGER],
    [Type.FLOAT],
  ],
  negative,
);


function add(left: Value<mixed>, right: Value<mixed>): Value<mixed> {
  let type, value;

  if ((left.dataType === Type.FLOAT) || (right.dataType === Type.FLOAT)) {
    type = Type.FLOAT;
  } else {
    type = Type.INTEGER;
  }

  if (left.isNull || right.isNull) {
    value = null;
  } else {
    value = Number(left.rawValue) + Number(right.rawValue);
  }

  return makeValue(type, value);
}

FUNCTIONS.register(
  'add',
   [
     [Type.INTEGER, Type.INTEGER],
     [Type.FLOAT, Type.INTEGER],
     [Type.INTEGER, Type.FLOAT],
     [Type.FLOAT, Type.FLOAT],
   ],
   add,
);


function subtract(left: Value<mixed>, right: Value<mixed>): Value<mixed> {
  let type, value;

  if ((left.dataType === Type.FLOAT) || (right.dataType === Type.FLOAT)) {
    type = Type.FLOAT;
  } else {
    type = Type.INTEGER;
  }

  if (left.isNull || right.isNull) {
    value = null;
  } else {
    value = Number(left.rawValue) - Number(right.rawValue);
  }

  return makeValue(type, value);
}

FUNCTIONS.register(
  'subtract',
  [
    [Type.INTEGER, Type.INTEGER],
    [Type.FLOAT, Type.INTEGER],
    [Type.INTEGER, Type.FLOAT],
    [Type.FLOAT, Type.FLOAT],
  ],
  subtract,
);


function multiply(left: Value<mixed>, right: Value<mixed>): Value<mixed> {
  let type, value;

  if ((left.dataType === Type.FLOAT) || (right.dataType === Type.FLOAT)) {
    type = Type.FLOAT;
  } else {
    type = Type.INTEGER;
  }

  if (left.isNull || right.isNull) {
    value = null;
  } else {
    value = Number(left.rawValue) * Number(right.rawValue);
  }

  return makeValue(type, value);
}

FUNCTIONS.register(
  'multiply',
  [
    [Type.INTEGER, Type.INTEGER],
    [Type.FLOAT, Type.INTEGER],
    [Type.INTEGER, Type.FLOAT],
    [Type.FLOAT, Type.FLOAT],
  ],
  multiply,
);


function modulo(left: Value<mixed>, right: Value<mixed>): Value<mixed> {
  let type, value;

  if ((left.dataType === Type.FLOAT) || (right.dataType === Type.FLOAT)) {
    type = Type.FLOAT;
  } else {
    type = Type.INTEGER;
  }

  if (left.isNull || right.isNull) {
    value = null;
  } else {
    value = Number(left.rawValue) % Number(right.rawValue);
  }

  return makeValue(type, value);
}

FUNCTIONS.register(
  'modulo',
  [
    [Type.INTEGER, Type.INTEGER],
    [Type.FLOAT, Type.INTEGER],
    [Type.INTEGER, Type.FLOAT],
    [Type.FLOAT, Type.FLOAT],
  ],
  modulo,
);


function pow(left: Value<mixed>, right: Value<mixed>): Value<mixed> {
  let type, value;

  if ((left.dataType === Type.FLOAT) || (right.dataType === Type.FLOAT)) {
    type = Type.FLOAT;
  } else {
    type = Type.INTEGER;
  }

  if (left.isNull || right.isNull) {
    value = null;
  } else {
    value = Math.pow(Number(left.rawValue), Number(right.rawValue));
  }

  return makeValue(type, value);
}

FUNCTIONS.register(
  'pow',
  [
    [Type.INTEGER, Type.INTEGER],
    [Type.FLOAT, Type.INTEGER],
    [Type.INTEGER, Type.FLOAT],
    [Type.FLOAT, Type.FLOAT],
  ],
  pow,
);


function divide(left: Value<mixed>, right: Value<mixed>): Value<mixed> {
  let value;

  if (left.isNull || right.isNull) {
    value = null;
  } else if (right.rawValue === 0) {
    throw new ExecutionError('Cannot divide by zero');
  } else {
    value = Number(left.rawValue) / Number(right.rawValue);
  }

  return makeValue(Type.FLOAT, value);
}

FUNCTIONS.register(
  'divide',
  [
    [Type.INTEGER, Type.INTEGER],
    [Type.FLOAT, Type.INTEGER],
    [Type.INTEGER, Type.FLOAT],
    [Type.FLOAT, Type.FLOAT],
  ],
  divide,
);


function abs(value: Value<mixed>): Value<mixed> {
  if (value.isNull) {
    return value;
  }

  return makeValue(value.dataType, Math.abs(Number(value.rawValue)));
}

FUNCTIONS.register(
  'abs',
  [
    [Type.INTEGER],
    [Type.FLOAT],
  ],
  abs,
);


function random(): Value<mixed> {
  return makeValue(Type.FLOAT, Math.random());
}

FUNCTIONS.register(
  'random',
  [],
  random,
);


function log(value: Value<mixed>, base: Value<mixed>): Value<mixed> {
  if (value.isNull || base.isNull) {
    return makeValue(Type.FLOAT, null);
  }
  return makeValue(
    Type.FLOAT,
    Math.log(Number(value.rawValue)) / Math.log(Number(base.rawValue)),
  );
}

FUNCTIONS.register(
  'log',
  [
    [Type.INTEGER, Type.INTEGER],
    [Type.INTEGER, Type.FLOAT],
    [Type.FLOAT, Type.INTEGER],
    [Type.FLOAT, Type.FLOAT],
  ],
  log,
);


function hypot(xValue: Value<mixed>, yValue: Value<mixed>): Value<mixed> {
  if (xValue.isNull || yValue.isNull) {
    return makeValue(Type.FLOAT, null);
  }
  return makeValue(
    Type.FLOAT,
    Math.hypot(Number(xValue.rawValue), Number(yValue.rawValue)),
  );
}

FUNCTIONS.register(
  'hypot',
  [
    [Type.INTEGER, Type.INTEGER],
    [Type.INTEGER, Type.FLOAT],
    [Type.FLOAT, Type.INTEGER],
    [Type.FLOAT, Type.FLOAT],
  ],
  hypot,
);


function roundInteger(value: Value<mixed>): Value<mixed> {
  if (value.isNull) {
    return value;
  }
  return makeValue(Type.INTEGER, roundHalfEven(Number(value.rawValue), 0));
}

FUNCTIONS.register(
  'round',
  [
    [Type.INTEGER],
    [Type.FLOAT],
  ],
  roundInteger,
);


function roundFloat(value: Value<mixed>, precision: Value<mixed>) {
  if (value.isNull || precision.isNull) {
    return makeValue(Type.FLOAT, null);
  }
  return makeValue(
    Type.FLOAT,
    roundHalfEven(Number(value.rawValue), Number(precision.rawValue)),
  );
}

FUNCTIONS.register(
  'round',
  [
    [Type.INTEGER, Type.INTEGER],
    [Type.FLOAT, Type.INTEGER],
  ],
  roundFloat,
);


[
  ['ceil', Math.ceil, Type.INTEGER],
  ['floor', Math.floor, Type.INTEGER],
  ['trunc', Math.trunc, Type.INTEGER],
  ['sin', Math.sin, Type.FLOAT],
  ['cos', Math.cos, Type.FLOAT],
  ['tan', Math.tan, Type.FLOAT],
  ['sqrt', Math.sqrt, Type.FLOAT],
].forEach((spec) => {
  FUNCTIONS.register(
    spec[0],
    [
      [Type.INTEGER],
      [Type.FLOAT],
    ],
    (value) => {
      if (value.isNull) {
        return makeValue(spec[2], null);
      }
      return makeValue(spec[2], spec[1](Number(value.rawValue)));
    },
  );
});


[
  ['pi', makeValue(Type.FLOAT, Math.PI)],
  ['e', makeValue(Type.FLOAT, Math.E)],
].forEach((spec) => {
  FUNCTIONS.register(
    spec[0],
    [],
    () => spec[1],
  );
});

