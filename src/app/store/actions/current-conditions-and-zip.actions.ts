import {createAction, props} from '@ngrx/store';
import {ConditionsAndZip} from '../../conditions-and-zip.type';
import {CurrentConditions} from '../../current-conditions/current-conditions.type';

export class CurrentConditionsAndZipActions {

    // Add
    public static readonly addZip = createAction('[Weather] Add zip', props<{ zipcode: string }>());
    public static readonly currentConditionsAndZipAdded =
        createAction('[Weather] Current conditions and zip added',
            props<{ currentConditions: ConditionsAndZip }>()
        );
    public static readonly currentConditionsAndZipAddFailure =
        createAction('[Weather] Current conditions and zip failed to add',
            props<{ error: any }>()
        );

    // Remove
    public static readonly removeZip = createAction('[Weather] Remove zip', props<{ zipcode: string }>());
    public static readonly currentConditionsAndZipRemoved =
        createAction('[Weather] Current conditions and zip removed');
    public static readonly currentConditionsAndZipRemoveFailure =
        createAction('[Weather] Current conditions and zip failed to remove',
            props<{ error: any }>()
        );

    // Update
    public static readonly updateZip = createAction('[Weather] Update zip', props<{ zipcode: string }>());
    public static readonly currentConditionsAndZipUpdated =
        createAction('[Weather] Current conditions and zip updated',
            props<{ currentConditions: ConditionsAndZip }>()
        );
    public static readonly currentConditionsAndZipUpdateFailure =
        createAction('[Weather] Current conditions and zip failed to update',
            props<{ error: any }>()
        );
}
