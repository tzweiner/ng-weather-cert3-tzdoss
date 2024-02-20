import {Component, inject, Input, OnChanges} from '@angular/core';
import {LocationService} from '../location.service';
import {TabsOptions} from '../tabs-options.model';
import {StorageService} from '../storage.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.css',
})
export class TabsComponent<Type extends TabsOptions> implements OnChanges {
  protected locationService = inject(LocationService);
  private _items: TabsOptions[];

  @Input() set items(data: Type[]) {
    if (data) {
      this._items = data;
    }
  }
  get items(): TabsOptions[] {
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
        StorageService.setActiveItem(item.zip);
      } else {
        item.active = false;
      }
      item.template = 'default'
    });
  }

  private initActiveState(): void {
    const preselectedActiveItem = StorageService.getActiveItem();
    if (!preselectedActiveItem) {
      if (this._items?.length) {
        this._items[0].active = true;
      }
    } else {
      this._items?.forEach((item) => {
        if (item.zip === preselectedActiveItem) {
          item.active = true;
        } else {
          item.active = false;
        }
      });
    }
  }

  public getTemplate(): string {
    return StorageService.getTabTemplate();
  }

  ngOnChanges(): void {
    this.initActiveState();
  }
}
