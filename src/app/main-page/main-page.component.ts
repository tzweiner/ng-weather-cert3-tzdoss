import {ChangeDetectionStrategy, Component, inject, Signal} from '@angular/core';
import {WeatherService} from '../weather.service';
import {ConditionsAndZip} from '../conditions-and-zip.type';
import {Observable} from 'rxjs';
import {StorageService} from '../storage.service';
import {toObservable} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainPageComponent {
  protected weatherService = inject(WeatherService);
  private currentConditionsByZip: Signal<ConditionsAndZip[]> = this.weatherService.getCurrentConditions();
  protected currentConditionsByZipObs: Observable<ConditionsAndZip[]> = toObservable(this.currentConditionsByZip);

  constructor() { }

  public getDisplayType(): string {
    return StorageService.getDisplayType();
  }
}
