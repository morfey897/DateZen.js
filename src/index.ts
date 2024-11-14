// src/index.ts
import DateZenTest from './core/DateZenTest.class';
import DateZen from './core/DateZen.class';
import DateZenNew from './core/DateZenNew.class';

// const test = (utc: number, klass: any) => {
//   const dZen = new klass(utc);
//   const d = new Date(utc);

//   const ttt = false;
//   const different = [
//     ['yyyy', d.getUTCFullYear(), dZen.getFullYear()],
//     ['mm', d.getUTCMonth(), dZen.getMonth()],
//     ['dd', d.getUTCDate(), dZen.getDate()],
//     ['d', d.getUTCDay(), dZen.getDay()],
//     ['h', d.getUTCHours(), dZen.getHours()],
//     ['m', d.getUTCMinutes(), dZen.getMinutes()],
//     ['s', d.getUTCSeconds(), dZen.getSeconds()],
//     ['mill', d.getUTCMilliseconds(), dZen.getMilliseconds()],
//   ].filter((item) => item[1] != item[2]);

//   if (ttt) {
//     console.warn(utc, d.toUTCString());
//     console.warn(`[Date, ${klass.name}]`, different);
//   } else {
//     // console.log(utc, d.toUTCString());
//   }
// };

// const array = [28172560726173];
// for (let i = 0; i < 1_000_000; i++) {
//   array.push(
//     Math.floor(
//       2209016456906 + Math.random() * (1000 * 365 * 1000 * 24 * 60 * 60)
//     )
//   );
// }

// array.sort((a, b) => a - b);

// // const date3 = new Date().getTime();
// // array.forEach((item) => test(item, DateZenNew));
// // console.log('DateZenNew:', new Date().getTime() - date3);

// // const date = new Date().getTime();
// // array.forEach((item) => test(item, DateZenTest));
// // console.log('<ICON>:', new Date().getTime() - date);

// console.log('-------------------');
// // console.log(
// //   new Intl.DateTimeFormat(['uk', 'en-US'], {
// //     weekday: 'long',
// //     // dayPeriod: 'narrow',
// //     hour12: false,
// //     hour: '2-digit',
// //     minute: '2-digit',
// //     month: 'long',
// //   }).format(new DateZen(28172560726173))
// // );
// const dateZen = new DateZen();
// console.log('toDateString\t', dateZen.toDateString());
// console.log('toISOString\t', dateZen.toISOString());
// console.log('toJSON\t\t', dateZen.toJSON());
// console.log('toLocaleDtString', dateZen.toLocaleDateString('en-US'));
// console.log('toLocaleString\t', dateZen.toLocaleString('en-US'));
// console.log('toLocaleTmString', dateZen.toLocaleTimeString('en-US'));
// console.log('toString\t', dateZen.toString());
// console.log('toTimeString\t', dateZen.toTimeString());
// console.log('toUTCString\t', dateZen.toUTCString());
// console.log(
//   'DateTimeFormat\t',
//   new Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(dateZen)
// );
// console.log('-------------------');

// console.log(
//   'new Intl.DateTimeFormat().resolvedOptions()',
//   new Intl.DateTimeFormat('en-US').resolvedOptions()
// );

export { DateZenTest, DateZen, DateZenNew };
