import {CurrentConditions} from '../current-conditions/current-conditions.type';

export interface TabsOptions {
    zip?: string;
    active?: boolean;
    data?: CurrentConditions;
}
