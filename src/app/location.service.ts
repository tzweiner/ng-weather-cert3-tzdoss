import { Injectable } from '@angular/core';
import {WeatherService} from './weather.service';
import {AppSettings} from './app-settings';
import {timer} from 'rxjs';
import {Store} from '@ngrx/store';
import {CurrentConditionsAndZipActions} from './store/actions/current-conditions-and-zip.actions';
import {REMOVE_CURRENT_CONDITIONS_AND_ZIP} from './store/reducers/current-conditions-and-zip.reducers ';

export const LOCATIONS = 'locations';

@Injectable()
export class LocationService {

  locations: string[] = [];

  constructor(private weatherService: WeatherService, private store: Store) {
    const locString = localStorage.getItem(LOCATIONS);
    if (locString) {
      this.locations = JSON.parse(locString);
    }
    for (const loc of this.locations) {
      if (!loc) { // empty string
        continue;
      }
      this.store.dispatch(CurrentConditionsAndZipActions.addZip({zipcode: loc}));
      console.log('this.getRefreshInterval()', this.getRefreshInterval());
      // this.weatherService.addCurrentConditions(loc);
      timer(this.getRefreshInterval(), this.getRefreshInterval()).subscribe(() => {
        // this.weatherService.updateCurrentConditions(loc);
        this.store.dispatch(CurrentConditionsAndZipActions.updateZip({zipcode: loc}))
      });
    }
  }

  addLocation(zipcode: string) {
    if (!zipcode) {   // empty string
      return;
    }
    const index = this.locations.indexOf(zipcode);
    if (index !== -1) {   // already exists
      return;
    }
    this.locations.push(zipcode);
    localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
    // this.weatherService.addCurrentConditions(zipcode);
    this.store.dispatch(CurrentConditionsAndZipActions.addZip({zipcode: zipcode}));
    timer(this.getRefreshInterval(), this.getRefreshInterval()).subscribe(() => {
      // this.weatherService.updateCurrentConditions(zipcode);
      this.store.dispatch(CurrentConditionsAndZipActions.updateZip({zipcode: zipcode}))
    });
  }

  removeLocation(zipcode: string) {
    const index = this.locations.indexOf(zipcode);
    if (index !== -1) {
      this.locations.splice(index, 1);
      localStorage.setItem(LOCATIONS, JSON.stringify(this.locations.filter(loc => loc !== '')));
      // this.weatherService.removeCurrentConditions(zipcode);
      // this.store.dispatch({type: REMOVE_CURRENT_CONDITIONS_AND_ZIP, payload: { zipcode }})
      this.store.dispatch(CurrentConditionsAndZipActions.removeZip({zipcode: zipcode}));
    }
  }

  private getRefreshInterval(): number {
    return JSON.parse(localStorage.getItem(AppSettings.weatherRefreshIntervalName));
  }
}
