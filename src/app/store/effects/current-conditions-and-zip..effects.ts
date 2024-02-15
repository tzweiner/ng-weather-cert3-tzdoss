import {WeatherService} from '../../weather.service';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {CurrentConditionsAndZipActions} from '../actions/current-conditions-and-zip.actions';
import {catchError, concatMap, map, switchMap} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {EMPTY, of} from 'rxjs';
import {ConditionsAndZip} from '../../conditions-and-zip.type';

@Injectable()
export class CurrentConditionsAndZipEffects {
    constructor(private weatherService: WeatherService, private store: Store, private actions$: Actions) {}

    addZip$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CurrentConditionsAndZipActions.addZip),
            concatMap((actionPayload) =>
                this.weatherService.addCurrentConditions(actionPayload.zipcode).pipe(
                    map((data: ConditionsAndZip) =>
                        CurrentConditionsAndZipActions.currentConditionsAndZipAdded( { currentConditions: data })
                    ),
                    catchError((error) =>
                        of(CurrentConditionsAndZipActions.currentConditionsAndZipAddFailure( { error }))
                    )
                )
            )
        )
    });

    updateZip$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CurrentConditionsAndZipActions.updateZip),
            concatMap((actionPayload) =>
                this.weatherService.updateCurrentConditions(actionPayload.zipcode).pipe(
                    map((data: ConditionsAndZip) =>
                        CurrentConditionsAndZipActions.currentConditionsAndZipUpdated( { currentConditions: data })
                    ),
                    catchError((error) =>
                        of(CurrentConditionsAndZipActions.currentConditionsAndZipUpdateFailure( { error }))
                    )
                )
            )
        )
    });

    removeZip$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CurrentConditionsAndZipActions.removeZip),
            concatMap((actionPayload) =>
                this.weatherService.removeCurrentConditions(actionPayload.zipcode).pipe(
                    map(() =>
                        CurrentConditionsAndZipActions.currentConditionsAndZipRemoved()
                    ),
                    catchError((error) =>
                        of(CurrentConditionsAndZipActions.currentConditionsAndZipRemoveFailure( { error }))
                    )
                )
            )
        )
    });

}
