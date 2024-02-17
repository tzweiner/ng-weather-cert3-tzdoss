import {Component, Signal} from '@angular/core';
import {WeatherService} from '../weather.service';
import {ActivatedRoute} from '@angular/router';
import {Forecast} from './forecast.type';
import {Observable, timer} from 'rxjs';
import {AppSettings} from '../app-settings';
import {switchMap} from 'rxjs/operators';
import {RefreshInterval} from '../refresh-interval.model';
import {toSignal} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-forecasts-list',
  templateUrl: './forecasts-list.component.html',
  styleUrls: ['./forecasts-list.component.css']
})
export class ForecastsListComponent {

  zipcode: string;
  forecast: Signal<Forecast>;

  constructor(protected weatherService: WeatherService, route: ActivatedRoute) {
      this.zipcode = route.snapshot.paramMap.get('zipcode');
      // this.forecast = timer(0, StorageService.getRefreshIntervalValueForZipCode(this.zipcode)).pipe(
      //     switchMap(() => weatherService.getForecast(this.zipcode))
      // );
      this.forecast = toSignal(weatherService.getForecast(this.zipcode));
  }

}
