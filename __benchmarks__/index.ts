import { Bench } from 'tinybench';

import printBenchTable from './printResult';
import DateZen from '../src/core/DateZen.class';

const bench = new Bench({ time: 2000 });

const iso = '1965-03-25T13:00:00.000Z';
const ts = -157766400000;

bench
  .add('DZ from ISO', () => {
    new DateZen(iso);
  })
  .add('Date from ISO', () => {
    new Date(iso);
  })
  .add('DZ from TS', () => {
    new DateZen(ts);
  })
  .add('Date from TS', () => {
    new Date(ts);
  })
  .add('DZ .toParts()', () => {
    new DateZen(iso).toParts();
  })
  .add('Date .toParts()', () => {
    const date = new Date(iso);
    const parts = {
      yyyy: date.getUTCFullYear(),
      mm: date.getUTCMonth() + 1,
      mmIndex: date.getUTCMonth(),
      dd: date.getUTCDate(),
      d: date.getUTCDay(),
      h: date.getUTCHours(),
      m: date.getUTCMinutes(),
      s: date.getUTCSeconds(),
      ms: date.getUTCMilliseconds(),
    };
  })
  .add('DZ .toISO()', () => {
    new DateZen(iso).toISOString();
  })
  .add('Date .toISO()', () => {
    new Date(iso).toISOString();
  })
  .add('DZ .toMillsec()', () => {
    new DateZen(iso).toMillseconds();
  })
  .add('Date .toMillsec()', () => {
    new Date(iso).getTime();
  });

bench.run().then(() => {
  printBenchTable('Benchmark DZ Results', bench.tasks);
});
