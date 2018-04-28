// @flow

import {FUNCTIONS} from '../Dispatcher';
import {Type, Value, makeValue} from '../types';
import {ExecutionError} from '../errors';


[
  ['upper', 'toUpperCase'],
  ['lower', 'toLowerCase'],
  ['trim', 'trim'],
  ['ltrim', 'trimLeft'],
  ['rtrim', 'trimRight'],
].forEach((spec) => {
  FUNCTIONS.register(
    spec[0],
    [
      [Type.STRING],
    ],
    (value) => {
      if (value.isEmpty) {
        return value;
      }
      // $FlowFixMe
      return makeValue(Type.STRING, value.rawValue[spec[1]]());
    }
  );
});


function replace(value: Value<mixed>, needle: Value<mixed>, replacement: Value<mixed>): Value<mixed> {
  if (value.isEmpty || needle.isEmpty) {
    return value;
  }
  let repl = replacement.isNull ? '' : String(replacement.rawValue);
  return makeValue(
    Type.STRING,
    String(value.rawValue).replace(String(needle.rawValue), repl),
  );
}

FUNCTIONS.register(
  'replace',
  [
    [Type.STRING, Type.STRING, Type.STRING],
  ],
  replace,
);


function repeat(value: Value<mixed>, repetitions: Value<mixed>): Value<mixed> {
  if (value.isEmpty || repetitions.isNull) {
    return value;
  }
  let rep = Number(repetitions.rawValue);
  if (rep < 0) {
    throw new ExecutionError('Repetitions cannot be negative');
  }
  return makeValue(Type.STRING, String(value.rawValue).repeat(rep));
}

FUNCTIONS.register(
  'repeat',
  [
    [Type.STRING, Type.INTEGER],
  ],
  repeat,
);

