import {Component, inject, Input, OnDestroy, Signal} from '@angular/core';
import {WeatherService} from '../weather.service';
import {LocationService} from '../location.service';
import {Router} from '@angular/router';
import {ConditionsAndZip} from '../conditions-and-zip.type';
import {RefreshInterval} from '../refresh-interval.model';
import {AppSettings} from '../app-settings';
import {forkJoin, Observable, Subscription} from 'rxjs';
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
  private locationAdded: Observable<string> = this.locationService.getLocationAddedObs();
  private locationRemoved: Observable<string> = this.locationService.getLocationRemovedObs();
  private locations = this.locationService.locationsSignalObs;

  private subscriptions = new Subscription();

  @Input() set items(data: ConditionsAndZip[]) {
    if (data) {
      this._items = data;
    }
  }
  get items(): ConditionsAndZip[] {
    return this._items;
  }

  constructor() {
    if (this.getDisplayType() !== 'cards') {
      return;
    }
    this.subscriptions.add(
        this.locations.subscribe((data) => {
          console.log('adding locations in cards');
          if (!data?.length) {
            return;
          }
          const calls = [];
          data.forEach((zipcode) => {
            calls.push(this.weatherService.addCurrentConditions(zipcode));
          });
          forkJoin(calls);
        })
    );

    this.subscriptions.add(
        this.locationAdded.subscribe((data) => {
          console.log('adding that one location in cards');
          if (!data) {
            return;
          }
          this.weatherService.addCurrentConditions(data)
        })
    );

    this.subscriptions.add(
        this.locationRemoved.subscribe((data) => {
          if (!data) {
            return;
          }
          this.weatherService.removeCurrentConditions(data);
        })
    );
  }

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

  public getDisplayType(): string {
    return StorageService.getDisplayType();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
