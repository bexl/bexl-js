/* global console */
/* eslint-disable no-console */

import fs from 'fs';

import {ArgumentParser} from 'argparse';
import {DateTime} from 'luxon';
import readlineSync from 'readline-sync';

import pkg from '../package.json';
import {
  Lexer, Parser, Interpreter, VariableResolver,
  LexerError, ParserError, InterpreterError, ResolverError,
  DateValue, TimeValue, DateTimeValue,
} from '.';


class Repl {
  constructor() {
    this.version = `bexl-js ${pkg.version}`;
    this.debug = false;
    this.resolver = new VariableResolver();

    this.parser = new ArgumentParser({
      version: this.version,
      addHelp: true,
      description: 'Evaluates Basic EXpression Language (BEXL) expressions.',
    });

    this.parser.addArgument(
      'source_file',
      {
        action: 'store',
        nargs: '?',
        defaultValue: null,
        help: 'the path to the file containing a BEXL expression to evaluate',
      },
    );

    this.parser.addArgument(
      ['-e', '--eval'],
      {
        action: 'store',
        metavar: 'EXPR',
        help: 'evaluates the specified BEXL expression and outputs the result',
      },
    );
    this.parser.addArgument(
      ['-d', '--debug'],
      {
        action: 'storeTrue',
        help: 'enables debug mode, which outputs parsing and evaluation in addition to the results',
      },
    );

    this.parser.addArgument(
      '--var',
      {
        action: 'append',
        metavar: 'NAME=VALUE',
        defaultValue: [],
        help: 'sets a variable for use in the expression',
      },
    );
    this.parser.addArgument(
      '--intvar',
      {
        action: 'append',
        metavar: 'NAME=VALUE',
        defaultValue: [],
        help: 'sets an integer variable for use in the expression',
      },
    );
    this.parser.addArgument(
      '--floatvar',
      {
        action: 'append',
        metavar: 'NAME=VALUE',
        defaultValue: [],
        help: 'sets a float variable for use in the expression',
      },
    );
    this.parser.addArgument(
      '--boolvar',
      {
        action: 'append',
        metavar: 'NAME=VALUE',
        defaultValue: [],
        help: 'sets a boolean variable for use in the expression',
      },
    );
    this.parser.addArgument(
      '--strvar',
      {
        action: 'append',
        metavar: 'NAME=VALUE',
        defaultValue: [],
        help: 'sets a string variable for use in the expression',
      },
    );
    this.parser.addArgument(
      '--datevar',
      {
        action: 'append',
        metavar: 'NAME=VALUE',
        defaultValue: [],
        help: 'sets a date variable for use in the expression',
      },
    );
    this.parser.addArgument(
      '--timevar',
      {
        action: 'append',
        metavar: 'NAME=VALUE',
        defaultValue: [],
        help: 'sets a time variable for use in the expression',
      },
    );
    this.parser.addArgument(
      '--datetimevar',
      {
        action: 'append',
        metavar: 'NAME=VALUE',
        defaultValue: [],
        help: 'sets a datetime variable for use in the expression',
      },
    );
  }

  run(args) {
    let params = this.parseArguments(args);

    if (params.eval) {
      return this.runSource(params.eval) ? 0 : 1;
    } else if (params.source_file) {
      let source = fs.readFileSync(params.source_file, 'utf8');
      return this.runSource(source) ? 0 : 1;
    }

    console.log(this.version);
    console.log('Type \\h for help');

    readlineSync.promptLoop((line) => {
      if (line.startsWith('\\')) {
        return this.doCommand(line);
      } else if (line) {
        this.runSource(line);
      }
    });

    return 0;
  }

  parseArguments(args) {
    let params = this.parser.parseArgs(args);
    this.debug = params.debug;

    [
      [params.var, this._parseVarAny],
      [params.intvar, this._parseVarInteger],
      [params.floatvar, this._parseVarFloat],
      [params.boolvar, this._parseVarBoolean],
      [params.strvar, this._parseVarString],
      [params.datevar, this._parseVarDate],
      [params.timevar, this._parseVarTime],
      [params.datetimevar, this._parseVarDateTime],
    ].forEach((varspec) => {
      varspec[0].forEach((v) => {
        let parts = v.split('=', 2);
        if (parts.length === 2) {
          this.resolver.set(parts[0], varspec[1].call(this, parts[1]));
        } else {
          this.resolver.set(v, null);
        }
      });
    });

    return params;
  }

