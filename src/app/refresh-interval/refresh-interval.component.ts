import {Component, inject} from '@angular/core';
import {RefreshInterval} from '../refresh-interval.model';
import {AppSettings} from '../app-settings';
import {FormControl, FormGroup} from '@angular/forms';
import {StorageService} from '../storage.service';
import {SharedService} from '../shared.service';

@Component({
  selector: 'app-refresh-interval',
  templateUrl: './refresh-interval.component.html',
  styleUrl: './refresh-interval.component.css'
})
export class RefreshIntervalComponent {
  private shared = inject(SharedService);
  public intervals: RefreshInterval[] = AppSettings.refreshIntervals;
  public intervalSelectForm = new FormGroup({
    intervalSelect: new FormControl(StorageService.initRefreshInterval()),
    displaySelect: new FormControl(StorageService.getDisplayType() || AppSettings.defaultDisplayType),
    tabTemplateSelect: new FormControl(StorageService.getTabTemplate() || AppSettings.defaultTabTemplate)
  });

  constructor() {
    this.setInterval();
    this.setDisplay();
    this.setTabTemplate();
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
    if (setTo === 'cards') {
      this.intervalSelectForm.get('tabTemplateSelect').disable();
    } else {
      this.intervalSelectForm.get('tabTemplateSelect').enable();
    }
    this.shared.toggleView$.next(setTo);
  }

  private setTabTemplate(selection?: string): void {
    let setTo = StorageService.getTabTemplate();
    if (!!selection) {
      setTo = selection;
    }
    if (!setTo) {
      setTo = AppSettings.defaultTabTemplate;
    }
    StorageService.setTabTemplateType(setTo);
    this.shared.toggleView$.next(setTo);
  }

  public intervalSelected(): void {
    this.setInterval();
  }

  public displaySelected(event): void {
    const target = event.target;
    this.setDisplay(target.value);
    if (target.value === 'cards') {
      this.intervalSelectForm.get('tabTemplateSelect').disable();
    }
  }

  public tabTemplateSelected(event): void {
    const target = event.target;
    this.setTabTemplate(target.value);
  }

  public getDisplay(): string {
    return StorageService.getDisplayType();
  }
}
