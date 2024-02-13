import { Component } from '@angular/core';
import {LocationService} from '../location.service';
import {timer} from 'rxjs';
import {AppSettings} from '../app-settings';
import {WeatherService} from '../weather.service';

@Component({
  selector: 'app-zipcode-entry',
  templateUrl: './zipcode-entry.component.html'
})
export class ZipcodeEntryComponent {
  constructor(private service: LocationService, private weatherService: WeatherService) { }

  addLocation(zipcode: string) {
    this.service.addLocation(zipcode);
  }

  private getTimeoutValue(): number {
    return JSON.parse(localStorage.getItem(AppSettings.weatherRefreshIntervalName));
  }
}