  _parseVarInteger(value) {
    let parsed = Number(value);
    if (Number.isInteger(parsed)) {
      return parsed;
    }
    throw new Error(`"${value}" is not an integer value`);
  }

  _parseVarFloat(value) {
    let parsed = Number(value);
    if (!Number.isNaN(parsed) && Number.isFinite(parsed)) {
      return parsed;
    }
    throw new Error(`"${value}" is not a float value`);
  }

  _parseVarBoolean(value) {
    if (value.toLowerCase() === 'true') {
      return true;
    } else if (value.toLowerCase() === 'false') {
      return false;
    }
    throw new Error(`"${value}" is not a boolean value`);
  }

  _parseVarDate(value) {
    if (DateValue.REGEX.test(value)) {
      let val = DateTime.fromISO(value);
      if (val.isValid) {
        return new DateValue(val);
      }
    }
    throw new Error(`"${value}" is not a date value`);
  }

  _parseVarTime(value) {
    if (TimeValue.REGEX.test(value)) {
      let val = DateTime.fromISO(value);
      if (val.isValid) {
        return new TimeValue(val);
      }
    }
    throw new Error(`"${value}" is not a time value`);
  }

  _parseVarDateTime(value) {
    if (DateTimeValue.REGEX.test(value)) {
      let val = DateTime.fromISO(value);
      if (val.isValid) {
        return new DateTimeValue(val);
      }
    }
    throw new Error(`"${value}" is not a datetime value`);
  }

  _parseVarString(value) {
    return value;
  }

  _parseVarAny(value) {
    let parsers = [
      this._parseVarInteger,
      this._parseVarFloat,
      this._parseVarBoolean,
      this._parseVarDate,
      this._parseVarTime,
      this._parseVarDateTime,
      this._parseVarString,
    ];
    for (let i = 0; i < parsers.length; i++) {
      try {
        return parsers[i](value);
      } catch (exc) {}  // eslint-disable-line no-empty
    }
    throw new Error(`Cannot determine the type of "${value}"`);
  }

  runSource(source) {
    if (this.debug) {
      let tokens;
      try {
        tokens = new Lexer(source).lex();
      } catch (exc) {
        this.showError(source, exc);
        return false;
      }

      console.log('Tokens Found:');
      tokens.forEach((token) => {
        console.log(token.pretty(2));
      });
      console.log();
    }

    let tree;
    try {
      tree = new Parser().parse(source);
    } catch (exc) {
      this.showError(source, exc);
      return false;
    }
    if (this.debug) {
      console.log('AST:');
      console.log(tree.pretty(2));
      console.log();
    }

    let result;
    try {
      result = new Interpreter().interpret(tree, this.resolver);
    } catch (exc) {
      this.showError(source, exc);
      return false;
    }
    if (this.debug) {
      console.log('Result:');
      console.log(`  ${result}`);
      console.log();
    }

    console.log(result.toPlainString());
    return true;
  }

  showError(source, error) {
    console.log(`Error: ${error}`);
    console.log(source);

    let start, end;
    if (error instanceof LexerError) {
      start = error.column;
      end = error.column;
    } else if (error instanceof ParserError) {
      start = error.token.column;
      end = start + error.token.length;
    } else if (error instanceof InterpreterError) {
      start = error.node.startToken.column;
      end = error.node.endToken.column + error.node.endToken.length;
    }

    if (start != null) {
      let loc = `${' '.repeat(start)}${'^'.repeat((end - start) || 1)}`;
      console.log(loc);
    }
  }

