import {Component, HostListener, Input} from '@angular/core';
import {TabsOptions} from '../tabs-options.model';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.css']
})
export class TabComponent<Type extends TabsOptions> {
  private _item: Type;

  @Input() set item(data: Type) {
    if (data) {
      this._item = data;
    }
  }

  get item(): Type {
    return this._item;
  }

}
