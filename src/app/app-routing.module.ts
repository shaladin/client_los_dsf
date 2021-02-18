import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FullLayoutComponent } from "app/layouts/full/full-layout.component";
import { ContentLayoutComponent } from "app/layouts/content/content-layout.component";

import { Full_ROUTES } from "app/shared/routes/full-layout.routes";
import { CONTENT_ROUTES } from "app/shared/routes/content-layout.routes";

import { AuthGuard } from 'app/shared/auth/auth-guard.service';
import { NavigationConstant } from './shared/constant/NavigationConstant';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: "/pages/login",
    pathMatch: 'full',
  },
  { path: '', component: FullLayoutComponent, data: { title: 'full Views' }, children: Full_ROUTES, canActivate: [AuthGuard] },
  { path: '', component: ContentLayoutComponent, data: { title: 'content Views' }, children: CONTENT_ROUTES },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})

export class AppRoutingModule {
}