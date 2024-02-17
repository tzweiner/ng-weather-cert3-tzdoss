import {Component, ContentChild, Input, TemplateRef} from '@angular/core';
import {TabsOptions} from '../tabs/tabs-options.model';

@Component({
  selector: 'app-tab-panel',
  templateUrl: './tab-panel.component.html',
  styleUrl: './tab-panel.component.scss'
})
export class TabPanelComponent<Type extends TabsOptions> {
  @ContentChild('tabPanels', { static: false }) tabPanelsTemplateRef: TemplateRef<any>;
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
