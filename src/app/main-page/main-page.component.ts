import {ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, Signal} from '@angular/core';
import {WeatherService} from '../weather.service';
import {ConditionsAndZip} from '../conditions-and-zip.type';
import {Observable, Subscription} from 'rxjs';
import {StorageService} from '../storage.service';
import {toObservable} from '@angular/core/rxjs-interop';
import {debounceTime, tap} from 'rxjs/operators';
import {SharedService} from '../shared.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainPageComponent implements OnDestroy {
  protected weatherService = inject(WeatherService);
  protected shared = inject(SharedService);
  private currentConditionsByZip: Signal<ConditionsAndZip[]> = this.weatherService.getCurrentConditions();
  protected currentConditionsByZipObs: Observable<ConditionsAndZip[]> = toObservable(this.currentConditionsByZip);
  private subscriptions: Subscription = new Subscription();

  constructor(private cd: ChangeDetectorRef) {
    this.subscriptions.add(
        this.currentConditionsByZipObs.pipe(
            tap(() => this.cd.markForCheck())
        ).subscribe()
    );

    this.subscriptions.add(
        this.shared.toggleView$.pipe(
            tap(() => this.cd.markForCheck())
        ).subscribe()
    );

    this.subscriptions.add(
        this.shared.toggleTabTemplate$.pipe(
            tap(() => this.cd.markForCheck())
        ).subscribe()
    );
  }

  public getDisplayType(): string {
    return StorageService.getDisplayType();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
