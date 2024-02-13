import {Component, inject, Signal} from '@angular/core';
import {WeatherService} from '../weather.service';
import {LocationService} from '../location.service';
import {Router} from '@angular/router';
import {ConditionsAndZip} from '../conditions-and-zip.type';
import {RefreshInterval} from '../refresh-interval.model';
import {AppSettings} from '../app-settings';

@Component({
  selector: 'app-current-conditions',
  templateUrl: './current-conditions.component.html',
  styleUrls: ['./current-conditions.component.css']
})
export class CurrentConditionsComponent {
  protected weatherService = inject(WeatherService);
  private router = inject(Router);
  protected locationService = inject(LocationService);
  protected currentConditionsByZip: Signal<ConditionsAndZip[]> = this.weatherService.getCurrentConditions();

  showForecast(zipcode: string) {
    this.router.navigate(['/forecast', zipcode])
  }

  public getDisplayType(): string {
    return JSON.parse(localStorage.getItem(AppSettings.weatherDisplayTypeName))
  }

  // private getCurrentInterval(): RefreshInterval {
  //   const intervalInEpochMillis = JSON.parse(localStorage.getItem(AppSettings.weatherRefreshIntervalName));
  //   return AppSettings.refreshIntervals.find((interval) => interval.value === intervalInEpochMillis)
  // }
  //
  // private getTimeoutValue(): number {
  //   return JSON.parse(localStorage.getItem(AppSettings.weatherRefreshIntervalName));
  // }
}
