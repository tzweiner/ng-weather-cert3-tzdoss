import { Component } from '@angular/core';
import {LocationService} from '../location.service';
import {timer} from 'rxjs';
import {AppSettings} from '../app-settings';
import {WeatherService} from '../weather.service';
import {ConditionsAndZip} from '../conditions-and-zip.type';
import {Store} from '@ngrx/store';
import {AppState} from '../app.state';
import {CurrentConditionsAndZipActions} from '../store/actions/current-conditions-and-zip.actions';

@Component({
  selector: 'app-zipcode-entry',
  templateUrl: './zipcode-entry.component.html'
})
export class ZipcodeEntryComponent {
  constructor(private service: LocationService) { }

  addLocation(zipcode: string) {
    this.service.addLocation(zipcode);
  }
}
