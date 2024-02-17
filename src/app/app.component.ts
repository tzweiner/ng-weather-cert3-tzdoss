import { Component } from '@angular/core';
import {LOCATIONS, LocationService} from './location.service';
import {AppSettings} from './app-settings';
import {forkJoin, Observable, timer} from 'rxjs';
import {WeatherService} from './weather.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

    constructor(private locationService: LocationService) {
        const refreshInterval = this.getRefreshInterval();
        const locString = localStorage.getItem(LOCATIONS);
        let locations = [];
        if (locString) {
            locations = JSON.parse(locString);
        }
        for (const zipcode of locations) {
            localStorage.setItem(`_${zipcode}_refreshInterval`,
                JSON.stringify(AppSettings.refreshIntervals.find((item) => item.value === refreshInterval)) );
            console.log('about to add a location in appcomponent');
            this.locationService.addLocation(zipcode, true);
        }
    }

    private getRefreshInterval(): number {
        return JSON.parse(localStorage.getItem(AppSettings.weatherRefreshIntervalName));
    }
}
