import {Component, OnDestroy} from '@angular/core';
import {LocationService} from './location.service';
import { Observable, Subscription, timer} from 'rxjs';
import {WeatherService} from './weather.service';
import {StorageService} from './storage.service';
import {concatMap, map, mergeMap, tap} from 'rxjs/operators';

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
    private getConditionsFailed: Observable<string> = this.weatherService.getConditionsFailed();
    private subscriptions: Subscription = new Subscription();
    private timers: TimerForZipcode[] = [];
    public message = '';

    constructor(private locationService: LocationService, private weatherService: WeatherService) {
        this.initFromLocalStorage();

        this.subscriptions.add(
            this.locationAdded.pipe(
                tap((zipcode) => {
                    const thisTimer = timer(0, StorageService.getRefreshIntervalValueForZipCode(zipcode)).pipe(
                        mergeMap(() => this.weatherService.addCurrentConditionsHttp(zipcode).pipe(
                            tap(data => this.weatherService.addCurrentConditions(zipcode, data)),
                            concatMap(() => this.weatherService.getForecast(zipcode))
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
                map((zipcode) => {
                    this.killTimer(zipcode);
                    StorageService.deleteZipcodeFromList(zipcode);
                    StorageService.recalculateActiveItem(zipcode);
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
            this.locationService.addLocation(zipcode, true);
        }
    }

    private killTimer(zipcode: string) {
        const thisTimer = this.timers.find((timer) => timer.zipcode === zipcode);
        if (!!thisTimer) {
            thisTimer.timer.unsubscribe();
        }
    }

    private showToast(zipcode: string) {
        this.message = `"${zipcode}" is an invalid zip code.`;
        setTimeout(() => this.message = '', 2000);
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }
}
