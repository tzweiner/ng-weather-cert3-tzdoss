import {ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, Signal} from '@angular/core';
import {WeatherService} from '../weather.service';
import {ConditionsAndZip} from '../conditions-and-zip.type';
import {Observable, Subscription} from 'rxjs';
import {StorageService} from '../storage.service';
import {toObservable} from '@angular/core/rxjs-interop';
import {LocationService} from '../location.service';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainPageComponent implements OnDestroy {
  protected weatherService = inject(WeatherService);
  private currentConditionsByZip: Signal<ConditionsAndZip[]> = this.weatherService.getCurrentConditions();
  protected currentConditionsByZipObs: Observable<ConditionsAndZip[]> = toObservable(this.currentConditionsByZip);
  private subscriptions: Subscription = new Subscription();

  constructor(private cd: ChangeDetectorRef) {
    this.subscriptions.add(
        this.currentConditionsByZipObs.pipe(
            tap(() => console.log('heard a change')),
            tap(() => this.cd.markForCheck())
        ).subscribe()
    )
  }

  public getDisplayType(): string {
    return StorageService.getDisplayType();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
