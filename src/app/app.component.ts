import {Component, OnDestroy} from '@angular/core';
import {LocationService} from './location.service';
import { Observable, Subscription, timer} from 'rxjs';
import {WeatherService} from './weather.service';
import {StorageService} from './storage.service';
import {mergeMap, tap} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
    private locationAdded: Observable<string> = this.locationService.getLocationAddedObs();
    private locationRemoved: Observable<string> = this.locationService.getLocationRemovedObs();
    private subscriptions: Subscription = new Subscription();

    constructor(private locationService: LocationService, private weatherService: WeatherService) {
        const locString = StorageService.getLocations();
        if (!locString) {
            StorageService.setLocations([]);
        }
        let locations = [];
        if (locString) {
            locations = JSON.parse(locString);
        }
        for (const zipcode of locations) {
            StorageService.initRefreshIntervalForZipcode(zipcode);
            console.log('about to add a location in appComponent');
            this.locationService.addLocation(zipcode, true);
        }

        this.subscriptions.add(
            this.locationAdded.pipe(
                tap((data) => console.log('locationAdded', data)),
                mergeMap((zipcode) =>
                    timer(0, StorageService.getRefreshIntervalValueForZipCode(zipcode)).pipe(
                        // takeUntil(this.locationRemoved),
                        mergeMap(() => this.weatherService.addCurrentConditionsHttp(zipcode).pipe(
                            tap(data => this.weatherService.addCurrentConditions(zipcode, data))
                        )))
                    )
            ).subscribe()
        );

        this.subscriptions.add(
          this.locationRemoved.subscribe((data) => {
            this.weatherService.removeCurrentConditions(data);
          })
        );
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }
}
