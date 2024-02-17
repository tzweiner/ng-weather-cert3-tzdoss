import {Component, inject, Signal} from '@angular/core';
import {AppSettings} from '../app-settings';
import {WeatherService} from '../weather.service';
import {ConditionsAndZip} from '../conditions-and-zip.type';
import {forkJoin, Observable} from 'rxjs';
import {LocationService} from '../location.service';
import {StorageService} from '../storage.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html'
})
export class MainPageComponent {
  protected weatherService = inject(WeatherService);
  protected currentConditionsByZip: Signal<ConditionsAndZip[]> = this.weatherService.getCurrentConditions();

  constructor() {
    console.log('constructor in MainPageComponent');
  }

  public getDisplayType(): string {
    return StorageService.getDisplayType();
  }
}
