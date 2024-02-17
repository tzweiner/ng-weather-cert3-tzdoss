import {Injectable, signal} from '@angular/core';
import {AppSettings} from './app-settings';
import {BehaviorSubject, ReplaySubject} from 'rxjs';
import {toObservable} from '@angular/core/rxjs-interop';

export const LOCATIONS = 'locations';

@Injectable()
export class LocationService {

  private locations: string[] = [];
  private locationsSig = signal<string[]>(this.locations);
  private locationAddedSubj$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private locationRemovedSubj$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor() { }

  addLocation(zipcode: string, fromCache?: boolean) {
    console.log('adding in locationService')
    this.locations.push(zipcode);
    if (!fromCache) {
      localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
    }
    localStorage.setItem(`_${zipcode}_refreshInterval`,
        JSON.stringify(AppSettings.refreshIntervals.find((item) => item.value === this.getRefreshInterval())) );
    this.locationAddedSubj$.next(zipcode);
  }

  removeLocation(zipcode: string) {
    const index = this.locations.indexOf(zipcode);
    if (index !== -1) {
      this.locations.splice(index, 1);
      localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
      localStorage.removeItem(`_${zipcode}_refreshInterval`);
      this.locationRemovedSubj$.next(zipcode);
    }
  }

  private getRefreshInterval(): number {
    return JSON.parse(localStorage.getItem(AppSettings.weatherRefreshIntervalName));
  }

  get locationsSignalObs () {
    return toObservable(this.locationsSig.asReadonly());
  }

  getLocationAddedObs () {
    return this.locationAddedSubj$;
  }

  getLocationRemovedObs () {
    return this.locationRemovedSubj$;
  }
}
