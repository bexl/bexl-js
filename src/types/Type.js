import {Enum} from 'enumify';


export default class Type extends Enum {}

Type.initEnum([
  'UNTYPED',
  'STRING',
  'FLOAT',
  'INTEGER',
  'BOOLEAN',
  'DATE',
  'TIME',
  'DATETIME',
  'LIST',
  'RECORD',
]);

