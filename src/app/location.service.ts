import { Injectable } from '@angular/core';
import {WeatherService} from './weather.service';
import {AppSettings} from './app-settings';
import {timer} from 'rxjs';

export const LOCATIONS = 'locations';

@Injectable()
export class LocationService {

  locations: string[] = [];

  constructor(private weatherService: WeatherService) {
    const locString = localStorage.getItem(LOCATIONS);
    if (locString) {
      this.locations = JSON.parse(locString);
    }
    for (const loc of this.locations) {
      if (!loc) { // empty string
        continue;
      }
      this.weatherService.addCurrentConditions(loc);
      timer(this.getTimeoutValue(), this.getTimeoutValue()).subscribe(() => {
        this.weatherService.updateCurrentConditions(loc);
      });
    }
  }

  addLocation(zipcode: string) {
    if (!zipcode) {   // empty string
      return;
    }
    this.locations.push(zipcode);
    localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
    this.weatherService.addCurrentConditions(zipcode);
    timer(this.getTimeoutValue(), this.getTimeoutValue()).subscribe(() => {
      this.weatherService.updateCurrentConditions(zipcode);
    });
  }

  removeLocation(zipcode: string) {
    const index = this.locations.indexOf(zipcode);
    if (index !== -1) {
      this.locations.splice(index, 1);
      localStorage.setItem(LOCATIONS, JSON.stringify(this.locations.filter(loc => loc !== '')));
      this.weatherService.removeCurrentConditions(zipcode);
    }
  }

  private getTimeoutValue(): number {
    return JSON.parse(localStorage.getItem(AppSettings.weatherRefreshIntervalName));
  }
}
