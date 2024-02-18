import {ChangeDetectionStrategy, Component, inject, Input, OnChanges, OnDestroy} from '@angular/core';
import {LocationService} from '../location.service';
import {TabsOptions} from './tabs-options.model';
import {WeatherService} from '../weather.service';
import {RefreshInterval} from '../refresh-interval.model';
import {AppSettings} from '../app-settings';
import {Router} from '@angular/router';
import {forkJoin, Observable, Subscription, timer} from 'rxjs';
import {map, mergeMap, switchMap, takeUntil} from 'rxjs/operators';
import {toObservable} from '@angular/core/rxjs-interop';
import {StorageService} from '../storage.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.css',
})
export class TabsComponent<Type extends TabsOptions> implements OnChanges, OnDestroy {
  protected locationService = inject(LocationService);
  private subscriptions = new Subscription();
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
    if (this.getDisplayType() !== 'tabs') {
      return;
    }

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

  ngOnChanges(): void {
    this.initActiveState();
  }

  public getDisplayType(): string {
    return StorageService.getDisplayType();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
