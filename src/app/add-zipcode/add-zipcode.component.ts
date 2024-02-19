import {Component} from '@angular/core';
import {LocationService} from '../location.service';
import {WeatherService} from '../weather.service';
import {StorageService} from '../storage.service';

@Component({
  selector: 'app-add-zipcode',
  templateUrl: './add-zipcode.component.html',
})
export class AddZipcodeComponent {
  constructor(private service: LocationService) { }

  addLocation(zipcode: string) {
    if (!zipcode.trim()) {
      return;
    }
    if (StorageService.isZipcodeValid(zipcode.trim())) {

      const list = StorageService.getOrInitLocations();
      if (list.includes(zipcode)) { // already entered
        return;
      }
      StorageService.setRefreshIntervalForZipCode(zipcode);
      StorageService.setActiveItem(zipcode);
      StorageService.addZipcodeToLocations(zipcode);

      this.service.addLocation(zipcode);
    }
  }

}
