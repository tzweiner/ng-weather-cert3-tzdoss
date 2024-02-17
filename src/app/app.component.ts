import {Component, OnDestroy} from '@angular/core';
import {LocationService} from './location.service';
import { Observable, Subscription, timer} from 'rxjs';
import {WeatherService} from './weather.service';
import {StorageService} from './storage.service';
import {map, mergeMap, tap} from 'rxjs/operators';

export interface TimerForZipcode {
    zipcode: string;
    timer: Subscription;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
    private locationAdded: Observable<string> = this.locationService.getLocationAddedObs();
    private locationRemoved: Observable<string> = this.locationService.getLocationRemovedObs();
    private subscriptions: Subscription = new Subscription();
    private timers: TimerForZipcode[] = [];

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
                tap((zipcode) => {
                    const thisTimer = timer(0, StorageService.getRefreshIntervalValueForZipCode(zipcode)).pipe(
                        mergeMap(() => this.weatherService.addCurrentConditionsHttp(zipcode).pipe(
                            tap(data => this.weatherService.addCurrentConditions(zipcode, data))
                        )));
                    this.timers.push({zipcode, timer: thisTimer.subscribe()});
                    return thisTimer;
                }),
                // mergeMap((zipcode) => {
                //         const thisTimer = timer(0, StorageService.getRefreshIntervalValueForZipCode(zipcode)).pipe(
                //             mergeMap(() => this.weatherService.addCurrentConditionsHttp(zipcode).pipe(
                //                 tap(data => this.weatherService.addCurrentConditions(zipcode, data))
                //             )));
                //         this.timers.push({zipcode, timer: thisTimer.subscribe()});
                //         return thisTimer;
                //     })
            ).subscribe((zipcode) => {
                // const thisTimer = timer(0, StorageService.getRefreshIntervalValueForZipCode(zipcode)).pipe(
                //     mergeMap(() => this.weatherService.addCurrentConditionsHttp(zipcode).pipe(
                //         tap(data => this.weatherService.addCurrentConditions(zipcode, data))
                //     )));
                // this.timers.push({zipcode, timer: thisTimer});
                // return thisTimer;
            })
        );

        this.subscriptions.add(
            this.locationRemoved.pipe(
                tap((zipcode) => console.log(`heard that ${zipcode} was removed`)),
                map((zipcode) => {
                    this.weatherService.removeCurrentConditions(zipcode);
                    this.killTimer(zipcode);
                })
            ).subscribe()
        );

        // this.subscriptions.add(
        //   this.locationRemoved.subscribe((data) => {
        //     this.weatherService.removeCurrentConditions(data);
        //   })
        // );
    }

    private killTimer(zipcode: string) {
        const thisTimer = this.timers.find((timer) => timer.zipcode === zipcode);
        if (!!thisTimer) {
            thisTimer.timer.unsubscribe();
        }
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }
}
