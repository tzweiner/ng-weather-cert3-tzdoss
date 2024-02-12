import {RefreshInterval} from './refresh-interval.model';

export class AppSettings {
  public static readonly defaultRefreshInterval = 2000; // 2 secs
  public static readonly refreshIntervals: RefreshInterval[] = [
    {
      value: 2000,
      name: '2 seconds',
    },
    {
      value: 3600000,
      name: '1 hour',
    },
    {
      value: 7200000,
      name: '2 hours',
    }
  ]
}
