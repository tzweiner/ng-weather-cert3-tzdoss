import {CurrentConditions} from './current-conditions/current-conditions.type';
import {RefreshInterval} from './refresh-interval.model';

export interface ConditionsAndZip {
    zip: string;
    data: CurrentConditions;
    active?: boolean;
    refreshInterval?: RefreshInterval;
}
