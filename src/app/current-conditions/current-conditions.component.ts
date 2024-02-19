import {Component, inject, Input, OnDestroy} from '@angular/core';
import {WeatherService} from '../weather.service';
import {LocationService} from '../location.service';
import {Router} from '@angular/router';
import {ConditionsAndZip} from '../conditions-and-zip.type';
import {RefreshInterval} from '../refresh-interval.model';
import {AppSettings} from '../app-settings';
import {Subscription} from 'rxjs';
import {StorageService} from '../storage.service';

@Component({
  selector: 'app-current-conditions',
  templateUrl: './current-conditions.component.html',
  styleUrls: ['./current-conditions.component.css'],
})
export class CurrentConditionsComponent implements OnDestroy {
  private _items: ConditionsAndZip[];
  protected weatherService = inject(WeatherService);
  private router = inject(Router);
  protected locationService = inject(LocationService);

  private subscriptions = new Subscription();

  @Input() set items(data: ConditionsAndZip[]) {
    if (data) {
      this._items = data;
    }
  }
  get items(): ConditionsAndZip[] {
    return this._items;
  }

  constructor() { }

  showForecast(zipcode: string) {
    this.router.navigate(['/forecast', zipcode])
  }

  public getZipcodeRefreshInterval(zipcode: string): RefreshInterval {
    let cachedValue: RefreshInterval = StorageService.getRefreshIntervalForZipCode(zipcode);
    if (!cachedValue) {
      const intervalPerConfigSelected = StorageService.getRefreshIntervalValue();
      cachedValue = AppSettings.refreshIntervals.find((item) => item.value === intervalPerConfigSelected)
    }
    return cachedValue;
  }

  removeTab(zipcode): void {
    this.locationService.removeLocation(zipcode);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
