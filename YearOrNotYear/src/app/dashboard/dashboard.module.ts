import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule as NgFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {DashboardRoutingModule} from './dashboard-routing.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {DashboardComponent} from './dashboard.component';
import {BrowserModule} from "@angular/platform-browser";

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    DashboardRoutingModule,
    NgbModule,
    DragDropModule,
    CommonModule,
    NgFormsModule,
    HttpClientModule
  ]
})
export class DashboardModule {
}
