import {Injectable, signal} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {toObservable} from '@angular/core/rxjs-interop';
import {StorageService} from './storage.service';

@Injectable()
export class LocationService {

  private locations: string[] = [];
  private locationsSig = signal<string[]>(this.locations);
  private locationAddedSubj$: ReplaySubject<string> = new ReplaySubject<string>();
  private locationRemovedSubj$: ReplaySubject<string> = new ReplaySubject<string>();

  constructor() { }

  addLocation(zipcode: string, fromCache?: boolean) {
    if (this.locations?.includes(zipcode)) {
      return;
    }
    this.locations.push(zipcode);
    if (!fromCache) {
      StorageService.setLocations(this.locations);
    }
    StorageService.setRefreshIntervalForZipCode(zipcode);
    this.locationAddedSubj$.next(zipcode);
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
