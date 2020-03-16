import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppInquiryPagingComponent } from './app-inquiry/app-inquiry-paging.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'AppInquiry',
        component: AppInquiryPagingComponent,
        data: {
          title: 'App Inquiry'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InquiryRoutingComponent { }
