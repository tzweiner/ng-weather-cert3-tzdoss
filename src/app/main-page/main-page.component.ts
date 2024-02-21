import {ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, Signal} from '@angular/core';
import {ConditionsAndZip} from '../conditions-and-zip.type';
import {Observable, Subscription} from 'rxjs';
import {StorageService} from '../storage.service';
import {toObservable} from '@angular/core/rxjs-interop';
import {tap} from 'rxjs/operators';
import {SharedService} from '../shared.service';
import {LocationService} from '../location.service';
import {TabsComponent} from '../tabs/tabs.component';
import {HelloWorldComponent} from '../hello-world/hello-world.component';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainPageComponent implements OnDestroy {
  Tabs = TabsComponent;
  Hello = HelloWorldComponent;    // for testing
  protected locationService = inject(LocationService);
  protected shared = inject(SharedService);
  private currentConditionsByZip: Signal<ConditionsAndZip[]> = this.locationService.getCurrentLocations();
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

  public removeTab(zipcode) {
    this.locationService.removeLocation(zipcode);
  }

  public getCurrentConditionsByZip(): Signal<ConditionsAndZip[]> {
    return this.currentConditionsByZip;
  }
}
