// @flow

import {FUNCTIONS} from '../Dispatcher';
import {Type, Value, BooleanValue, makeValue} from '../types';
import {ExecutionError} from '../errors';


function logical_not(value: Value<mixed>): Value<mixed> {
  return makeValue(Type.BOOLEAN, !value.rawValue);
}

FUNCTIONS.register(
  'not',
  [
    [Type.BOOLEAN],
  ],
  logical_not,
);


function and(left: Value<mixed>, right: Value<mixed>): Value<mixed> {
  return makeValue(
    Type.BOOLEAN,
    BooleanValue.fromValue(left).rawValue && BooleanValue.fromValue(right).rawValue
  );
}

FUNCTIONS.register('and', [], and);


function or(left: Value<mixed>, right: Value<mixed>): Value<mixed> {
  return makeValue(
    Type.BOOLEAN,
    BooleanValue.fromValue(left).rawValue || BooleanValue.fromValue(right).rawValue
  );
}

FUNCTIONS.register('or', [], or);


function xor(left: Value<mixed>, right: Value<mixed>): Value<mixed> {
  return makeValue(
    Type.BOOLEAN,
    BooleanValue.fromValue(left).rawValue !== BooleanValue.fromValue(right).rawValue
  );
}

FUNCTIONS.register('xor', [], xor);


function logical_if(...args: Array<Value<mixed>>) {
  if ((args.length < 3) || ((args.length % 2) !== 1)) {
    throw new ExecutionError('Incorrect number of arguments');
  }

  for (let i = 0; i < (args.length - 1); i += 2) {
    if (BooleanValue.fromValue(args[i]).rawValue) {
      return args[i + 1];
    }
  }

  return args[args.length - 1];
}

FUNCTIONS.register('if', [], logical_if);


function logical_switch(...args: Array<Value<mixed>>) {
  if ((args.length < 4) || ((args.length % 2) !== 0)) {
    throw new ExecutionError('Incorrect number of arguments');
  }

  let value = args[0];

  for (let i = 1; i < (args.length - 1); i += 2) {
    let match = FUNCTIONS.call('equal', [value, args[i]]);
    if (match.rawValue) {
      return args[i + 1];
    }
  }

  return args[args.length - 1];
}

FUNCTIONS.register('switch', [], logical_switch);

