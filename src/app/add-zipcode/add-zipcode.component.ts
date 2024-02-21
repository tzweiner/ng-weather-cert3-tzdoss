import {Component} from '@angular/core';
import {LocationService} from '../location.service';
import {StorageService} from '../storage.service';

@Component({
  selector: 'app-add-zipcode',
  templateUrl: './add-zipcode.component.html',
})
export class AddZipcodeComponent {
  public message = '';
  constructor(private service: LocationService) { }

  addLocation(zipcode: string) {
    if (!zipcode.trim()) {
      return;
    }
    if (StorageService.isZipcodeValid(zipcode.trim())) {

      const list = StorageService.getOrInitLocations();
      if (list.includes(zipcode)) { // already entered
        this.message = `"${zipcode}" is already entered.`;
        setTimeout(() => this.message = '', 2000);
        return;
      }
      StorageService.setRefreshIntervalForZipCode(zipcode);
      StorageService.setActiveItem(zipcode);
      StorageService.addZipcodeToLocations(zipcode);

      this.service.prefetch(zipcode);

    } else {
      this.message = `"${zipcode}" is invalid.`;
      setTimeout(() => this.message = '', 2000);
    }
  }

}
