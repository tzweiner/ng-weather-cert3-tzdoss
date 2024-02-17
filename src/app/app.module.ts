import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { AppComponent } from './app.component';
import { AddZipcodeComponent } from './add-zipcode/add-zipcode.component';
import {LocationService} from './location.service';
import { ForecastsListComponent } from './forecasts-list/forecasts-list.component';
import {WeatherService} from './weather.service';
import { CurrentConditionsComponent } from './current-conditions/current-conditions.component';
import { MainPageComponent } from './main-page/main-page.component';
import {RouterModule} from '@angular/router';
import {routing} from './app.routing';
import {HttpClientModule} from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import {RefreshIntervalComponent} from './refresh-interval/refresh-interval.component';
import {TabsComponent} from './tabs/tabs.component';
import {TabComponent} from './tab/tab.component';
import {TabPanelComponent} from './tab-panel/tab-panel.component';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';

@NgModule({
  declarations: [
    AppComponent,
    AddZipcodeComponent,
    ForecastsListComponent,
    CurrentConditionsComponent,
    MainPageComponent,
    RefreshIntervalComponent,
      TabsComponent,
      TabComponent,
      TabPanelComponent,
  ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        RouterModule,
        routing,
        ServiceWorkerModule.register('/ngsw-worker.js', {enabled: environment.production}),
        ReactiveFormsModule,
        StoreModule.forRoot(),
        EffectsModule.forRoot()
    ],
  providers: [LocationService, WeatherService],
  bootstrap: [AppComponent]
})
export class AppModule { }
