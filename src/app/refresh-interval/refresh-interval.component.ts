import {Component} from '@angular/core';
import {RefreshInterval} from '../refresh-interval.model';
import {AppSettings} from '../app-settings';
import {FormControl, FormGroup} from '@angular/forms';
import {StorageService} from '../storage.service';

@Component({
  selector: 'app-refresh-interval',
  templateUrl: './refresh-interval.component.html',
  styleUrl: './refresh-interval.component.css'
})
export class RefreshIntervalComponent {
  public intervals: RefreshInterval[] = AppSettings.refreshIntervals;
  public intervalSelectForm = new FormGroup({
    intervalSelect: new FormControl(StorageService.initRefreshInterval()),
    displaySelect: new FormControl(StorageService.getDisplayType() || AppSettings.defaultDisplayType)
  });

  constructor() {
    this.setInterval();
    this.setDisplay();
  }

  private setInterval(): void {
    StorageService.setRefreshInterval(this.intervalSelectForm.controls.intervalSelect.value.value);
  }

  private setDisplay(selection?: string): void {
    let setTo = StorageService.getDisplayType();
    if (!!selection) {
      setTo = selection;
    }
    if (!setTo) {
      setTo = AppSettings.defaultDisplayType;
    }
    StorageService.setDisplayType(setTo);
  }

  public intervalSelected(): void {
    this.setInterval();
  }

  public displaySelected(event): void {
    const target = event.target;
    this.setDisplay(target.value);
  }
}
