// @flow

import {UNARY_OPERATORS, FUNCTIONS} from '../Dispatcher';
import TokenType from '../TokenType';
import {Type} from '../types';


[
  [
    TokenType.MINUS,
    [
      [Type.INTEGER],
      [Type.FLOAT],
    ],
    'negative',
  ],

  [
    TokenType.BANG,
    [
      [Type.BOOLEAN],
    ],
    'not',
  ],

].forEach((spec) => {
  UNARY_OPERATORS.register(
    spec[0].name,
    spec[1],
    (value) => FUNCTIONS.call(spec[2], [value]),
  );
});

