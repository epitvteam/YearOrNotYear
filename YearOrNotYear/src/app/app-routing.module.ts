import {NgModule} from '@angular/core';
import {Routes, RouterModule, Router} from '@angular/router';
import {AuthGuard} from './auth.guard';

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: '', loadChildren: './home/home.module#HomeModule'},
  {path: '', canActivate: [AuthGuard], loadChildren: './dashboard/dashboard.module#DashboardModule'},
  {path: '', loadChildren: './logout/logout.module#LogoutModule'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true}), RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor(private router: Router) {
    this.router.errorHandler = (error: any) => {
      console.log(error);
      this.router.navigate(['']);
    };
  }
}
