import {Component, inject, Input, Signal} from '@angular/core';
import {WeatherService} from '../weather.service';
import {LocationService} from '../location.service';
import {Router} from '@angular/router';
import {ConditionsAndZip} from '../conditions-and-zip.type';
import {RefreshInterval} from '../refresh-interval.model';
import {AppSettings} from '../app-settings';
import {forkJoin, Observable} from 'rxjs';

@Component({
  selector: 'app-current-conditions',
  templateUrl: './current-conditions.component.html',
  styleUrls: ['./current-conditions.component.css'],
})
export class CurrentConditionsComponent {
  private _items: ConditionsAndZip[];
  protected weatherService = inject(WeatherService);
  private router = inject(Router);
  protected locationService = inject(LocationService);
  private locationAdded: Observable<string> = this.locationService.getLocationAddedObs();
  private locationRemoved: Observable<string> = this.locationService.getLocationRemovedObs();
  private locations = this.locationService.locationsSignalObs;

  @Input() set items(data: ConditionsAndZip[]) {
    if (data) {
      this._items = data;
    }
  }
  get items(): ConditionsAndZip[] {
    return this._items;
  }

  constructor() {
    this.locations.subscribe((data) => {
      if (!data?.length) {
        return;
      }
      const calls = [];
      data.forEach((zipcode) => {
        calls.push(this.weatherService.addCurrentConditions(zipcode));
      });
      forkJoin(calls);
    })

    this.locationAdded.subscribe((data) => {
      if (!data) {
        return;
      }
      this.weatherService.addCurrentConditions(data);
    });

    this.locationRemoved.subscribe((data) => {
      if (!data) {
        return;
      }
      this.weatherService.removeCurrentConditions(data);
    });
  }

  showForecast(zipcode: string) {
    this.router.navigate(['/forecast', zipcode])
  }

  public getZipcodeRefreshInterval(zipcode: string): RefreshInterval {
    let cachedValue: RefreshInterval = JSON.parse(localStorage.getItem(`_${zipcode}_refreshInterval`));
    if (!cachedValue) {
      const intervalPerConfigSelected = JSON.parse(localStorage.getItem(AppSettings.weatherRefreshIntervalName));
      cachedValue = AppSettings.refreshIntervals.find((item) => item.value === intervalPerConfigSelected)
    }
    return cachedValue;
  }
}
