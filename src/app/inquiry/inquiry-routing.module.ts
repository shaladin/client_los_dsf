import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppInquiryPagingComponent } from './app-inquiry/app-inquiry-paging.component';
import { PurchaseTrackingInquiryComponent } from './purchase-tracking-inquiry/purchase-tracking-inquiry.component';

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
      },
      {
        path: 'PurchaseTrackingInquiry',
        component: PurchaseTrackingInquiryComponent,
        data: {
          title: 'Purchase Tracking Inquiry'
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