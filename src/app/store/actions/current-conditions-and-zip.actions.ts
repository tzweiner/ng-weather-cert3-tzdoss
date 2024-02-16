import {createAction, props} from '@ngrx/store';
import {ConditionsAndZip} from '../../conditions-and-zip.type';
import {CurrentConditions} from '../../current-conditions/current-conditions.type';

export class CurrentConditionsAndZipActions {

    // Add
    public static readonly addZip = createAction('[Weather] Add zip', props<{ zipcode: string }>());
    public static readonly zipAdded =
        createAction('[Weather] Current conditions and zip added',
            props<{ zipcode: string }>()
        );

    // Remove
    public static readonly removeZip = createAction('[Weather] Remove zip', props<{ zipcode: string }>());
    public static readonly zipRemoved =
        createAction('[Weather] Current conditions and zip removed');

    // Update
    public static readonly updateZip = createAction('[Weather] Update zip', props<{ zipcode: string }>());
    public static readonly zipUpdated =
        createAction('[Weather] Current conditions and zip updated',
            props<{ currentConditions: ConditionsAndZip }>()
        );
}
