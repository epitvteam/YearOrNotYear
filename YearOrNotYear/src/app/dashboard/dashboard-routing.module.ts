import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {DashboardComponent} from './dashboard.component';

@NgModule({
  imports: [RouterModule.forChild([
    { path: 'dashboard', component: DashboardComponent },
  ])],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
