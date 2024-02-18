import {Component, HostListener, Input} from '@angular/core';
import {TabsOptions} from '../tabs/tabs-options.model';

type State = 'active' | 'default';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.css']
})
export class TabComponent<Type extends TabsOptions> {
  private _item: Type;
  public state: State = 'default';

  @Input() set item(data: Type) {
    if (data) {
      this._item = data;
    }
  }

  @HostListener('click')
  toggleState() {
    this.state = 'active';
  }

  get item(): Type {
    return this._item;
  }

}
