import {Component, inject, Input, OnChanges} from '@angular/core';
import {LocationService} from '../location.service';
import {TabsOptions} from './tabs-options.model';
import {WeatherService} from '../weather.service';
import {RefreshInterval} from '../refresh-interval.model';
import {AppSettings} from '../app-settings';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.css',
})
export class TabsComponent<Type extends TabsOptions> implements OnChanges {
  protected locationService = inject(LocationService);
  protected weatherService = inject(WeatherService);

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
  }

  removeTab(item: Type): void {
    console.log('in removeTab in tabs');
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

}
