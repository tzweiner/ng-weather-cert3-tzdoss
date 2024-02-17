import {Component, Signal} from '@angular/core';
import {WeatherService} from '../weather.service';
import {ActivatedRoute} from '@angular/router';
import {Forecast} from './forecast.type';
import {Observable, timer} from 'rxjs';
import {AppSettings} from '../app-settings';
import {map, switchMap} from 'rxjs/operators';
import {RefreshInterval} from '../refresh-interval.model';
import {toObservable, toSignal} from '@angular/core/rxjs-interop';
import {ConditionsAndZip} from '../conditions-and-zip.type';

@Component({
  selector: 'app-forecasts-list',
  templateUrl: './forecasts-list.component.html',
  styleUrls: ['./forecasts-list.component.css']
})
export class ForecastsListComponent {

  zipcode: string;
  forecast: Signal<Forecast>;
    private currentConditionsByZip: Signal<ConditionsAndZip[]> = this.weatherService.getCurrentConditions();
    protected currentConditionsByZipObs: Observable<ConditionsAndZip[]> = toObservable(this.currentConditionsByZip);

  constructor(protected weatherService: WeatherService, route: ActivatedRoute) {
      this.zipcode = route.snapshot.paramMap.get('zipcode');
      this.currentConditionsByZipObs = toObservable(this.currentConditionsByZip).pipe(
          map((conditions: ConditionsAndZip[]) => {
              conditions.filter((cond) => cond.zip === this.zipcode);
              return conditions;
          })
      );
  }

}
