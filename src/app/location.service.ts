import {Injectable, Signal, signal} from '@angular/core';
import {ReplaySubject, Subject} from 'rxjs';
import {StorageService} from './storage.service';
import {ConditionsAndZip} from './conditions-and-zip.type';

@Injectable()
export class LocationService {
  private locations: ConditionsAndZip[] = [];
  private currentLocations = signal<ConditionsAndZip[]>([]);
  private locationPrefetch$: Subject<string> = new Subject<string>();
  private locationAddedSubj$: ReplaySubject<string> = new ReplaySubject<string>();
  private locationRemovedSubj$: ReplaySubject<string> = new ReplaySubject<string>();

  constructor() { }

  prefetch(zipcode: string) {
    this.locationPrefetch$.next(zipcode);
  }

  addLocation(data: ConditionsAndZip): void {
    this.locations.push(data);
    this.currentLocations.update(conditions => [...conditions, data])
    this.locationAddedSubj$.next(data.zip);
  }

  update(data: ConditionsAndZip): void {
    let index = this.locations.findIndex((location) => location.zip === data.zip);
    this.locations[index].data = data.data;
    this.locations[index].forecast = data.forecast;
    this.currentLocations.update(conditions => {
      const conditionsCopy = [...conditions];
      for (const i in conditionsCopy) {
        if (conditionsCopy[i].zip === data.zip) {
          conditionsCopy[i].data = data.data;
          conditionsCopy[i].forecast = data.forecast;
        }
      }
      return [...conditionsCopy];
    })
  }

  removeLocation(zipcode: string) {
    let index = this.locations.findIndex((location) => location.zip === zipcode);
    if (index !== -1) {
      this.locations.splice(index, 1);
      this.locationRemovedSubj$.next(zipcode);
      this.currentLocations.update(conditions => {
        const conditionsCopy = [...conditions];
        for (const i in conditionsCopy) {
          if (conditionsCopy[i].zip === zipcode) {
            conditionsCopy.splice(+i, 1);
          }
        }
        return [...conditionsCopy];
      })
      StorageService.setLocations(this.locations.map((item) => item.zip));
      StorageService.recalculateActiveItem(zipcode);
      StorageService.deleteRefreshIntervalForZipcode(zipcode);
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
