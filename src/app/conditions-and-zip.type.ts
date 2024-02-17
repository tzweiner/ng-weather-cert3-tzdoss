import {CurrentConditions} from './current-conditions/current-conditions.type';
import {RefreshInterval} from './refresh-interval.model';
import {Forecast} from './forecasts-list/forecast.type';

export interface ConditionsAndZip {
    zip: string;
    data: CurrentConditions;
    forecast?: Forecast;
    active?: boolean;
}
