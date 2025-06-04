import { Bench } from 'tinybench';

import printBenchTable from './printResult';
import DateZen from '../src/core/DateZen.class';

const testISOs = Array.from({ length: 100_000 }, (_, i) => {
  const date = new Date(1965, 0, 1 + (i % 365), 13); // 1965-01-01 + i days
  return date.toISOString();
});
const testTSs = testISOs.map((iso) => new Date(iso).getTime());
let index = 0;

const bench = new Bench({ time: 100 });

bench
  .add('DZ from ISO', () => {
    const iso = testISOs[index++ % testISOs.length];
    const dz = new DateZen(iso);
    return dz;
  })
  .add('Native from ISO', () => {
    const iso = testISOs[index++ % testISOs.length];
    return new Date(iso);
  })
  .add('DZ from TS', () => {
    const ts = testTSs[index++ % testTSs.length];
    const dz = new DateZen(ts);
    return dz;
  })
  .add('Native from TS', () => {
    const ts = testTSs[index++ % testTSs.length];
    const date = new Date(ts);
    return date;
  })
  .add('DZ .toParts()', () => {
    const iso = testISOs[index++ % testISOs.length];
    const dz = new DateZen(iso);
    const parts = dz.toParts();
    return parts;
  })
  .add('Native .toParts()', () => {
    const iso = testISOs[index++ % testISOs.length];
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
    return parts;
  })
  .add('DZ .toISO()', () => {
    const iso = testISOs[index++ % testISOs.length];
    const dz = new DateZen(iso);
    const str = dz.toISOString();
    return str;
  })
  .add('Native .toISO()', () => {
    const iso = testISOs[index++ % testISOs.length];
    const date = new Date(iso);
    const str = date.toISOString();
    return str;
  })
  .add('DZ .toString()', () => {
    const iso = testISOs[index++ % testISOs.length];
    const dz = new DateZen(iso);
    const str = dz.toString();
    return str;
  })
  .add('Native .toString()', () => {
    const iso = testISOs[index++ % testISOs.length];
    const date = new Date(iso);
    const str = date.toString();
    return str;
  })
  .add('DZ .toMillsec()', () => {
    const iso = testISOs[index++ % testISOs.length];
    const dz = new DateZen(iso);
    const ms = dz.toMillseconds();
    return ms;
  })
  .add('Native .toMillsec()', () => {
    const iso = testISOs[index++ % testISOs.length];
    const date = new Date(iso);
    const ms = date.getTime();
    return ms;
  });

bench.run().then((tasks) => {
  printBenchTable('Benchmark DZ Results', tasks);
});
