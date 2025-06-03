import chalk from 'chalk';
import { TaskResult } from 'tinybench';

const MAX_COLUMN_WIDTH = 25;

const SEPARATOR = '│ ';

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
  const toValue = (str: string, color: Color, modifier?: Modifier) => {
    const result =
      str.length > MAX_COLUMN_WIDTH
        ? str.slice(0, MAX_COLUMN_WIDTH)
        : str.padEnd(MAX_COLUMN_WIDTH, ' ');
    const inst = chalk[color];
    if (!inst) return result;
    return modifier ? inst[modifier](result) : inst(result);
  };

  const header = [
    toValue('Name', 'white', 'bold'),
    toValue('Throughput (ops/sec)', 'white', 'bold'),
    toValue('Latency Avg (ms)', 'white', 'bold'),
    toValue('Std Deviation (ms)', 'white', 'bold'),
    toValue('Samples', 'white', 'bold'),
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
      const modifier = first ? 'bold' : undefined;
      const line = [
        toValue(name, 'cyan', modifier),
        toValue(result?.throughput.mean.toFixed(2) ?? 'n/a', 'green', modifier),
        toValue(result?.latency.mean.toFixed(4) ?? 'n/a', 'yellow', modifier),
        toValue(result?.latency.sd.toFixed(4) ?? 'n/a', 'blue', modifier),
        toValue(
          result?.latency.samples.length.toString() ?? 'n/a',
          'magenta',
          modifier
        ),
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
