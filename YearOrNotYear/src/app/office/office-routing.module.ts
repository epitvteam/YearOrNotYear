import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {OfficeComponent} from './office.component';

@NgModule({
  imports: [RouterModule.forChild([
    { path: 'office', component: OfficeComponent },
  ])],
  exports: [RouterModule]
})
export class OfficeRoutingModule { }
