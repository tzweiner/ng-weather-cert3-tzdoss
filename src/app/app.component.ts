import { Component } from '@angular/core';
import {LOCATIONS, LocationService} from './location.service';
import {AppSettings} from './app-settings';
import {forkJoin, Observable, timer} from 'rxjs';
import {WeatherService} from './weather.service';
import {StorageService} from './storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

    constructor(private locationService: LocationService) {
        const locString = StorageService.getLocations();
        let locations = [];
        if (locString) {
            locations = JSON.parse(locString);
        }
        for (const zipcode of locations) {
            StorageService.initRefreshIntervalForZipcode(zipcode);
            console.log('about to add a location in appComponent');
            this.locationService.addLocation(zipcode, true);
        }
    }
}
