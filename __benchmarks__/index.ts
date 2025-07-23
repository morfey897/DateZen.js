import { Bench } from 'tinybench';

import dayjs from 'dayjs';

import printBenchTable from './printResult';
import dateZen from '../src/index';
import formatPlugin from '../src/plugins/format';
dateZen.use('format', formatPlugin);

const tests = Array.from({ length: 100_000 }, (_, i) => {
  const date = new Date(
    1900 + Math.floor(Math.random() * 400),
    0,
    1 + (i % 365),
    13
  );
  return {
    iso: date.toISOString(),
    ts: date.getTime(),
  };
});

let index = 0;

const bench = new Bench({
  time: 20,
  setup: (_task, mode) => {
    // Run the garbage collector before warmup at each cycle
    if (mode === 'warmup' && typeof globalThis.gc === 'function') {
      globalThis.gc();
    }
    if (mode === 'run') {
      index = index++ % tests.length;
    }
  },
});

bench
  // Parse the date from timestamp
  .add('DZ - building from timestamp', () => {
    const ts = tests[index].ts;
    const dz = dateZen(ts);
  })
  .add('Native - building from timestamp', () => {
    const ts = tests[index].ts;
    const date = new Date(ts);
  })
  .add('DayJS - building from timestamp', () => {
    const ts = tests[index].ts;
    const date = dayjs(ts);
  })
  // Parse the date from ISO string
  .add('DZ - building from ISO', () => {
    const iso = tests[index].iso;
    const dz = dateZen(iso);
  })
  .add('Native - building from ISO', () => {
    const iso = tests[index].iso;
    const date = new Date(iso);
  })
  .add('DayJS - building from ISO', () => {
    const iso = tests[index].iso;
    const date = dayjs(iso);
  })
  // Convert date to ISO string
  .add('DZ .toISO()', () => {
    const value = tests[index].ts;
    const date = dateZen(value);
    const str = date.toISOString();
  })
  .add('Native .toISO()', () => {
    const value = tests[index].ts;
    const date = new Date(value);
    const str = date.toISOString();
  })
  .add('DayJS .toISO()', () => {
    const value = tests[index].ts;
    const date = dayjs(value);
    const str = date.toISOString();
  })
  // Format date to string
  .add('DZ .format()', () => {
    const value = tests[index].ts;
    const date = dateZen(value);
    const str = date.format('YYYY-MM-DD HH:mm:ss');
  })
  .add('Native .format()', () => {
    const value = tests[index].ts;
    const date = new Date(value);
    const str = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'UTC',
      hour12: false, // 24-hour format
    });
  })
  .add('DayJS .format()', () => {
    const value = tests[index].ts;
    const date = dayjs(value);
    const str = date.format('YYYY-MM-DD HH:mm:ss');
  })
  // Convert date to timestamp
  .add('DZ .toMillsec()', () => {
    const value = tests[index].ts;
    const date = dateZen(value);
    const ms = date.valueOf();
  })
  .add('Native .toMillsec()', () => {
    const value = tests[index].ts;
    const date = new Date(value);
    const ms = date.getTime();
  })
  .add('DayJS .toMillsec()', () => {
    const value = tests[index].ts;
    const date = dayjs(value);
    const ms = date.valueOf();
  });

bench.run().then((tasks) => {
  printBenchTable('Benchmark DZ Results', tasks, 3);
});
