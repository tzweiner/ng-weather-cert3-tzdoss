import {ChangeDetectorRef, Component, inject, Input} from '@angular/core';
import {TabsOptions} from '../tabs-options.model';
import {Subscription} from 'rxjs';
import {tap} from 'rxjs/operators';
import {SharedService} from '../shared.service';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.css']
})
export class TabComponent<Type extends TabsOptions> {
  private _item: Type;
  private subscriptions: Subscription = new Subscription();
  protected shared = inject(SharedService);
  // protected weatherService = inject(WeatherService);
  // private currentConditionsByZip: Signal<ConditionsAndZip[]> = this.weatherService.getCurrentConditions();
  // protected currentConditionsByZipObs: Observable<ConditionsAndZip[]> = toObservable(this.currentConditionsByZip);


  @Input() set item(data: Type) {
    if (data) {
      this._item = data;
    }
  }

  constructor(private cd: ChangeDetectorRef) {
    // this.subscriptions.add(
    //     this.currentConditionsByZipObs.pipe(
    //         tap(() => this.cd.markForCheck())
    //     ).subscribe()
    // );

    this.subscriptions.add(
        this.shared.toggleTabTemplate$.pipe(
            tap(() => this.cd.markForCheck())
        ).subscribe()
    );

    this.subscriptions.add(
        this.shared.toggleView$.pipe(
            tap(() => this.cd.markForCheck())
        ).subscribe()
    );
  }

  get item(): Type {
    return this._item;
  }

}
