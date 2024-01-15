import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppSourcePagingComponent } from './app-source/app-source-paging/app-source-paging.component';
import { AppSourceAddEditComponent } from './app-source/app-source-add-edit/app-source-add-edit.component';
import { AppSourceOfficeMemberPagingComponent } from './app-source/app-source-office-member/app-source-office-member-paging/app-source-office-member-paging.component';
import { AppSourceOfficeMemberAddComponent } from './app-source/app-source-office-member/app-source-office-member-add/app-source-office-member-add.component';
import { PathConstant } from 'app/shared/constant/PathConstant';
import { AppSourcePagingXComponent } from 'app/impl/setting/app-source/app-source-paging-x/app-source-paging-x.component';
import { AppSourceAddEditXComponent } from 'app/impl/setting/app-source/app-source-add-edit-x/app-source-add-edit-x.component';
import { AppSourceOfficeMemberPagingXComponent } from 'app/impl/setting/app-source/app-source-office-member/app-source-office-member-paging-x/app-source-office-member-paging-x.component';
import { AppSourceOfficeMemberAddXComponent } from 'app/impl/setting/app-source/app-source-office-member/app-source-office-member-add-x/app-source-office-member-add-x.component';
import { PathConstantX } from 'app/impl/shared/constant/PathConstantX';


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
      },
      {
        path: PathConstantX.APP_SRC_PAGING_X,
        component: AppSourcePagingXComponent,
        data: {
          title: 'Application Source Paging'
        },
      },
      {
        path: PathConstantX.APP_SRC_DETAIL_X,
        component: AppSourceAddEditXComponent,
        data: {
          title: 'Application Source Add Edit'
        },
      },
      {
        path: PathConstantX.APP_SRC_OFFICE_MBR_PAGING_X,
        component: AppSourceOfficeMemberPagingXComponent,
        data: {
          title: 'Application Source Office Member Paging'
        },
      },
      {
        path: PathConstantX.APP_SRC_OFFICE_MBR_ADD_X,
        component: AppSourceOfficeMemberAddXComponent,
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
