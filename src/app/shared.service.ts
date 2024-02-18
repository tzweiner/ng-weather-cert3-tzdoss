import {BehaviorSubject} from 'rxjs';
import {Injectable} from '@angular/core';

@Injectable()
export class SharedService {

    toggleView$: BehaviorSubject<string> = new BehaviorSubject('');
    toggleTabTemplate$: BehaviorSubject<string> = new BehaviorSubject('');

    constructor() { }
}
