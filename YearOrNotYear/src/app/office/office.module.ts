import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule as NgFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {OfficeRoutingModule} from './office-routing.module';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {OfficeComponent} from './office.component';

@NgModule({
  declarations: [
    OfficeComponent
  ],
  imports: [
    OfficeRoutingModule,
    NgbModule,
    DragDropModule,
    CommonModule,
    NgFormsModule,
    HttpClientModule
  ]
})
export class OfficeModule {
}
