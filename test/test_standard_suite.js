const mapValues = require('lodash/mapValues');
const DateTime = require('luxon').DateTime;
const YAML = require('yamljs');
const expect = require('chai').expect;

const bexl = require('../src');


const SUITE = YAML.load(`${__dirname}/standard_test_suite.yaml`).suite;


function makeValue(value, type) {
  if (value == null) {
    return bexl.makeValue(bexl.Type[type], value);
  }
  if (type === 'DATE') {
    return new bexl.DateValue.makeFrom(bexl.StringValue(value));
  }
  if (type === 'TIME') {
    return new bexl.TimeValue.makeFrom(bexl.StringValue(value));
  }
  if (type === 'DATETIME') {
    return new bexl.DateTimeValue.makeFrom(bexl.StringValue(value));
  }
  if (type === 'LIST') {
    return new bexl.ListValue(value.map((val) => bexl.jsToBexl(val)));
  }
  if (type === 'RECORD') {
    return new bexl.RecordValue(mapValues(value, bexl.jsToBexl));
  }
  return bexl.makeValue(bexl.Type[type], value);
}


function makeNative(value, type) {
  if (value == null) {
    return null;
  }
  switch (type) {
    case 'DATE':
    case 'DATETIME':
      return DateTime.fromISO(value, {zone: 'UTC'}).toJSDate();
    case 'TIME':
      let val = DateTime.fromISO(value, {zone: 'UTC'});
      return val.set({year: 1, month: 1, day: 1}).toJSDate();
  }
  return value;
}


describe('Standard Test Suite', () => {
  SUITE.forEach((group) => {
    describe(group.desc, () => {
      group.tests.forEach((test) => {
        it(test.desc, () => {
          let resolver = new bexl.VariableResolver();
          if (test.vars) {
            Object.keys(test.vars).forEach((key) => {
              resolver.set(key, makeValue(test.vars[key].value, test.vars[key].type));
            });
          }

          let actual;
          try {
            actual = bexl.evaluate(
              test.expr,
              {
                variableResolver: resolver,
                raw: true,
              }
            );
          } catch (exc) {
            if (exc instanceof bexl.BexlError) {
              if (test.error) {
                return;
              }
              throw exc;
            }
          }
          expect(test.error).to.be.undefined;
          if (test.result.value !== undefined) {
            let out = bexl.bexlToJs(actual);
            let expected = makeNative(test.result.value, test.result.type);
            if ((test.result.type === 'FLOAT') && (out != null)) {
              expect(out).to.be.closeTo(expected, 0.000001);
            } else {
              expect(out).to.deep.equal(expected);
            }
          }
          expect(actual.dataType.name).to.be.equal(test.result.type);
        });
      });
    });
  });
});

