import { Injectable } from '@angular/core';
import {AppSettings} from './app-settings';
import {BehaviorSubject, Observable, Subject, timer} from 'rxjs';
import {WeatherService} from './weather.service';
import {takeUntil} from 'rxjs/operators';

export const LOCATIONS = 'locations';

@Injectable()
export class LocationService {

  locations: string[] = [];
  private removedSubject$: Subject<string> = new Subject<string>();

  constructor(private weatherService: WeatherService) {
    const locString = localStorage.getItem(LOCATIONS);
    if (locString) {
      this.locations = JSON.parse(locString);
    }
    for (const zipcode of this.locations) {
      localStorage.setItem(`_${zipcode}_refreshInterval`,
          JSON.stringify(AppSettings.refreshIntervals.find((item) => item.value === this.getRefreshInterval())) );
      this.weatherService.addCurrentConditions(zipcode)
      timer(this.getRefreshInterval(), this.getRefreshInterval())
          // .pipe(takeUntil(this.removedSubject$))
          .subscribe(() => this.weatherService.addCurrentConditions(zipcode));
    }
  }

  addLocation(zipcode: string) {
    this.locations.push(zipcode);
    localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
    localStorage.setItem(`_${zipcode}_refreshInterval`,
        JSON.stringify(AppSettings.refreshIntervals.find((item) => item.value === this.getRefreshInterval())) );
    this.removedSubject$ = new Subject<string>();
    timer(0, this.getRefreshInterval())
        // .pipe(takeUntil(this.removedSubject$))
        .subscribe(() => this.weatherService.addCurrentConditions(zipcode));
  }

  removeLocation(zipcode: string) {
    const index = this.locations.indexOf(zipcode);
    if (index !== -1) {
      this.locations.splice(index, 1);
      localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
      localStorage.removeItem(`_${zipcode}_refreshInterval`);
      this.weatherService.removeCurrentConditions(zipcode);
      this.removedSubject$.next(zipcode);
      // this.removedSubject$.complete();
    }
  }

  private getRefreshInterval(): number {
    return JSON.parse(localStorage.getItem(AppSettings.weatherRefreshIntervalName));
  }
}
