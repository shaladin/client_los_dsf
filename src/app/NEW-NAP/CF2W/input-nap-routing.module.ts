import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';  
import { AppComponent } from './app/app.component';
import { AppPagingComponent } from './app-paging/app-paging.component';
import { AppAddFreeComponent } from './app-add-free/app-add-free.component';
import { AppAddFixedComponent } from './app-add-fixed/app-add-fixed.component';
 

const routes: Routes = [
  {
    path: '',
    children: [ 
        {
          path: 'App',
          component: AppComponent,
          data: {
              title: 'Paging'
          }
        },
        {
          path: 'Paging',
          component: AppPagingComponent,
          data: {
              title: 'Paging'
          }
        },
        {
          path: 'AddFree',
          component: AppAddFreeComponent,
          data: {
              title: 'Add Free Application'
          }
        },
        {
          path: 'AddFixed',
          component: AppAddFixedComponent,
          data: {
              title: 'Add Fixed Application'
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
