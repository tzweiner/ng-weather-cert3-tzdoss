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
    const list = StorageService.getLocations()
        ? JSON.parse(StorageService.getLocations())
        : StorageService.setLocations([]);
    if (list.includes(zipcode)) {
      return;
    }
    if (!fromCache) {
      StorageService.addZipcodeToLocations(zipcode);
    }
    StorageService.setRefreshIntervalForZipCode(zipcode);
    StorageService.setActiveItem(zipcode);
    this.locationAddedSubj$.next(zipcode);
  }

  removeLocation(zipcode: string) {
    const list = StorageService.getLocations()
        ? JSON.parse(StorageService.getLocations())
        : StorageService.setLocations([]);
    if (!list.includes(zipcode)) {
      return;
    }
    const index = list.indexOf(zipcode);
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
