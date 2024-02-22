import {Injectable, Type} from '@angular/core';
import {Subject} from 'rxjs';
import {TabsOptions} from './tabs-options.model';

@Injectable()
export class TabsService {

    private removeItem$: Subject<TabsOptions> = new Subject();

    getRemoveItem() {
        return this.removeItem$;
    }

    triggerRemoveItem(item: TabsOptions): void {
        this.removeItem$.next(item);
    }

    constructor() { }
}
