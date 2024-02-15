import {WeatherService} from '../../weather.service';
import {ConditionsAndZip} from '../../conditions-and-zip.type';
import {inject} from '@angular/core';

export const ADD_CURRENT_CONDITIONS_AND_ZIP = 'ADD_CURRENT_CONDITIONS_AND_ZIP';
export const REMOVE_CURRENT_CONDITIONS_AND_ZIP = 'REMOVE_CURRENT_CONDITIONS_AND_ZIP';
export function currentConditionsAndZipReducer(state: ConditionsAndZip[] = [], action) {
    // const service = inject(WeatherService);
    switch (action.type) {
        case ADD_CURRENT_CONDITIONS_AND_ZIP:
            return [...state, action.payload];
        case REMOVE_CURRENT_CONDITIONS_AND_ZIP:
            let index = 0;
            for (let i = 0; i < state.length; i++) {
                if (state[i] === action.payload) {
                    index = i;
                    break;
                }
            }
            return [
                ...state.slice(0, index),
                ...state.slice(index + 1)
            ]
            // service.removeCurrentConditions(action.payload);
            // return [...state];
        default:
            return state;
    }
}
