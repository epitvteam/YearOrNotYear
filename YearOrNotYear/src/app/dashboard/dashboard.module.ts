import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule as NgFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {DashboardRoutingModule} from './dashboard-routing.module';

import {DashboardComponent} from './dashboard.component';

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    DashboardRoutingModule,
    NgbModule,
    CommonModule,
    NgFormsModule,
    HttpClientModule
  ]
})
export class DashboardModule {
}
