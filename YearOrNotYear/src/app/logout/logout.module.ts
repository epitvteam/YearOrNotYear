import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule as NgFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {LogoutRoutingModule} from './logout-routing.module';
import {LogoutComponent} from './logout.component';

@NgModule({
  declarations: [
    LogoutComponent
  ],
  imports: [
    NgbModule,
    DragDropModule,
    CommonModule,
    LogoutRoutingModule,
    NgFormsModule,
    HttpClientModule
  ]
})
export class LogoutModule {
}
