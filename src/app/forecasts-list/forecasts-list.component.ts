import {Component, Signal} from '@angular/core';
import {WeatherService} from '../weather.service';
import {ActivatedRoute} from '@angular/router';
import {Forecast} from './forecast.type';
import {Observable} from 'rxjs';
import {toObservable} from '@angular/core/rxjs-interop';
import {ConditionsAndZip} from '../conditions-and-zip.type';
import {LocationService} from '../location.service';

@Component({
  selector: 'app-forecasts-list',
  templateUrl: './forecasts-list.component.html',
  styleUrls: ['./forecasts-list.component.css']
})
export class ForecastsListComponent {

  zipcode: string;
  forecast: Signal<Forecast>;
    private currentConditionsByZip: Signal<ConditionsAndZip[]> = this.locationService.getCurrentLocations();
    protected currentConditionsByZipObs: Observable<ConditionsAndZip[]> = toObservable(this.currentConditionsByZip);

  constructor(protected weatherService: WeatherService, protected locationService: LocationService, route: ActivatedRoute) {
      this.zipcode = route.snapshot.paramMap.get('zipcode');
  }

}
