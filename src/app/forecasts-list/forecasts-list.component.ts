import {Component, OnDestroy} from '@angular/core';
import {WeatherService} from '../weather.service';
import {ActivatedRoute} from '@angular/router';
import {Forecast} from './forecast.type';
import {Observable, Subscription, timer} from 'rxjs';
import {AppSettings} from '../app-settings';
import {tap} from 'blue-harvest';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
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
      this.forecast = timer(0, this.getTimeoutValue()).pipe(
          switchMap(() => weatherService.getForecast(this.zipcode))
      );
  }

  private getTimeoutValue(): number {
    return JSON.parse(localStorage.getItem(AppSettings.cacheTimeoutName));
  }
}
