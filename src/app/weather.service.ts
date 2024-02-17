import {Injectable, Signal, signal} from '@angular/core';
import {Observable, timer} from 'rxjs';

import {HttpClient} from '@angular/common/http';
import {CurrentConditions} from './current-conditions/current-conditions.type';
import {ConditionsAndZip} from './conditions-and-zip.type';
import {Forecast} from './forecasts-list/forecast.type';
import {AppSettings} from './app-settings';
import {RefreshInterval} from './refresh-interval.model';
import {concatMap, map, mergeMap, skipUntil, switchMap, tap, withLatestFrom} from 'rxjs/operators';
import {StorageService} from './storage.service';

@Injectable()
export class WeatherService {

  static URL = 'http://api.openweathermap.org/data/2.5';
  static APPID = '5a4b2d457ecbef9eb2a71e480b947604';
  static ICON_URL = 'https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/';
  private currentConditions = signal<ConditionsAndZip[]>([]);

  constructor(private http: HttpClient) {
  }

    public addCurrentConditionsHttp(zipcode: string): Observable<CurrentConditions> {
        // Here we make a request to get the current conditions data from the API.
        // Note the use of backticks and an expression to insert the zipcode
        // return this.http.get<CurrentConditions>(`${WeatherService.URL}/weather?zip=${zipcode},us&units=imperial&APPID=${WeatherService.APPID}`).pipe(
        //     skipUntil(timer(0, StorageService.getRefreshIntervalValueForZipCode(zipcode)))
        // );
        if (!zipcode) {
            return;
        }
        return this.http.get<CurrentConditions>(`${WeatherService.URL}/weather?zip=${zipcode},us&units=imperial&APPID=${WeatherService.APPID}`);
        // return timer(0, StorageService.getRefreshIntervalValueForZipCode(zipcode)).pipe(
        //     switchMap(() => this.http.get<CurrentConditions>(`${WeatherService.URL}/weather?zip=${zipcode},us&units=imperial&APPID=${WeatherService.APPID}`).pipe(
        //         tap((data) => console.log('in hereeeeeee'))
        //     ))
        // )
    }

    addCurrentConditions(zipcode: string, data: CurrentConditions): void {
        if (!zipcode.trim()) {
            return;
        }
        this.currentConditions.update(conditions => {
            const exists = conditions.find((cond) => cond.zip === zipcode);
            if (exists) {
                exists.data = data;
                return conditions;
            }
            return [...conditions, {zip: zipcode, data}];
        })
    }

    // addCurrentConditions(zipcode: string): void {
    //   if (!zipcode.trim()) {
    //       return;
    //   }
    //     this.addCurrentConditionsHttp(zipcode)
    //         .subscribe(data => this.currentConditions.update(conditions => {
    //             const exists = conditions.find((cond) => cond.zip === zipcode);
    //             if (exists) {
    //                 exists.data = data;
    //                 return conditions;
    //             }
    //             return [...conditions, {zip: zipcode, data}];
    //         }));
    // }

    removeCurrentConditions(zipcode: string) {
      if (!zipcode) {
          return;
      }
        this.currentConditions.update(conditions => {
            for (const i in conditions) {
                if (conditions[i].zip === zipcode) {
                    conditions.splice(+i, 1);
                }
            }
            return conditions;
        })
    }

  getCurrentConditions(): Signal<ConditionsAndZip[]> {
    return this.currentConditions.asReadonly();
  }

  getForecast(zipcode: string): Observable<Forecast> {
    // Here we make a request to get the forecast data from the API. Note the use of backticks and an expression to insert the zipcode
    // return this.http.get<Forecast>(`${WeatherService.URL}/forecast/daily?zip=${zipcode},us&units=imperial&cnt=5&APPID=${WeatherService.APPID}`);
      return timer(0, StorageService.getRefreshInterval().value).pipe(
          switchMap(() => this.http.get<Forecast>(`${WeatherService.URL}/forecast/daily?zip=${zipcode},us&units=imperial&cnt=5&APPID=${WeatherService.APPID}`))
      );
  }

  getWeatherIcon(id): string {
    if (id >= 200 && id <= 232) {
      return WeatherService.ICON_URL + 'art_storm.png';
    } else if (id >= 501 && id <= 511) {
      return WeatherService.ICON_URL + 'art_rain.png';
    } else if (id === 500 || (id >= 520 && id <= 531)) {
        return WeatherService.ICON_URL + 'art_light_rain.png';
    } else if (id >= 600 && id <= 622) {
        return WeatherService.ICON_URL + 'art_snow.png';
    } else if (id >= 801 && id <= 804) {
        return WeatherService.ICON_URL + 'art_clouds.png';
    } else if (id === 741 || id === 761) {
        return WeatherService.ICON_URL + 'art_fog.png';
    } else {
        return WeatherService.ICON_URL + 'art_clear.png';
    }
  }

}
