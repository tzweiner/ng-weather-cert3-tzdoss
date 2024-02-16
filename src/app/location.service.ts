import { Injectable } from '@angular/core';
import {AppSettings} from './app-settings';
import {BehaviorSubject, Observable, Subject, timer} from 'rxjs';
import {WeatherService} from './weather.service';
import {takeUntil} from 'rxjs/operators';

export const LOCATIONS = 'locations';

@Injectable()
export class LocationService {

  locations: string[] = [];
  private removedSubject$: Subject<boolean> = new Subject<boolean>();

  // constructor(private store: Store) {
  //   const locString = localStorage.getItem(LOCATIONS);
  //   if (locString) {
  //     this.locations = JSON.parse(locString);
  //   }
  //   for (const loc of this.locations) {
  //     if (!loc) { // empty string
  //       continue;
  //     }
  //     this.store.dispatch(CurrentConditionsAndZipActions.addZip({zipcode: loc}));
  //     timer(this.getRefreshInterval(), this.getRefreshInterval()).subscribe(() => {
  //       this.store.dispatch(CurrentConditionsAndZipActions.updateZip({zipcode: loc}))
  //     });
  //   }
  // }
  //
  // addLocation(zipcode: string) {
  //   if (!zipcode) {   // empty string
  //     return;
  //   }
  //   const index = this.locations.indexOf(zipcode);
  //   if (index !== -1) {   // already exists
  //     return;
  //   }
  //   this.locations.push(zipcode);
  //   localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
  //   this.store.dispatch(CurrentConditionsAndZipActions.addZip({zipcode: zipcode}));
  //   timer(this.getRefreshInterval(), this.getRefreshInterval()).subscribe(() => {
  //     this.store.dispatch(CurrentConditionsAndZipActions.updateZip({zipcode: zipcode}))
  //   });
  // }
  //
  // removeLocation(zipcode: string) {
  //   const index = this.locations.indexOf(zipcode);
  //   if (index !== -1) {
  //     this.locations.splice(index, 1);
  //     localStorage.setItem(LOCATIONS, JSON.stringify(this.locations.filter(loc => loc !== '')));
  //     this.store.dispatch(CurrentConditionsAndZipActions.removeZip({zipcode: zipcode}));
  //   }
  // }

  constructor(private weatherService: WeatherService) {
    const locString = localStorage.getItem(LOCATIONS);
    if (locString) {
      this.locations = JSON.parse(locString);
    }
    for (const zipcode of this.locations) {
      // this.weatherService.addCurrentConditions(zipcode);
      localStorage.setItem(`_${zipcode}_refreshInterval`,
          JSON.stringify(AppSettings.refreshIntervals.find((item) => item.value === this.getRefreshInterval())) );
      this.weatherService.addCurrentConditions(zipcode)
      timer(this.getRefreshInterval(), this.getRefreshInterval())
          .pipe(takeUntil(this.removedSubject$))
          .subscribe(() => this.weatherService.addCurrentConditions(zipcode));
    }
  }

  addLocation(zipcode: string) {
    this.locations.push(zipcode);
    localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
    localStorage.setItem(`_${zipcode}_refreshInterval`,
        JSON.stringify(AppSettings.refreshIntervals.find((item) => item.value === this.getRefreshInterval())) );
    timer(0, this.getRefreshInterval())
        .pipe(takeUntil(this.removedSubject$))
        .subscribe(() => this.weatherService.addCurrentConditions(zipcode));
  }

  removeLocation(zipcode: string) {
    const index = this.locations.indexOf(zipcode);
    if (index !== -1) {
      this.locations.splice(index, 1);
      localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
      localStorage.removeItem(`_${zipcode}_refreshInterval`);
      this.weatherService.removeCurrentConditions(zipcode);
      this.removedSubject$.next(true);
      this.removedSubject$.complete();
    }
  }

  private getRefreshInterval(): number {
    return JSON.parse(localStorage.getItem(AppSettings.weatherRefreshIntervalName));
  }
}
