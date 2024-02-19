import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {StorageService} from './storage.service';

@Injectable()
export class LocationService {
  private locationAddedSubj$: ReplaySubject<string> = new ReplaySubject<string>();
  private locationRemovedSubj$: ReplaySubject<string> = new ReplaySubject<string>();

  constructor() { }

  addLocation(zipcode: string, fromCache?: boolean) {
    if (fromCache) {
      StorageService.setRefreshIntervalForZipCode(zipcode);
      StorageService.setActiveItem(zipcode);
    }
    this.locationAddedSubj$.next(zipcode);
  }

  removeLocation(zipcode: string) {
    let list = StorageService.getOrInitLocations();
    let index = list.indexOf(zipcode);
    if (index !== -1) {
      list.splice(index, 1);
      StorageService.setLocations(list);
      StorageService.recalculateActiveItem(zipcode);
      StorageService.deleteRefreshIntervalForZipcode(zipcode);
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
