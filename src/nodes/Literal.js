// @flow

import Node from './Node';
import Token from '../Token';
import {Type} from '../types';


export default class Literal extends Node {
  dataType: Type;
  value: ?(string | number | boolean);

  constructor(token: Token, dataType: Type, value: ?(string | number | boolean) = null) {
    super('literal', token, token);
    this.dataType = dataType;
    this.value = value == null ? token.literal : value;
  }

  pretty(indent: number = 0): string {
    let pad = ' '.repeat(indent);
    return `${pad}Literal(${String(this.value)})`;
  }
}

