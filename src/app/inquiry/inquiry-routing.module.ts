import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppInquiryPagingXComponent } from 'app/impl/inquiry/app-inquiry/app-inquiry-paging-x/app-inquiry-paging-x.component';
import { PathConstantX } from 'app/impl/shared/constant/PathConstantX';
import { PathConstant } from 'app/shared/constant/PathConstant';
import { AppInquiryPagingComponent } from './app-inquiry/app-inquiry-paging.component';
import { PurchaseTrackingInquiryComponent } from './purchase-tracking-inquiry/purchase-tracking-inquiry.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: PathConstant.APP_INQUIRY,
        component: AppInquiryPagingComponent,
        data: {
          title: 'App Inquiry'
        }
      },
      {
        path: PathConstantX.APP_INQUIRY,
        component: AppInquiryPagingXComponent,
        data: {
          title: 'App Inquiry Impl'
        }
      },
      {
        path: PathConstant.PURCHASE_TRACKING_INQUIRY,
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