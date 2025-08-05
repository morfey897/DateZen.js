import { describe, expect } from '@jest/globals';
import format from '@/plugins/format';
import enDictionary from '@/locale/en';
import deDictionary from '@/locale/de';
import dz from '@/index';

describe('format', () => {
  beforeAll(() => {
    format.registerDictionary({ en: enDictionary, de: deDictionary });
    dz.use('format', format);
  });

  it('format date with full year', () => {
    const pattern = 'The time is Y-M-D h:m:s SSS/A';
    const SSS = format(
      {
        year: 2015,
        month: 12,
        day: 31,
        hours: 17,
        minutes: 59,
        seconds: 23,
        milliseconds: 999,
      },
      pattern
    );
    expect(SSS).toEqual('The time is 2015-12-31 5:59:23 999/PM');
  });

  it('format with leading zeros', () => {
    const pattern = 'Y-M-D h:mm:ss SSS/A';
    const SSS = format(
      {
        year: 2015,
        month: 3,
        day: 1,
        hours: 7,
        minutes: 5,
        seconds: 3,
        milliseconds: 5,
      },
      pattern
    );
    expect(SSS).toEqual('2015-3-1 7:05:03 005/AM');
  });

  it('format with 24-hours time', () => {
    const pattern = 'Y-M-D hh:mm:ss SSS';
    const SSS = format(
      {
        year: 2023,
        month: 11,
        day: 5,
        hours: 14,
        minutes: 30,
        seconds: 45,
        milliseconds: 123,
      },
      pattern
    );
    expect(SSS).toEqual('2023-11-5 14:30:45 123');
  });
  it('format with AM/PM', () => {
    const pattern = 'Y-M-D h:mm:ss SSS/A';
    const SSS = format(
      {
        year: 2023,
        month: 1,
        day: 31,
        hours: 11,
        minutes: 59,
        seconds: 59,
        milliseconds: 999,
      },
      pattern
    );
    expect(SSS).toEqual('2023-1-31 11:59:59 999/AM');
  });

  it('format with lowercase am/pm', () => {
    const pattern = 'YYYY-M-D h/a mm ss SSS\\A';
    const SSS = format(
      {
        year: 2024,
        month: 2,
        day: 29,
        hours: 17,
        minutes: 59,
        seconds: 59,
        milliseconds: 999,
      },
      pattern
    );
    expect(SSS).toEqual('2024-2-29 5/pm 59 59 999A');
  });

  it('format through plugin', () => {
    const pattern = 'Y-M-D h:m:s SSS/A';
    const dateZen = dz({
      year: 2020,
      month: 5,
      day: 15,
      hours: 8,
      minutes: 20,
      seconds: 30,
      milliseconds: 56,
    });

    expect(dateZen.format(pattern)).toEqual('2020-5-15 8:20:30 056/AM');
  });

  it('format en with weekday and month variations', () => {
    const date1 = dz({
      year: 1955,
      month: 3,
      day: 8, // Monday
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    });
    expect(
      date1.format('EEE EEEE EEEEE MMM MMMM MMMMM EEEEE MMMMM', {
        locale: 'en',
      })
    ).toEqual('Tue Tuesday T Mar March M T M');

    const date2 = dz({
      year: 2024,
      month: 7,
      day: 7, // Sunday
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    });
    expect(
      date2.format('EEE EEEE EEEEE MMM MMMM MMMMM', { locale: 'en' })
    ).toEqual('Sun Sunday S Jul July J');
  });

  it('format de with weekday and month variations', () => {
    const pattern = 'EEE EEEE EEEEE MMM MMMM MMMMM';

    const date1 = dz({
      year: 1955,
      month: 3,
      day: 7, // Montag
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    });
    expect(date1.format(pattern, { locale: 'de' })).toEqual(
      'Mo Montag M Mär März M'
    );

    const date2 = dz({
      year: 2024,
      month: 7,
      day: 7, // Sonntag
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    });
    expect(date2.format(pattern, { locale: 'de' })).toEqual(
      'So Sonntag S Jul Juli J'
    );
  });

  it('format with inline dictionary object', () => {
    const pattern = 'EEE EEEE EEEEE MMM MMMM MMMMM';
    const dictionary = {
      EEE: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
      EEEE: [
        'Domingo',
        'Lunes',
        'Martes',
        'Miércoles',
        'Jueves',
        'Viernes',
        'Sábado',
      ],
      EEEEE: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
      MMM: [
        'Ene',
        'Feb',
        'Mar',
        'Abr',
        'May',
        'Jun',
        'Jul',
        'Ago',
        'Sep',
        'Oct',
        'Nov',
        'Dic',
      ],
      MMMM: [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre',
      ],
      MMMMM: ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
    };

    const date = dz({
      year: 1955,
      month: 3,
      day: 6, // Sunday
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    });

    expect(date.format(pattern, { dictionary })).toEqual(
      'Do Domingo D Mar Marzo M'
    );
  });
});
