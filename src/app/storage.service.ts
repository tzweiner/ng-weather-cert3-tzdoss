import {Injectable} from '@angular/core';
import {RefreshInterval} from './refresh-interval.model';
import {AppSettings} from './app-settings';
import {LOCATIONS} from './location.service';
import {ConditionsAndZip} from './conditions-and-zip.type';

@Injectable()
export class StorageService {
    public static getRefreshInterval(): RefreshInterval {
        const storedInterval = this.getRefreshIntervalValue();
        return AppSettings.refreshIntervals.find((i) => i.value === storedInterval)
    }

    public static getRefreshIntervalValue(): number {
        return JSON.parse(localStorage.getItem(AppSettings.weatherRefreshIntervalName));
    }

    public static getRefreshIntervalForZipCode(zipcode: string): RefreshInterval {
        let cachedValue: RefreshInterval = JSON.parse(localStorage.getItem(`_${zipcode}_refreshInterval`));
        if (!cachedValue) {
            const intervalPerConfigSelected = JSON.parse(localStorage.getItem(AppSettings.weatherRefreshIntervalName));
            cachedValue = AppSettings.refreshIntervals.find((item) => item.value === intervalPerConfigSelected)
        }
        return cachedValue;
    }

    public static getRefreshIntervalValueForZipCode(zipcode: string): number {
        return this.getRefreshIntervalForZipCode(zipcode).value;
    }

    public static getLocations(): string {
        return localStorage.getItem(LOCATIONS);
    }

    public static getDisplayType(): string {
        return JSON.parse(localStorage.getItem(AppSettings.weatherDisplayTypeName));
    }

    public static setLocations(locations: string[]): void {
        localStorage.setItem(LOCATIONS, JSON.stringify(locations));
    }

    public static setRefreshIntervalForZipCode(zipcode: string): void {
        localStorage.setItem(`_${zipcode}_refreshInterval`,
            JSON.stringify(AppSettings.refreshIntervals.find((item) => item.value === StorageService.getRefreshIntervalValue() )) );
    }

    public static setDisplayType(type: string): void {
        localStorage.setItem(AppSettings.weatherDisplayTypeName, JSON.stringify(type));
    }

    public static setRefreshInterval(interval: number): void {
        localStorage.setItem(
            AppSettings.weatherRefreshIntervalName,
            JSON.stringify(interval));
    }

    public static initRefreshIntervalForZipcode(zipcode: string): void {
        localStorage.setItem(`_${zipcode}_refreshInterval`,
            JSON.stringify(StorageService.getRefreshInterval().value) );
    }

    public static initRefreshInterval(): RefreshInterval {
        return AppSettings.refreshIntervals.find((i) => {
            let searchForValue = AppSettings.defaultRefreshInterval;
            const storedValue = StorageService.getRefreshIntervalValue();
            if (storedValue) {
                searchForValue = storedValue;
            }
            return i.value === searchForValue;
        });
    }

    public static deleteRefreshIntervalForZipcode(zipcode: string): void {
        localStorage.removeItem(`_${zipcode}_refreshInterval`);
    }
}
