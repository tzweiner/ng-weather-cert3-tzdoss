import {Component, Input} from '@angular/core';
import {ConditionsAndZip} from '../conditions-and-zip.type';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss'
})
export class TabsComponent {

  @Input()
  public data: ConditionsAndZip[];

}
