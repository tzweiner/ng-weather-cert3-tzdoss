import {AfterContentInit, Component, inject, Input, OnChanges, OnInit} from '@angular/core';
import {LocationService} from '../location.service';
import {TabsOptions} from './tabs-options.model';
import {WeatherService} from '../weather.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.css'
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

}
