import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {AdminComponent} from './admin.component';

@NgModule({
  imports: [RouterModule.forChild([
    { path: 'office', component: AdminComponent },
  ])],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
