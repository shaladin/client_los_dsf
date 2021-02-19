import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';  
import { AppComponent } from './app/app.component';
import { AppPagingComponent } from './app-paging/app-paging.component';
import { AppAddFreeComponent } from './app-add-free/app-add-free.component';
import { AppAddFixedComponent } from './app-add-fixed/app-add-fixed.component';
import { AppAddDetailComponent } from './app-add-detail/app-add-detail.component';
import { PathConstant } from 'app/shared/constant/PathConstant';
 

const routes: Routes = [
  {
    path: '',
    children: [ 
        {
          path: PathConstant.CF2W_APP,
          component: AppComponent,
          data: {
              title: 'Paging'
          }
        },
        {
          path: PathConstant.PAGING,
          component: AppPagingComponent,
          data: {
              title: 'Paging'
          }
        },
        {
          path: PathConstant.CF2W_ADD_FREE,
          component: AppAddFreeComponent,
          data: {
              title: 'Add Free Application'
          }
        },
        {
          path: PathConstant.CF2W_ADD_FIXED,
          component: AppAddFixedComponent,
          data: {
              title: 'Add Fixed Application'
          }
        },
        {
          path: PathConstant.ADD_DETAIL,
          component: AppAddDetailComponent,
          data: {
              title: 'Add Detail Application'
          }
        },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InputNapCF2WRoutingModule { }
