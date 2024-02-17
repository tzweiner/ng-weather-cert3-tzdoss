import {Injectable, signal} from '@angular/core';
import {AppSettings} from './app-settings';
import {BehaviorSubject, ReplaySubject} from 'rxjs';
import {toObservable} from '@angular/core/rxjs-interop';
import {StorageService} from './storage.service';

export const LOCATIONS = 'locations';

@Injectable()
export class LocationService {

  private locations: string[] = [];
  private locationsSig = signal<string[]>(this.locations);
  private locationAddedSubj$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private locationRemovedSubj$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor() { }

  addLocation(zipcode: string, fromCache?: boolean) {
    if (this.locations?.includes(zipcode)) {
      return;
    }
    this.locationAddedSubj$.next(zipcode);
    this.locations.push(zipcode);
    if (!fromCache) {
      StorageService.setLocations(this.locations);
    }
    StorageService.setRefreshIntervalForZipCode(zipcode);
  }

  removeLocation(zipcode: string) {
    const index = this.locations.indexOf(zipcode);
    if (index !== -1) {
      this.locations.splice(index, 1);
      StorageService.setLocations(this.locations);
      StorageService.deleteRefreshIntervalForZipcode(zipcode);
      this.locationRemovedSubj$.next(zipcode);
    }
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
