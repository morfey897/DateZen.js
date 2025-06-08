import chalk from 'chalk';
import { TaskResult } from 'tinybench';

const mToNs = (m: number) => m * 1e6;

const formatNumber = (
  x: number,
  targetDigits: number,
  maxFractionDigits: number
): string => {
  // Round large numbers to integers, but not to multiples of 10.
  // The actual number of significant digits may be more than `targetDigits`.
  if (Math.abs(x) >= 10 ** targetDigits) {
    return x.toFixed();
  }

  // Round small numbers to have `maxFractionDigits` digits after the decimal dot.
  // The actual number of significant digits may be less than `targetDigits`.
  if (Math.abs(x) < 10 ** (targetDigits - maxFractionDigits)) {
    return x.toFixed(maxFractionDigits);
  }

  // Round medium magnitude numbers to have exactly `targetDigits` significant digits.
  return x.toPrecision(targetDigits);
};

const MAX_COLUMN_WIDTH = 25;

const SEPARATOR = '│';

type Modifier =
  | 'reset'
  | 'bold'
  | 'dim'
  | 'italic'
  | 'underline'
  | 'inverse'
  | 'hidden'
  | 'strikethrough'
  | 'visible';
type Color =
  | 'black'
  | 'red'
  | 'green'
  | 'yellow'
  | 'blue'
  | 'magenta'
  | 'cyan'
  | 'white'
  | 'gray'
  | 'grey';

export default function printBenchTable(
  title: string,
  tasks: { name: string; result: TaskResult | undefined }[],
  recordsPerTask: number = 2
) {
  const toValue = (
    str: string,
    options: { clr: Color; mdf?: Modifier; to: 'start' | 'end' } = {
      clr: 'white',
      mdf: undefined,
      to: 'end',
    }
  ) => {
    const result =
      str.length > MAX_COLUMN_WIDTH
        ? str.slice(0, MAX_COLUMN_WIDTH)
        : options.to === 'end'
          ? str.padStart(MAX_COLUMN_WIDTH, ' ')
          : str.padEnd(MAX_COLUMN_WIDTH, ' ');
    const inst = chalk[options.clr];
    if (!inst) return result;
    return options.mdf ? inst[options.mdf](result) : inst(result);
  };

  const header = [
    toValue('Name', { clr: 'white', mdf: 'bold', to: 'start' }),
    toValue('Latency avg (ns)', { clr: 'white', mdf: 'bold', to: 'end' }),
    toValue('Latency med (ns)', { clr: 'white', mdf: 'bold', to: 'end' }),
    toValue('Throughput avg (opts/s)', {
      clr: 'white',
      mdf: 'bold',
      to: 'end',
    }),
    toValue('Throughput med (opts/s)', {
      clr: 'white',
      mdf: 'bold',
      to: 'end',
    }),
    toValue('Samples', { clr: 'white', mdf: 'bold', to: 'end' }),
  ].join(SEPARATOR);

  const separator = '─'.repeat(header.replace(/\x1B\[[0-9;]*m/g, '').length);

  console.log('\n📊 ' + chalk.bold.underline(title) + ':\n');
  console.log(separator);
  console.log(header);
  console.log(separator);

  const len = tasks.length;
  for (let i = 0; i < len; i += recordsPerTask) {
    for (let j = 0; j < recordsPerTask && i + j < len; j++) {
      const { name, result } = tasks[i + j];
      const first = j === 0;
      const mdf = first ? 'bold' : undefined;
      const { latency, throughput } = result || {};
      const line = [
        toValue(name, { clr: 'gray', mdf, to: 'start' }),
        toValue(mToNs(latency?.mean || 0).toFixed(4), {
          clr: 'green',
          mdf,
          to: 'end',
        }),
        toValue(mToNs(latency?.p50 || 0).toFixed(4), {
          clr: 'cyan',
          mdf,
          to: 'end',
        }),
        toValue(throughput?.mean?.toFixed(4) ?? 'n/a', {
          clr: 'blue',
          mdf,
          to: 'end',
        }),
        toValue(throughput?.p50?.toFixed(4) ?? 'n/a', {
          clr: 'magenta',
          mdf,
          to: 'end',
        }),
        toValue(latency?.samples?.length?.toString() ?? 'n/a', {
          clr: 'yellow',
          mdf,
          to: 'end',
        }),
        ,
      ];
      console.log(line.join(SEPARATOR));
      if (j === recordsPerTask - 1 && i + recordsPerTask < len) {
        console.log(
          new Array(line.length)
            .fill(' '.repeat(MAX_COLUMN_WIDTH))
            .join(SEPARATOR)
        );
      }
    }
  }

  console.log(separator);
}

// 'Task name': task.name,
// 'Latency avg (ns)': `${formatNumber(mToNs(latency.mean), 5, 2)} \xb1 ${latency.rme.toFixed(2)}%`,
// // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
// 'Latency med (ns)': `${formatNumber(mToNs(latency.p50!), 5, 2)} \xb1 ${formatNumber(mToNs(latency.mad!), 5, 2)}`,
// 'Throughput avg (ops/s)': `${Math.round(throughput.mean).toString()} \xb1 ${throughput.rme.toFixed(2)}%`,
// // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
// 'Throughput med (ops/s)': `${Math.round(throughput.p50!).toString()} \xb1 ${Math.round(throughput.mad!).toString()}`,
// Samples: latency.samples.length,
