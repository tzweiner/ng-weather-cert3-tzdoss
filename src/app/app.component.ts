import {Component, OnDestroy} from '@angular/core';
import {LocationService} from './location.service';
import {Observable, Subscription, timer} from 'rxjs';
import {WeatherService} from './weather.service';
import {StorageService} from './storage.service';
import {concatMap, delay, map, mergeMap, tap} from 'rxjs/operators';
import {CurrentConditions} from './current-conditions/current-conditions.type';

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
    private locationPrefetch: Observable<string> = this.locationService.getLocationPrefetchObs();
    private getConditionsFailed: Observable<string> = this.weatherService.getConditionsFailed();
    private subscriptions: Subscription = new Subscription();
    private timers: TimerForZipcode[] = [];
    public message = '';

    constructor(private locationService: LocationService, private weatherService: WeatherService) {
        this.initFromLocalStorage();

        this.subscriptions.add(
            this.locationPrefetch.pipe(
                tap((data) => console.log('will be fetching data for ', data)),
                tap((zipcode) => this.getDataForZipcode(zipcode)),
            ).subscribe()
        );

        this.subscriptions.add(
            this.locationAdded.pipe(
                tap((zipcode) => {
                    const thisTimer = timer(StorageService.getRefreshIntervalValueForZipCode(zipcode), StorageService.getRefreshIntervalValueForZipCode(zipcode)).pipe(
                        mergeMap(() => this.weatherService.addCurrentConditionsHttp(zipcode).pipe(
                            tap(data => {
                                this.weatherService.addCurrentConditions(zipcode, data)
                            }),
                            concatMap(() => {
                                return this.weatherService.getForecast(zipcode);
                            }),
                        )));
                    this.timers.push({zipcode, timer: thisTimer.subscribe()});
                    return thisTimer;
                }),
            ).subscribe()
        );

        this.subscriptions.add(
            this.locationRemoved.pipe(
                map((zipcode) => {
                    this.weatherService.removeCurrentConditions(zipcode);
                    StorageService.deleteZipcodeFromList(zipcode);
                    StorageService.recalculateActiveItem(zipcode);
                    StorageService.deleteRefreshIntervalForZipcode(zipcode);
                    this.killTimer(zipcode);
                })
            ).subscribe()
        );

        this.subscriptions.add(
            this.getConditionsFailed.pipe(
                delay(800),
                map((zipcode) => {
                    this.killTimer(zipcode);
                    StorageService.deleteZipcodeFromList(zipcode);
                    StorageService.initActiveItem();
                    StorageService.addZipcodeToInvalidZipcodes(zipcode);
                    this.showToast(zipcode);
                })
            ).subscribe()
        );
    }

    private initFromLocalStorage(): void {
        StorageService.initLists();

        const locString = StorageService.getLocations();
        let locations = [];
        if (locString) {
            locations = JSON.parse(locString);
        }
        for (const zipcode of locations) {
            StorageService.initRefreshIntervalForZipcode(zipcode);
            this.getDataForZipcode(zipcode);
        }
    }

    private killTimer(zipcode: string) {
        const thisTimer = this.timers.find((timer) => timer.zipcode === zipcode);
        const thisTimerIndex = this.timers.findIndex((timer) => timer.zipcode === zipcode);
        if (!!thisTimer) {
            thisTimer.timer.unsubscribe();
            this.timers.splice(thisTimerIndex, 1);
        }
    }

    private showToast(zipcode: string) {
        this.message = `"${zipcode}" is an invalid zip code.`;
        setTimeout(() => this.message = '', 2000);
    }

    private getDataForZipcode(zipcode: string): void {
        this.weatherService.addCurrentConditionsHttp(zipcode).pipe(
            concatMap((conditions: CurrentConditions) => this.weatherService.getForecastHttp(zipcode).pipe(
                map((forecast) => {
                    const newLocationData = {
                        zip: zipcode,
                        data: conditions,
                        forecast
                    };
                    this.locationService.addLocation(newLocationData);
                })
            ))
        ).subscribe();
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }
}
