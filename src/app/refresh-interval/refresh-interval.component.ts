import {Component, OnInit, signal} from '@angular/core';
import {RefreshInterval} from '../refresh-interval.model';
import {AppSettings} from '../app-settings';
import {FormControl, FormGroup} from '@angular/forms';
import * as moment from 'moment';
import {WeatherService} from '../weather.service';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-refresh-interval',
  templateUrl: './refresh-interval.component.html',
  styleUrl: './refresh-interval.component.scss'
})
export class RefreshIntervalComponent {
  public intervals: RefreshInterval[] = AppSettings.refreshIntervals;
  public intervalSelectForm = new FormGroup({
    intervalSelect: new FormControl(this.intervals.find((i) => i.value === AppSettings.defaultRefreshInterval)),
  });
  public cacheExpires = signal<number>(this.calculateCacheExpiration());

  constructor() {
    this.setInterval();
  }

  private setInterval(): void {
    localStorage.setItem(
        AppSettings.cacheTimeoutName,
        JSON.stringify(this.intervalSelectForm.controls.intervalSelect.value.value
      )
    );
  }

  private calculateCacheExpiration(): number {
    return moment().add(this.intervalSelectForm.controls.intervalSelect.value.value, 'milliseconds').valueOf()
  }
  public intervalSelected(): void {
    console.log('interval selected ', JSON.stringify(this.intervalSelectForm.controls.intervalSelect.value.name));
    this.setInterval();
    this.cacheExpires = signal<number>(this.calculateCacheExpiration());
  }
}
