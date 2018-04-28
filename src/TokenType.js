// @flow

import {Enum} from 'enumify';


export default class TokenType extends Enum {}

TokenType.initEnum([
  'PLUS',
  'MINUS',
  'STAR',
  'SLASH',
  'PERCENT',
  'STAR_STAR',
  'EQUAL_EQUAL',
  'BANG_EQUAL',
  'LESSER',
  'LESSER_EQUAL',
  'GREATER',
  'GREATER_EQUAL',
  'AMPERSAND',
  'PIPE',
  'CARET',
  'BANG',
  'LEFT_PAREN',
  'RIGHT_PAREN',
  'LEFT_BRACKET',
  'RIGHT_BRACKET',
  'INTEGER',
  'FLOAT',
  'STRING',
  'TRUE',
  'FALSE',
  'NULL',
  'IDENTIFIER',
  'COMMA',
  'DOLLAR',
  'COLON',
  'PERIOD',
  'EOF',
]);

