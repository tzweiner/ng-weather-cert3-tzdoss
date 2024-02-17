import {Component} from '@angular/core';
import {LocationService} from '../location.service';
import {WeatherService} from '../weather.service';

@Component({
  selector: 'app-add-zipcode',
  templateUrl: './add-zipcode.component.html',
})
export class AddZipcodeComponent {
  constructor(private service: LocationService, private weatherService: WeatherService) { }

  addLocation(zipcode: string) {
    if (!zipcode.trim()) {
      return;
    }
    this.service.addLocation(zipcode);
  }

}
