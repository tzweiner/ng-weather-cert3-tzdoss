import {RefreshInterval} from './refresh-interval.model';

export class AppSettings {
  public static readonly refreshIntervals: RefreshInterval[] = [
    {
      value: 2000,
      name: '2 seconds',
    },
    {
      value: 5000,
      name: '5 seconds',
    },
    {
      value: 10000,
      name: '10 seconds',
    },
    {
      value: 3600000,
      name: '1 hour',
    },
    {
      value: 7200000,
      name: '2 hours',
    }
  ];
  public static readonly defaultRefreshInterval = this.refreshIntervals[2].value; // 10 secs
  public static weatherRefreshIntervalName = 'weather_refresh_interval';
}
