import {Component, inject, Input, OnChanges} from '@angular/core';
import {LocationService} from '../location.service';
import {TabsOptions} from './tabs-options.model';
import {WeatherService} from '../weather.service';
import {RefreshInterval} from '../refresh-interval.model';
import {AppSettings} from '../app-settings';
import {Router} from '@angular/router';
import {forkJoin, Observable, timer} from 'rxjs';
import {map, mergeMap, switchMap, takeUntil} from 'rxjs/operators';
import {toObservable} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.css',
})
export class TabsComponent<Type extends TabsOptions> implements OnChanges {
  protected locationService = inject(LocationService);
  protected weatherService = inject(WeatherService);
  private router = inject(Router);
  private locationAdded: Observable<string> = this.locationService.getLocationAddedObs();
  private locationRemoved: Observable<string> = this.locationService.getLocationRemovedObs();
  private locations = this.locationService.locationsSignalObs;

  private _items: Type[];
  @Input() set items(data: Type[]) {
    if (data) {
      this._items = data;
    }
  }
  get items(): Type[] {
    return this._items;
  }

  constructor() {
    this.initActiveState();

    this.locations.subscribe((data) => {
      if (!data?.length) {
        return;
      }
      const calls = [];
      data.forEach((zipcode) => {
        calls.push(this.weatherService.addCurrentConditions(zipcode));
      });
      forkJoin(calls);
    });

    this.locationAdded.subscribe((data) => {
      if (!data) {
        return;
      }
      this.weatherService.addCurrentConditions(data)
    });

    this.locationRemoved.subscribe((data) => {
      if (!data) {
        return;
      }
      this.weatherService.removeCurrentConditions(data);
    });
  }

  removeTab(item: Type): void {
    this.locationService.removeLocation(item.zip);
    this.initActiveState();
  }

  activateTab(itemIn: Type): void {
    this._items.forEach((item) => {
      if (item.zip === itemIn.zip) {
        item.active = true;
      } else {
        item.active = false;
      }
    });
  }

  private initActiveState(): void {
    if (this._items?.length === 1) {
      this._items[0].active = true;
      return;
    }

    this._items?.forEach((item) => {
      item.active = false;
    });
    if (this._items?.length) {
      this._items[0].active = true;
    }
  }

  ngOnChanges(): void {
    this.initActiveState();
  }

  public getZipcodeRefreshInterval(zipcode: string): RefreshInterval {
    let cachedValue: RefreshInterval = JSON.parse(localStorage.getItem(`_${zipcode}_refreshInterval`));
    if (!cachedValue) {
      const intervalPerConfigSelected = JSON.parse(localStorage.getItem(AppSettings.weatherRefreshIntervalName));
      cachedValue = AppSettings.refreshIntervals.find((item) => item.value === intervalPerConfigSelected)
    }
    return cachedValue;
  }

  showForecast(zipcode: string) {
    this.router.navigate(['/forecast', zipcode])
  }

  private getRefreshInterval(): RefreshInterval {
    const storedInterval = JSON.parse(localStorage.getItem(AppSettings.weatherRefreshIntervalName));
    return AppSettings.refreshIntervals.find((i) => i.value === storedInterval)
  }

}
