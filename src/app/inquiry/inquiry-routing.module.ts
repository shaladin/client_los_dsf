import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PathConstant } from 'app/shared/constant/PathConstant';
import { AppInquiryPagingComponent } from './app-inquiry/app-inquiry-paging.component';
import { ProdHoInquiryComponent } from './prod-ho-inquiry/prod-ho-inquiry.component';
import { ProdOfferingInquiryComponent } from './prod-offering-inquiry/prod-offering-inquiry.component';
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
        path: PathConstant.PURCHASE_TRACKING_INQUIRY,
        component: PurchaseTrackingInquiryComponent,
        data: {
          title: 'Purchase Tracking Inquiry'
        }
      },
      {
        path: PathConstant.PROD_INQUIRY,
        component: ProdHoInquiryComponent,
        data: {
          title: 'Product Inquiry'
        }
      },
      {
        path: PathConstant.PROD_OFF_INQUIRY,
        component: ProdOfferingInquiryComponent,
        data: {
          title: 'Product Offering Inquiry'
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