#!/usr/bin/env node

import repl from './repl';

process.exit(repl(process.argv.slice(2)));  // eslint-disable-line no-undef

