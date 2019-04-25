import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule as NgFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {HomeRoutingModule} from './home-routing.module';
import {HomeComponent} from './home.component';
import {MustMatchDirective} from './_helpers/must-match.directive';

@NgModule({
  imports: [
    HomeRoutingModule,
    NgbModule,
    CommonModule,
    NgFormsModule,
    HttpClientModule
  ],
  declarations: [
    HomeComponent,
    MustMatchDirective
  ]
})
export class HomeModule {
}
