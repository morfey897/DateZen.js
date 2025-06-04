import chalk from 'chalk';
import { TaskResult } from 'tinybench';

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
  tasks: { name: string; result: TaskResult | undefined }[]
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
    toValue('Throughput (ops/sec)', { clr: 'white', mdf: 'bold', to: 'end' }),
    toValue('Latency Avg (ms)', { clr: 'white', mdf: 'bold', to: 'end' }),
    toValue('Std Deviation (ms)', { clr: 'white', mdf: 'bold', to: 'end' }),
    toValue('Samples', { clr: 'white', mdf: 'bold', to: 'end' }),
  ].join(SEPARATOR);

  const separator = '─'.repeat(header.replace(/\x1B\[[0-9;]*m/g, '').length);

  console.log('\n📊 ' + chalk.bold.underline(title) + ':\n');
  console.log(separator);
  console.log(header);
  console.log(separator);

  const len = tasks.length;
  for (let i = 0; i < len; i += 2) {
    for (let j = 0; j < 2 && i + j < len; j++) {
      const { name, result } = tasks[i + j];
      const first = j === 0;
      const mdf = first ? 'bold' : undefined;
      const line = [
        toValue(name, { clr: 'cyan', mdf, to: 'start' }),
        toValue(result?.throughput?.mean?.toFixed(2) ?? 'n/a', {
          clr: 'green',
          mdf,
          to: 'end',
        }),
        toValue(result?.latency?.mean?.toFixed(4) ?? 'n/a', {
          clr: 'yellow',
          mdf,
          to: 'end',
        }),
        toValue(result?.latency?.sd?.toFixed(4) ?? 'n/a', {
          clr: 'blue',
          mdf,
          to: 'end',
        }),
        toValue(result?.latency?.samples?.length?.toString() ?? 'n/a', {
          clr: 'magenta',
          mdf,
          to: 'end',
        }),
        ,
      ];
      console.log(line.join(SEPARATOR));
      if (j === 1 && i + 2 < len) {
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
