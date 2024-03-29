import {Component, inject, Input, TemplateRef} from '@angular/core';
import {TabsOptions} from '../tabs-options.model';
import {Router} from '@angular/router';
import {RefreshInterval} from '../refresh-interval.model';
import {StorageService} from '../storage.service';


@Component({
  selector: 'app-tab-panel',
  templateUrl: './tab-panel.component.html',
  styleUrl: './tab-panel.component.css'
})
export class TabPanelComponent<Type extends TabsOptions> {
  private router = inject(Router);
  private _item: Type;

  @Input()
  panelTemplate?: TemplateRef<any>;

  @Input() set item(data: Type) {
    if (data) {
      this._item = data;
    }
  }

  get item(): Type {
    return this._item;
  }

  showForecast(zipcode: string) {
    this.router.navigate(['/forecast', zipcode])
  }

}
