import {Injectable, Signal, signal} from '@angular/core';
import {ReplaySubject, Subject} from 'rxjs';
import {StorageService} from './storage.service';
import {ConditionsAndZip} from './conditions-and-zip.type';

@Injectable()
export class LocationService {
  private locations: ConditionsAndZip[] = [];
  private currentLocations = signal<ConditionsAndZip[]>(this.locations);
  private locationPrefetch$: Subject<string> = new Subject<string>();
  private locationAddedSubj$: ReplaySubject<string> = new ReplaySubject<string>();
  private locationRemovedSubj$: ReplaySubject<string> = new ReplaySubject<string>();

  constructor() { }

  prefetch(zipcode: string) {
    this.locationPrefetch$.next(zipcode);
  }

  addLocation(data: ConditionsAndZip): void {
    this.locations.push(data);
    this.locationAddedSubj$.next(data.zip);
  }

  // addLocation(zipcode: string, fromCache?: boolean) {
  //   if (fromCache) {
  //     StorageService.setRefreshIntervalForZipCode(zipcode);
  //     StorageService.setActiveItem(zipcode);
  //   }
  //   this.locationAddedSubj$.next(zipcode);
  // }

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

  getLocationPrefetchObs () {
    return this.locationPrefetch$;
  }

  getCurrentLocations(): Signal<ConditionsAndZip[]> {
    return this.currentLocations.asReadonly();
  }
}