  doCommand(command) {
    let parts = command.split(' ');
    let name = parts[0].slice(1);
    let args = [this].concat(parts.slice(1));

    if (REPL_COMMANDS[name]) {
      return REPL_COMMANDS[name].impl.apply(null, args);
    } else {
      console.log(`Unrecognized command: ${command}`);
    }
  }
}


function variableCommand(parser, repl, name, ...value) {
  if (!name) { return; }
  if (value.length === 0) {
    try {
      console.log(`${name} = ${repl.resolver.get(name)}`);
    } catch (exc) {
      if (!(exc instanceof ResolverError)) {
        throw exc;
      }
    }
  } else {
    try {
      repl.resolver.set(name, repl[parser](value.join(' ')));
    } catch (exc) {
      console.log(exc.message);
    }
  }
}


const REPL_COMMANDS = {
  'h': {
    impl: () => {
      Object.keys(REPL_COMMANDS).sort().forEach((name) => {
        if (REPL_COMMANDS[name].help) {
          console.log(REPL_COMMANDS[name].help);
          console.log();
        }
      });
    },
  },

  'd': {
    help: `\\d [on|off]
    Enables or disabled debug mode.`,
    impl: (repl, desired) => {
      if (!desired) {
        console.log(`Debug mode is ${repl.debug ? 'ON' : 'OFF'}`);
      } else if (desired.toLowerCase() === 'on') {
        repl.debug = true;
      } else if (desired.toLowerCase() === 'off') {
        repl.debug = false;
      }
    },
  },

  'q': {
    help: `\\q
    Quits this interpreter session.`,
    impl: () => true,
  },

  'v': {
    help: `\\v [name] [value]
    Sets the variable [name] so that it can be used in expressions. If no [value] is provided, prints the value of the specified variable. If no [name] is provided, lists all variables and their values.`,
    impl: (repl, name, ...value) => {
      if (!name) {
        let vars = repl.resolver.all();
        Object.keys(vars).sort().forEach((name) => {
          console.log(`${name} = ${vars[name]}`);
        });
      } else {
        let val = value.length === 0 ? null : value.join(' ');
        repl.resolver.set(name, repl._parseVarAny(val));
      }
    },
  },

  'vx': {
    help: `\\vx <name>
    Deletes the variable [name].`,
    impl: (repl, name) => {
      if (name) {
        repl.resolver.remove(name);
      }
    },
  },

  'vi': {
    help: `\\vi <name> [value]
    Sets an integer variable <name> so that it can be used in expressions. If no [value] is provided, prints the value of the specified variable.`,
    impl: variableCommand.bind(null, '_parseVarInteger'),
  },

  'vf': {
    help: `\\vf <name> [value]
    Sets a float variable <name> so that it can be used in expressions. If no [value] is provided, prints the value of the specified variable.`,
    impl: variableCommand.bind(null, '_parseVarFloat'),
  },

  'vb': {
    help: `\\vb <name> [value]
    Sets a boolean variable <name> so that it can be used in expressions. If no [value] is provided, prints the value of the specified variable.`,
    impl: variableCommand.bind(null, '_parseVarBoolean'),
  },

  'vs': {
    help: `\\vs <name> [value]
    Sets a string variable <name> so that it can be used in expressions. If no [value] is provided, prints the value of the specified variable.`,
    impl: variableCommand.bind(null, '_parseVarString'),
  },

  'vd': {
    help: `\\vd <name> [value]
    Sets a date variable <name> so that it can be used in expressions. If no [value] is provided, prints the value of the specified variable.`,
    impl: variableCommand.bind(null, '_parseVarDate'),
  },

  'vt': {
    help: `\\vt <name> [value]
    Sets a time variable <name> so that it can be used in expressions. If no [value] is provided, prints the value of the specified variable.`,
    impl: variableCommand.bind(null, '_parseVarTime'),
  },

  'vdt': {
    help: `\\vdd <name> [value]
    Sets a datetime variable <name> so that it can be used in expressions. If no [value] is provided, prints the value of the specified variable.`,
    impl: variableCommand.bind(null, '_parseVarDateTime'),
  },
};


export default function (args) {
  return new Repl().run(args);
}

