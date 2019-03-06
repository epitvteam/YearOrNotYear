import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule as NgFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {AdminRoutingModule} from './admin-routing.module';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {AdminComponent} from './admin.component';

@NgModule({
  declarations: [
    AdminComponent
  ],
  imports: [
    AdminRoutingModule,
    NgbModule,
    DragDropModule,
    CommonModule,
    NgFormsModule,
    HttpClientModule
  ]
})
export class AdminModule {
}
