import {Injectable, Signal, signal} from '@angular/core';
import {EMPTY, Observable, ReplaySubject} from 'rxjs';

import {HttpClient} from '@angular/common/http';
import {CurrentConditions} from './current-conditions/current-conditions.type';
import {ConditionsAndZip} from './conditions-and-zip.type';
import {Forecast} from './forecasts-list/forecast.type';
import {catchError, tap} from 'rxjs/operators';
import {StorageService} from './storage.service';

@Injectable()
export class WeatherService {

  static URL = 'https://api.openweathermap.org/data/2.5';
  static APPID = '5a4b2d457ecbef9eb2a71e480b947604';
  static ICON_URL = 'https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/';
  private currentConditions = signal<ConditionsAndZip[]>([]);
  private getCurrentConditionsForZipcodeFailed$: ReplaySubject<string> = new ReplaySubject<string>();

  constructor(private http: HttpClient) {
  }

    public addCurrentConditionsHttp(zipcode: string): Observable<CurrentConditions> {
        if (!zipcode) {
            return;
        }
        // Here we make a request to get the current conditions data from the API.
        // Note the use of backticks and an expression to insert the zipcode
        return this.http.get<CurrentConditions>(`${WeatherService.URL}/weather?zip=${zipcode},us&units=imperial&APPID=${WeatherService.APPID}`).pipe(
            catchError((error) => {
                this.getCurrentConditionsForZipcodeFailed$.next(zipcode);
                StorageService.deleteZipcodeFromList(zipcode);
                return EMPTY;
            })
        );
    }

    addCurrentConditions(zipcode: string, data: CurrentConditions): void {
        if (!zipcode.trim()) {
            return;
        }
        this.currentConditions.update(conditions => {
            const conditionsCopy = [...conditions];
            const exists = conditionsCopy.find((cond) => cond.zip === zipcode);
            if (exists) {
                exists.data = data;
                return conditionsCopy;
            }
            return [...conditionsCopy, {zip: zipcode, data}];
        })
    }

    removeCurrentConditions(zipcode: string) {
      if (!zipcode) {
          return;
      }
        this.currentConditions.update(conditions => {
            const conditionsCopy = [...conditions];
            for (const i in conditionsCopy) {
                if (conditionsCopy[i].zip === zipcode) {
                    conditionsCopy.splice(+i, 1);
                }
            }
            return [...conditionsCopy];
        })
    }

    getForecastHttp(zipcode: string): Observable<Forecast> {
        // Here we make a request to get the forecast data from the API. Note the use of backticks and an expression to insert the zipcode
        return this.http.get<Forecast>(`${WeatherService.URL}/forecast/daily?zip=${zipcode},us&units=imperial&cnt=5&APPID=${WeatherService.APPID}`);
    }

  getForecast(zipcode: string): Observable<Forecast> {
    // Here we make a request to get the forecast data from the API. Note the use of backticks and an expression to insert the zipcode
      return this.http.get<Forecast>(`${WeatherService.URL}/forecast/daily?zip=${zipcode},us&units=imperial&cnt=5&APPID=${WeatherService.APPID}`).pipe(
          tap((forecast) => this.currentConditions.update(conditions => {
              const conditionsCopy = [...conditions];
              conditionsCopy.find((cond) => cond.zip === zipcode).forecast = forecast;
              return [...conditionsCopy];
          }) )
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

    getConditionsFailed () {
        return this.getCurrentConditionsForZipcodeFailed$;
    }

}
