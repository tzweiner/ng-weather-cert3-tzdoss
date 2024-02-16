import {Component, inject, Signal} from '@angular/core';
import {AppSettings} from '../app-settings';
import {WeatherService} from '../weather.service';
import {ConditionsAndZip} from '../conditions-and-zip.type';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html'
})
export class MainPageComponent {
  protected weatherService = inject(WeatherService);
  protected currentConditionsByZip: Signal<ConditionsAndZip[]> = this.weatherService.getCurrentConditions();

  public getDisplayType(): string {
    return JSON.parse(localStorage.getItem(AppSettings.weatherDisplayTypeName))
  }
}
