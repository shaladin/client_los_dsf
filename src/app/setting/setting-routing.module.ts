import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppSourcePagingComponent } from './app-source/app-source-paging/app-source-paging.component';
import { AppSourceAddEditComponent } from './app-source/app-source-add-edit/app-source-add-edit.component';
import { AppSourceOfficeMemberPagingComponent } from './app-source/app-source-office-member/app-source-office-member-paging/app-source-office-member-paging.component';
import { AppSourceOfficeMemberAddComponent } from './app-source/app-source-office-member/app-source-office-member-add/app-source-office-member-add.component';
import { PathConstant } from 'app/shared/constant/PathConstant';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'AppSource/Paging',
        component: AppSourcePagingComponent,
        data: {
          title: 'Application Source Paging'
        },
      },
      {
        path: 'AppSource/Detail',
        component: AppSourceAddEditComponent,
        data: {
          title: 'Application Source Add Edit'
        },
      },
      {
        path: 'AppSource/OfficeMember/Paging',
        component: AppSourceOfficeMemberPagingComponent,
        data: {
          title: 'Application Source Office Member Paging'
        },
      },
      {
        path: 'AppSource/OfficeMember/Add',
        component: AppSourceOfficeMemberAddComponent,
        data: {
          title: 'Application Source Office Member Add'
        },
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingRoutingModule { }
