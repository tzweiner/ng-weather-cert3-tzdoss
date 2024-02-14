import {Component} from '@angular/core';
import {WeatherService} from '../weather.service';
import {ActivatedRoute} from '@angular/router';
import {Forecast} from './forecast.type';
import {Observable, timer} from 'rxjs';
import {AppSettings} from '../app-settings';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-forecasts-list',
  templateUrl: './forecasts-list.component.html',
  styleUrls: ['./forecasts-list.component.css']
})
export class ForecastsListComponent {

  zipcode: string;
  forecast: Observable<Forecast>;

  constructor(protected weatherService: WeatherService, route: ActivatedRoute) {
      this.zipcode = route.snapshot.paramMap.get('zipcode');
      this.forecast = timer(0, this.getRefreshIntervalValue()).pipe(
          switchMap(() => weatherService.getForecast(this.zipcode))
      );
  }

  private getRefreshIntervalValue(): number {
    return JSON.parse(localStorage.getItem(AppSettings.weatherRefreshIntervalName));
  }
}
