import {Component} from '@angular/core';
import {RefreshInterval} from '../refresh-interval.model';
import {AppSettings} from '../app-settings';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-refresh-interval',
  templateUrl: './refresh-interval.component.html',
  styleUrl: './refresh-interval.component.scss'
})
export class RefreshIntervalComponent {
  public intervals: RefreshInterval[] = AppSettings.refreshIntervals;
  public intervalSelectForm = new FormGroup({
    intervalSelect: new FormControl(this.intervals.find((i) => {
      let searchForValue = AppSettings.defaultRefreshInterval;
      const storedValue = JSON.parse(localStorage.getItem(AppSettings.weatherRefreshIntervalName));
      if (storedValue) {
        searchForValue = storedValue
      }
      return i.value === searchForValue;
    })),
  });

  constructor() {
    this.setInterval();
  }

  private setInterval(): void {
    localStorage.setItem(
        AppSettings.weatherRefreshIntervalName,
        JSON.stringify(this.intervalSelectForm.controls.intervalSelect.value.value
      )
    );
  }

  public intervalSelected(): void {
    this.setInterval();
  }
}
