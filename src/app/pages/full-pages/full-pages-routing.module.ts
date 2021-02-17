import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserProfilePageComponent } from "app/pages/full-pages/user-profile/user-profile-page.component";
import { PathConstant } from 'app/shared/constant/PathConstant';
const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: PathConstant.FULL_PAGES_PROFILE,
        component: UserProfilePageComponent,
        data: {
          title: 'User Profile Page'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FullPagesRoutingModule { }
