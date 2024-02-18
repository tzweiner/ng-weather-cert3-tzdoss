import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {StorageService} from './storage.service';

@Injectable()
export class LocationService {

  private locations: string[] = [];
  private locationAddedSubj$: ReplaySubject<string> = new ReplaySubject<string>();
  private locationRemovedSubj$: ReplaySubject<string> = new ReplaySubject<string>();

  constructor() { }

  addLocation(zipcode: string, fromCache?: boolean) {
    if (this.locations?.includes(zipcode)) {
      return;
    }
    this.locations.push(zipcode);
    if (!fromCache) {
      StorageService.addZipcodeToLocations(zipcode);
    }
    StorageService.setRefreshIntervalForZipCode(zipcode);
    StorageService.setActiveItem(zipcode);
    this.locationAddedSubj$.next(zipcode);
  }

  removeLocation(zipcode: string) {
    const index = this.locations.indexOf(zipcode);
    if (index !== -1) {
      this.locations.splice(index, 1);
      StorageService.setLocations(this.locations);
      this.locationRemovedSubj$.next(zipcode);
    }
  }

  getLocationAddedObs () {
    return this.locationAddedSubj$;
  }

  getLocationRemovedObs () {
    return this.locationRemovedSubj$;
  }
}
