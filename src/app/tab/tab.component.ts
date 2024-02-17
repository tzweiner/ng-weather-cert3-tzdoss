import {Component, ContentChild, Input, TemplateRef} from '@angular/core';
import {TabsOptions} from '../tabs/tabs-options.model';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.css']
})
export class TabComponent<Type extends TabsOptions> {
  @ContentChild('tabs', { static: false }) tabsTemplateRef: TemplateRef<any>;
  private _items: Type[];
  @Input() set items(data: Type[]) {
    if (data) {
      this._items = data;
    }
  }
  get items(): Type[] {
    return this._items;
  }
}
