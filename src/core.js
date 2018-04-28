// @flow

import Lexer from './Lexer';
import Parser from './Parser';
import Interpreter from './Interpreter';
import VariableResolver from './VariableResolver';
import {bexlToJs} from './types';


type EvaluationOptions = {
  native?: boolean,
  variableResolver?: ({} | VariableResolver),
  lexer?: Class<Lexer>,
  parser?: Class<Parser>,
};


export function evaluate(source: string, options?: EvaluationOptions) {
  options = options || {};
  let lexer = options.lexer || Lexer;
  let parser = options.parser || Parser;
  let ast = new parser(lexer).parse(source);
  let result = new Interpreter().interpret(ast, options.variableResolver);

  if (options.native) {
    return bexlToJs(result);
  }
  return result;
}

