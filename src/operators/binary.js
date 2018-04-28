// @flow

import {BINARY_OPERATORS, FUNCTIONS} from '../Dispatcher';
import TokenType from '../TokenType';
import {Type} from '../types';


[
  [
    TokenType.PLUS,
    [
      [Type.INTEGER, Type.INTEGER],
      [Type.FLOAT, Type.INTEGER],
      [Type.INTEGER, Type.FLOAT],
      [Type.FLOAT, Type.FLOAT],
      [Type.DATE, Type.INTEGER],
      [Type.DATE, Type.FLOAT],
      [Type.INTEGER, Type.DATE],
      [Type.FLOAT, Type.DATE],
      [Type.DATETIME, Type.INTEGER],
      [Type.DATETIME, Type.FLOAT],
      [Type.INTEGER, Type.DATETIME],
      [Type.FLOAT, Type.DATETIME],
      [Type.TIME, Type.INTEGER],
      [Type.TIME, Type.FLOAT],
      [Type.INTEGER, Type.TIME],
      [Type.FLOAT, Type.TIME],
    ],
    'add',
  ],

  [
    TokenType.MINUS,
    [
      [Type.INTEGER, Type.INTEGER],
      [Type.FLOAT, Type.INTEGER],
      [Type.INTEGER, Type.FLOAT],
      [Type.FLOAT, Type.FLOAT],
      [Type.DATE, Type.INTEGER],
      [Type.DATE, Type.FLOAT],
      [Type.DATETIME, Type.INTEGER],
      [Type.DATETIME, Type.FLOAT],
      [Type.TIME, Type.INTEGER],
      [Type.TIME, Type.FLOAT],
      [Type.DATE, Type.DATE],
      [Type.DATE, Type.DATETIME],
      [Type.DATETIME, Type.DATE],
      [Type.DATETIME, Type.DATETIME],
      [Type.TIME, Type.TIME],
    ],
    'subtract',
  ],

  [
    TokenType.STAR,
    [
      [Type.INTEGER, Type.INTEGER],
      [Type.FLOAT, Type.INTEGER],
      [Type.INTEGER, Type.FLOAT],
      [Type.FLOAT, Type.FLOAT],
    ],
    'multiply',
  ],

  [
    TokenType.SLASH,
    [
      [Type.INTEGER, Type.INTEGER],
      [Type.FLOAT, Type.INTEGER],
      [Type.INTEGER, Type.FLOAT],
      [Type.FLOAT, Type.FLOAT],
    ],
    'divide',
  ],

  [
    TokenType.PERCENT,
    [
      [Type.INTEGER, Type.INTEGER],
      [Type.FLOAT, Type.INTEGER],
      [Type.INTEGER, Type.FLOAT],
      [Type.FLOAT, Type.FLOAT],
    ],
    'modulo',
  ],

  [
    TokenType.STAR_STAR,
    [
      [Type.INTEGER, Type.INTEGER],
      [Type.FLOAT, Type.INTEGER],
      [Type.INTEGER, Type.FLOAT],
      [Type.FLOAT, Type.FLOAT],
    ],
    'pow',
  ],

  [
    TokenType.AMPERSAND,
    [],
    'and',
  ],

  [
    TokenType.PIPE,
    [],
    'or',
  ],

  [
    TokenType.CARET,
    [],
    'xor',
  ],

  [
    TokenType.EQUAL_EQUAL,
    [],
    'equal',
  ],

  [
    TokenType.BANG_EQUAL,
    [],
    'notEqual',
  ],

  [
    TokenType.LESSER,
    [],
    'lesser',
  ],

  [
    TokenType.LESSER_EQUAL,
    [],
    'lesserEqual',
  ],

  [
    TokenType.GREATER,
    [],
    'greater',
  ],

  [
    TokenType.GREATER_EQUAL,
    [],
    'greaterEqual',
  ],

].forEach((spec) => {
  BINARY_OPERATORS.register(
    spec[0].name,
    spec[1],
    (left, right) => FUNCTIONS.call(spec[2], [left, right]),
  );
});

